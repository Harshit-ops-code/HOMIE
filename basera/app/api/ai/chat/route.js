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

    let relevantListings = [];
    try {
      await dbConnect();
      const cityDoc = await City.findOne({ slug: city });
      const cityId = cityDoc ? cityDoc._id : null;

      if (cityId) {
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
    } catch (dbErr) {
      console.warn('[Chat RAG] MongoDB unreachable, falling back to mock listings:', dbErr.message);
      // Fallback search in mock data
      const { MOCK_LISTINGS } = await import('@/constants/mockListings');
      relevantListings = (MOCK_LISTINGS || []).slice(0, 5);
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

    // Warm, graceful local buddy fallback tailored to city and topic
    const body = await request.clone().json().catch(() => ({}));
    const city = body.city || 'your city';
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    const messages = body.messages || [];
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();

    let friendlyFallback = `Hey there! Welcome to ${cityName}! Moving to a new city can feel like a lot to take in, but don't worry — I'm right here to help you settle in smoothly without broker hassle. 🏡✨\n\nYou can explore verified broker-free stays, home tiffins, and background-audited helpers right here on Basera. What would you like to sort out first?`;

    if (lastMsg.includes('flat') || lastMsg.includes('pg') || lastMsg.includes('rent') || lastMsg.includes('room') || lastMsg.includes('1bhk') || lastMsg.includes('stay') || lastMsg.includes('house') || lastMsg.includes('housing')) {
      friendlyFallback = `Finding the right stay in ${cityName} is step #1! 🏠\n\n• Focus on areas within walking distance of key transit corridors to avoid traffic fatigue.\n• On Basera, every listing has zero brokerage, verified security deposit terms, and authentic photos.\n\nWhat is your monthly budget range or workplace area? I'll help you pinpoint the best neighborhoods!`;
    } else if (lastMsg.includes('tiffin') || lastMsg.includes('food') || lastMsg.includes('mess') || lastMsg.includes('meal') || lastMsg.includes('eating') || lastMsg.includes('cook')) {
      friendlyFallback = `Nothing beats healthy, home-cooked food when you've just moved! 🍱\n\nIn ${cityName}, we connect you directly with regional home kitchens delivering authentic thalis daily. Most services offer a 1-day free or low-cost meal trial so you can test taste and spice levels.\n\nDo you prefer North Indian, South Indian, or pure vegetarian food?`;
    } else if (lastMsg.includes('maid') || lastMsg.includes('clean') || lastMsg.includes('helper') || lastMsg.includes('housekeep') || lastMsg.includes('laundry')) {
      friendlyFallback = `Having a trusted helper takes so much stress off unpacking! ✨\n\nIn ${cityName}, reliable part-time helpers typically charge ₹2,000–₹3,500/month depending on apartment size and duties. All helpers listed on Basera come with background verification.\n\nWould you like verified contact numbers for your specific locality?`;
    }

    return NextResponse.json({
      success: true,
      message: friendlyFallback,
      listingsUsed: 0,
      fallback: true
    });
  }
}
