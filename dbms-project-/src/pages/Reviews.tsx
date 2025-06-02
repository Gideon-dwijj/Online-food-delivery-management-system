import React, { useEffect, useState } from 'react';
import { Star, Package, User, Calendar } from 'lucide-react';
import { Review } from '../types';
import api from '../services/api';

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-600">Customer #{review.customerId}</span>
      </div>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Package className="w-4 h-4" />
        <span>Order #{review.orderId}</span>
      </div>
      
      <p className="text-gray-700">{review.feedback}</p>
      
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Calendar className="w-4 h-4" />
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        // Map backend fields to frontend type if needed
        const mapped = res.data.map((review: any) => ({
          id: review.id,
          orderId: review.order_id || review.orderId,
          customerId: review.user_id || review.customerId,
          rating: review.rating,
          feedback: review.comment || review.feedback,
          createdAt: review.createdAt || review.created_at || new Date(),
        }));
        setReviews(mapped);
        setError('');
      } catch (err) {
        setError('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = ratingFilter === 'All Ratings'
    ? reviews
    : reviews.filter(review => review.rating === parseInt(ratingFilter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
          >
            <option>All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredReviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;