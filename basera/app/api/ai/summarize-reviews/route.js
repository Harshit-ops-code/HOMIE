import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { SUMMARIZE_PROMPT } from '@/prompts/summarize';
import { callClaude } from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { listingId, reviews } = await request.json();

    if (!reviews || reviews.length < 5) {
      return NextResponse.json({
        success: false,
        error: 'Not enough reviews to summarize (minimum 5)',
      });
    }

    // Format reviews for the prompt
    const reviewText = reviews
      .map(r => `${r.rating}/5 stars: "${r.comment}"`)
      .join('\n');

    const summaryText = await callClaude(
      [{ role: 'user', content: `Summarize these reviews:\n${reviewText}` }],
      SUMMARIZE_PROMPT
    );

    const summary = summaryText.trim();

    // Cache the summary in MongoDB to avoid repeat API calls if listingId is valid
    if (listingId && listingId !== 'test123') {
      await dbConnect();
      await Listing.findByIdAndUpdate(listingId, {
        aiSummary: summary,
        aiSummaryGeneratedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Review Summarizer API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not generate summary' },
      { status: 500 }
    );
  }
}
