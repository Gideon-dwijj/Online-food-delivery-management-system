const db = require('../config/db');

const Order = {
    createOrder: async (orderName, customerId, deliveryAddress, totalAmount, status, orderTime) => {
        const [result] = await db.query(
            'INSERT INTO orders (name, customerId, address, total, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [orderName, customerId, deliveryAddress, totalAmount, status, orderTime]
        );
        return result.insertId;
    },

    getAllOrders: async () => {
        const [rows] = await db.query('SELECT * FROM orders');
        return rows;
    },

    updateOrderStatus: async (id, status) => {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    },

    getOrderHistory: async () => {
        const [rows] = await db.query('SELECT * FROM orders WHERE status IN ("Delivered", "delivered") ORDER BY createdAt DESC');
        return rows;
    },

    getLiveOrders: async () => {
        const [rows] = await db.query('SELECT * FROM orders WHERE status IN ("pending", "in-progress", "Cooking", "Ordered")');
        return rows;
    },

    getOrderItems: async (orderId) => {
        const [rows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
        return rows;
    }
};

module.exports = Order;
