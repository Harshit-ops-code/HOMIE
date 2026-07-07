import { NextResponse } from 'next/server';
import { detectLabels } from '@/lib/vision';

// Map Google Vision labels → Basera amenity names
const LABEL_MAP = {
  'Air conditioning': 'AC',
  'WiFi': 'WiFi',
  'Wireless network': 'WiFi',
  'Bed frame': 'Furnished Bed',
  'Kitchen': 'Kitchen',
  'Refrigerator': 'Fridge',
  'Washing machine': 'Washing Machine',
  'Bathroom': 'Bathroom',
  'Parking': 'Parking',
  'Swimming pool': 'Swimming Pool',
  'Gym': 'Gym',
  'Security guard': 'Security',
};

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'ImageUrl is required' },
        { status: 400 }
      );
    }

    const labels = await detectLabels(imageUrl);

    // Map to known amenities
    const detectedAmenities = labels
      .filter(label => LABEL_MAP[label])
      .map(label => LABEL_MAP[label]);

    // De-duplicate detected amenities
    const uniqueAmenities = [...new Set(detectedAmenities)];

    return NextResponse.json({
      success: true,
      detectedAmenities: uniqueAmenities,
      rawLabels: labels,
    });
  } catch (error) {
    console.error('Auto Tag Image API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Image analysis failed' },
      { status: 500 }
    );
  }
}
