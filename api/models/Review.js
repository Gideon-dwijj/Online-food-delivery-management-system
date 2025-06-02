const pool = require('../config/db');

const Review = {
    createReview: async (userId, rating, comment) => {
        const [result] = await pool.query(
            'INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)',
            [userId, rating, comment]
        );
        return result.insertId;
    },

    getAllReviews: async () => {
        const [rows] = await pool.query('SELECT * FROM reviews');
        return rows;
    },

    getReviewById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
        return rows[0];
    },

    updateReview: async (id, data) => {
        const { rating, comment } = data;
        await pool.query(
            'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
            [rating, comment, id]
        );
    },

    deleteReview: async (id) => {
        await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    }
};

module.exports = Review; 