const pool = require('../config/db');
const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
    const { customerId, items, totalAmount, deliveryAddress, status, orderTime } = req.body;
    try {
        const [order] = await pool.query("INSERT INTO orders (customerId, deliveryAddress, totalAmount, status, orderTime) VALUES (?, ?, ?, ?, ?)", 
                                        [customerId, deliveryAddress, totalAmount, status, orderTime]);
        const orderId = order.insertId;

        for (const item of items) {
            await pool.query("INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)", 
                            [orderId, item.menu_item_id, item.quantity]);
        }

        // Emit newOrder event
        const io = req.app.get('io');
        if (io) {
          io.emit('newOrder', { id: orderId, name: items.map(i => i.name).join(', '), customerId, totalAmount, deliveryAddress, status, orderTime });
        }

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.id, o.orderName, o.status, o.totalAmount, o.orderTime, o.deliveryAddress, c.id AS customerId
            FROM orders o
            LEFT JOIN customers c ON o.customerId = c.id
        `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        // Emit orderStatusChanged event
        const io = req.app.get('io');
        if (io) {
          io.emit('orderStatusChanged', { orderId: id, status });
        }
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLiveOrders = async (req, res) => {
    try {
        const [orders] = await pool.query("SELECT * FROM orders WHERE status IN ('Ordered', 'Cooking', 'Packed', 'Out for Delivery', 'Delivered')");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.getOrderHistory();
        for (let order of orders) {
            order.items = await Order.getOrderItems(order.id);
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserOrderHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        const [orders] = await pool.query("SELECT * FROM orders WHERE status = 'completed' AND customerId = ?", [userId]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createDummyOrder = async (req, res) => {
    try {
        // Get all customers
        const [customers] = await pool.query('SELECT id, name, address FROM customers');
        if (customers.length === 0) return res.status(400).json({ error: 'No customers found' });
        const customer = customers[Math.floor(Math.random() * customers.length)];

        // Possible statuses
        const statuses = ['Ordered', 'Cooking', 'Packed', 'Out for Delivery', 'Delivered'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Generate random total and name/address
        const total = Math.floor(Math.random() * 1000) + 100;
        // Use a random Indian dish as the order name
        const dishes = [
          'Butter Chicken', 'Paneer Tikka', 'Chicken Biryani', 'Masala Dosa', 'Chole Bhature',
          'Rogan Josh', 'Dal Makhani', 'Fish Curry', 'Aloo Gobi', 'Palak Paneer',
          'Egg Curry', 'Chicken 65', 'Veg Pulao', 'Hyderabadi Biryani', 'Pav Bhaji',
          'Dhokla', 'Samosa', 'Rajma Chawal', 'Kadai Paneer', 'Mutton Curry'
        ];
        const orderName = dishes[Math.floor(Math.random() * dishes.length)];
        const address = customer.address || 'Random Address';

        // Generate a random date within the last 90 days
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 90); // 0 to 89 days ago
        const randomDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        randomDate.setHours(Math.floor(Math.random() * 24));
        randomDate.setMinutes(Math.floor(Math.random() * 60));
        randomDate.setSeconds(Math.floor(Math.random() * 60));

        // Insert the order (fill both new and old columns)
        const [result] = await pool.query(
            `INSERT INTO orders 
                (orderName, customerId, deliveryAddress, totalAmount, status, orderTime, name, address, total, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
            [
                orderName, customer.id, address, total, status, randomDate, // new columns
                orderName, address, total, randomDate // old columns
            ]
        );
        const orderId = result.insertId;

        // Emit newOrder event
        const io = req.app.get('io');
        if (io) {
            io.emit('newOrder', {
                id: orderId,
                name: orderName,
                customerId: customer.id,
                address,
                total,
                status,
                createdAt: randomDate
            });
        }

        res.status(201).json({ message: 'Dummy order created', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
