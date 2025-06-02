const express = require('express');
const DeliveryAgent = require('../models/DeliveryAgent');

const router = express.Router();

// Get agents filtered by status
router.get('/', async (req, res) => {
    const { status } = req.query; // Get status from query parameter

    try {
        const agents = await DeliveryAgent.getAgentsByStatus(status);
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agents' });
    }
});

// Assign an order to an agent
router.put('/assign/:agentId', async (req, res) => {
    const { agentId } = req.params;
    const { orderId, location } = req.body;

    try {
        await DeliveryAgent.assignOrderToAgent(agentId, orderId, location);
        res.json({ message: 'Agent assigned to order' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning agent' });
    }
});

// Mark delivery as complete
router.put('/complete/:agentId', async (req, res) => {
    const { agentId } = req.params;

    try {
        await DeliveryAgent.completeDelivery(agentId);
        res.json({ message: 'Delivery completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error completing delivery' });
    }
});

module.exports = router;
