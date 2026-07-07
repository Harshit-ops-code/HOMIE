import { NextResponse } from 'next/server';
import { NEIGHBOURHOOD_PROMPT } from '@/prompts/neighbourhood';
import { callClaude, extractJSON } from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { userProfile, locality, cityName, listingData } = await request.json();

    if (!userProfile || !locality || !cityName) {
      return NextResponse.json(
        { success: false, error: 'UserProfile, Locality, and CityName are required' },
        { status: 400 }
      );
    }

    const responseText = await callClaude(
      [{
        role: 'user',
        content: `
          User Profile: ${JSON.stringify(userProfile)}
          Locality: ${locality}, ${cityName}
          Available in this locality: ${JSON.stringify(listingData || {})}
          
          Score this locality for this user (0-100) and give a one-line reason.
          Respond ONLY with JSON: { "score": 85, "reason": "Great food options, quiet residential area", "pros": ["Pro 1"], "cons": ["Con 1"] }
        `
      }],
      NEIGHBOURHOOD_PROMPT
    );

    // Extract and parse JSON response
    const result = extractJSON(responseText);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Neighbourhood Compatibility Scorer Error:', error);
    return NextResponse.json({ success: false, score: null, reason: null, pros: [], cons: [] });
  }
}
