'use client';

import { useState } from 'react';

export default function AIReviewSummary({ listingId, initialSummary = null, reviews = [] }) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    if (reviews.length < 5) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/summarize-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, reviews })
      });
      const json = await res.json();
      if (json.success) {
        setSummary(json.summary);
      } else {
        setError(json.error || 'Failed to generate review summary');
      }
    } catch (err) {
      setError('An error occurred during summarization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-white to-amber-50/20 border border-outline rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col gap-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-plus-jakarta text-sm font-extrabold text-primary flex items-center gap-1.5 tracking-tight">
            <span className="material-symbols-outlined text-base text-indigo-500">auto_awesome</span>
            AI Review Summary
          </h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Instant local review synthesis</p>
        </div>

        {!summary && reviews.length >= 5 && (
          <button 
            onClick={generateSummary} disabled={loading}
            className="text-[9px] bg-primary text-white font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
          >
            {loading ? 'Analyzing...' : 'Generate Summary'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-semibold text-error bg-red-50 border border-red-150 px-3 py-2 rounded-xl">{error}</p>
      )}

      {summary ? (
        <p className="text-xs font-semibold text-gray-600 leading-relaxed bg-white border border-outline/50 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          {summary}
        </p>
      ) : (
        <p className="text-xs font-semibold text-gray-400 leading-relaxed italic">
          {reviews.length < 5 
            ? 'Need at least 5 user reviews to enable AI summarization features.' 
            : 'Reviews are available! Request a summary above to synthesize student/family feedback.'
          }
        </p>
      )}
    </div>
  );
}
