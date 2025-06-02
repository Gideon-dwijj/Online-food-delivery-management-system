const pool = require('../config/db');

exports.getAnalytics = async (req, res) => {
    try {
        const [ordersPerDay] = await pool.query(`
            SELECT DAYNAME(created_at) as day, COUNT(*) as count
            FROM orders
            GROUP BY day
        `);

        const [marketingChannels] = await pool.query(`
            SELECT source, COUNT(*) as count
            FROM reviews
            GROUP BY source
        `);

        res.json({ ordersPerDay, marketingChannels });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalRevenue = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT SUM(totalAmount) as totalRevenue FROM orders");
        res.json({ totalRevenue: result[0].totalRevenue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopCustomers = async (req, res) => {
    try {
        const [customers] = await pool.query(`
            SELECT c.id, c.name, COUNT(o.id) as orderCount, SUM(o.totalAmount) as totalSpent
            FROM customers c
            JOIN orders o ON c.id = o.customerId
            GROUP BY c.id, c.name
            ORDER BY totalSpent DESC
            LIMIT 5
        `);
        res.json({ topCustomers: customers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderStatusDistribution = async (req, res) => {
    try {
        const [statusCounts] = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM orders
            GROUP BY status
        `);
        res.json({ statusCounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.statusBreakdown = async (req, res) => {
    const days = parseInt(req.query.days) || 7;
    try {
        const [statusCounts] = await pool.query(`
            SELECT status, COUNT(*) as count
            FROM orders
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
            GROUP BY status
        `);
        res.json(statusCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
