const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { user_id, rating, comment } = req.body;
    const reviewId = await Review.createReview(user_id, rating, comment);
    // Emit newReview event
    const io = req.app.get('io');
    if (io) {
      io.emit('newReview', { id: reviewId, user_id, rating, comment });
    }
    res.status(201).json({ id: reviewId, user_id, rating, comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    await Review.updateReview(req.params.id, req.body);
    res.json({ message: 'Review updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.deleteReview(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 