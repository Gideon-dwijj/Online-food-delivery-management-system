const express = require('express');
const pool = require('../config/db');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/daily-orders', async (req, res) => {
    const { days } = req.query;
    const daysInt = parseInt(days) || 7; // default to 7 days
    try {
        const [dailyOrders] = await pool.query(`
            SELECT DATE(createdAt) AS order_date, COUNT(*) AS total_orders
            FROM orders
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(createdAt)
        `, [daysInt]);
        res.json(dailyOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily orders' });
    }
});

router.get('/weekly-marketing', async (req, res) => {
    const { days } = req.query;
    const daysInt = parseInt(days) || 7; // default to 7 days
    try {
        const [weeklyMarketing] = await pool.query(`
            SELECT status AS category, COUNT(*) AS order_count
            FROM orders
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY status
        `, [daysInt]);
        res.json(weeklyMarketing);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weekly marketing data' });
    }
});

router.get('/monthly-trend', async (req, res) => {
    try {
        const [monthlyTrend] = await pool.query(`
            SELECT MONTH(createdAt) AS month, COUNT(*) AS total_orders
            FROM orders
            GROUP BY MONTH(createdAt)
        `);
        res.json(monthlyTrend);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monthly trends' });
    }
});

router.get('/total-revenue', analyticsController.getTotalRevenue);
router.get('/top-customers', analyticsController.getTopCustomers);
router.get('/order-status-distribution', analyticsController.getOrderStatusDistribution);
router.get('/status-breakdown', analyticsController.statusBreakdown);

module.exports = router;
