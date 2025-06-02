const pool = require('../config/db');

const Customer = {
    createCustomer: async (name, email, phone, address) => {
        const [result] = await pool.query(
            'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [name, email, phone, address]
        );
        return result.insertId;
    },

    getAllCustomers: async () => {
        const [rows] = await pool.query('SELECT * FROM customers');
        return rows;
    },

    getCustomerById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
        return rows[0];
    },

    updateCustomer: async (id, data) => {
        const { name, email, phone, address } = data;
        await pool.query(
            'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
            [name, email, phone, address, id]
        );
    },

    deleteCustomer: async (id) => {
        await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    }
};

module.exports = Customer; 