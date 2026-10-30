'use client';

import { useState } from 'react';

export default function ListingReviews({ listingId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, rating, comment })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      const newReview = data.data || data.review;
      if (newReview) {
        setReviews((prev) => [newReview, ...prev]);
      }
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-card border border-outline shadow-sm flex flex-col gap-6">
      <h3 className="font-plus-jakarta text-sm font-bold text-primary uppercase tracking-wider">
        Reviews ({reviews.length})
      </h3>

      {/* Review submit form */}
      <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-5 bg-gray-50 rounded-card border border-outline">
        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Submit Feedback</h4>
        
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-gray-500 mr-2">Score:</span>
          {[1, 2, 3, 4, 5].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => setRating(val)}
              className="text-primary focus:outline-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: ` 'FILL' ${rating >= val ? 1 : 0}` }}>
                star
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-white border border-outline rounded-xl p-3 text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 min-h-[90px] text-primary"
          placeholder="Share your experience..."
          required
        />

        {reviewError && <p className="text-xs font-semibold text-error">{reviewError}</p>}

        <button
          type="submit"
          disabled={submittingReview}
          className="bg-primary text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
        >
          {submittingReview ? 'Submitting...' : 'Post Review'}
        </button>
      </form>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {reviews.filter(Boolean).map(rev => (
          <div key={rev._id} className="p-4 rounded-xl border border-outline bg-gray-50 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-primary">{rev.user?.name || 'Anonymous User'}</span>
              <div className="flex items-center gap-0.5 text-gray-600 font-bold text-xs">
                <span className="material-symbols-outlined text-[14px] text-yellow-500">star</span>
                <span>{rev.rating}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-semibold">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
