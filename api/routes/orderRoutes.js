const express = require('express');
const Order = require('../models/Order');
const orderController = require('../controllers/orderController');

const router = express.Router();

// 🛒 Create Order
router.post('/create', async (req, res) => {
    console.log("✅ Order creation request received:", req.body);
    const { orderName, customerId, deliveryAddress, totalAmount, status, orderTime } = req.body;

    try {
        const orderId = await Order.createOrder(orderName, customerId, deliveryAddress, totalAmount, status, orderTime);
        // Emit real-time event
        const io = req.app.get('io');
        io.emit('newOrder', {
            id: orderId,
            name: orderName,
            customerId,
            address: deliveryAddress,
            total: totalAmount,
            status,
            createdAt: orderTime
        });
        res.status(201).json({ message: 'Order placed', orderId });
    } catch (error) {
        console.error("❌ Error creating order:", error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// 📜 Get All Orders
router.get('/all', async (req, res) => {
    console.log("✅ /api/orders/all route hit!");
    try {
        const orders = await Order.getAllOrders();
        console.log("✅ Orders retrieved:", orders);
        res.json(orders);
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// 🛠 Update Order Status
router.put('/update/:id', async (req, res) => {
    console.log("✅ Order update request received for ID:", req.params.id, "with data:", req.body);
    const { id } = req.params;
    const { status } = req.body;

    try {
        await Order.updateOrderStatus(id, status);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        console.error("❌ Error updating order:", error);
        res.status(500).json({ message: 'Error updating order' });
    }
});

router.get('/live', orderController.getLiveOrders);
router.get('/history', orderController.getOrderHistory);
router.get('/history/user/:userId', orderController.getUserOrderHistory);
router.post('/dummy', orderController.createDummyOrder);

module.exports = router;
