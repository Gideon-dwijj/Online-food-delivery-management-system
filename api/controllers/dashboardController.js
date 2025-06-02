const User = require('../models/User');
const Order = require('../models/Order');
const DeliveryAgent = require('../models/DeliveryAgent');

exports.getSummary = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const agentCount = await DeliveryAgent.countDocuments();
    res.json({ userCount, orderCount, agentCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 