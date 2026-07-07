import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import City from '@/models/City';
import Category from '@/models/Category'; // Ensure category model is registered for populate
import { CHAT_SYSTEM_PROMPT } from '@/prompts/chat';
import { callClaude } from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { messages, city, userProfile } = await request.json();

    if (!messages || !messages.length) {
      return NextResponse.json(
        { success: false, error: 'Messages are required' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1].content;

    await dbConnect();

    // Resolve city slug to ObjectId
    const cityDoc = await City.findOne({ slug: city });
    const cityId = cityDoc ? cityDoc._id : null;

    let relevantListings = [];
    if (cityId) {
      // RAG: fetch relevant listings based on the user's message
      relevantListings = await Listing.find(
        {
          $text: { $search: lastMessage },
          city: cityId,
          isActive: true,
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .populate('category', 'name')
        .lean();
    }

    // Build context string from listings
    const listingContext = relevantListings.length > 0
      ? `\n\nRELEVANT LISTINGS FROM DATABASE:\n${relevantListings.map(l =>
          `- ${l.name} (${l.category?.name}) in ${l.locality}: ${l.price?.displayText} | Rating: ${l.rating?.average}/5`
        ).join('\n')}`
      : '';

    // Build system prompt with real data injected
    const systemPrompt = CHAT_SYSTEM_PROMPT(city, listingContext, userProfile);

    // Call Claude
    const replyText = await callClaude(messages, systemPrompt);

    return NextResponse.json({
      success: true,
      message: replyText,
      listingsUsed: relevantListings.length,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: 'AI service unavailable' },
      { status: 500 }
    );
  }
}
