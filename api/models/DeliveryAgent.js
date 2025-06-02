const pool = require('../config/db');

const DeliveryAgent = {
    getAgentsByStatus: async (status) => {
        let query = `SELECT da.id, da.name, da.agent_id, da.profile_img, da.status, da.current_order_id, da.location, o.address AS current_order_address
                     FROM delivery_agents da
                     LEFT JOIN orders o ON da.current_order_id = o.id`;
        let params = [];

        if (status && status !== "all") {
            query += " WHERE da.status = ?";
            params.push(status);
        }

        const [agents] = await pool.query(query, params);
        return agents;
    },

    assignOrderToAgent: async (agentId, orderId, location) => {
        await pool.query(
            "UPDATE delivery_agents SET status = 'delivering', current_order_id = ?, location = ? WHERE agent_id = ?",
            [orderId, location, agentId]
        );
    },

    completeDelivery: async (agentId) => {
        await pool.query(
            "UPDATE delivery_agents SET status = 'free', current_order_id = NULL, location = NULL WHERE agent_id = ?",
            [agentId]
        );
    }
};

module.exports = DeliveryAgent;
