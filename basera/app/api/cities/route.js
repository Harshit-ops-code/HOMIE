import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';
import { CITIES } from '@/constants/cities';

export async function GET() {
  try {
    await dbConnect();
    const cities = await City.find({ isActive: true }).sort({ name: 1 }).lean();
    if (cities && cities.length > 0) {
      return NextResponse.json({ success: true, data: cities });
    }
  } catch (error) {
    console.warn('[GET /api/cities] MongoDB unreachable, returning fallback constants:', error.message);
  }

  const fallbackCities = CITIES.map((c, idx) => ({
    _id: `city-${c.slug}`,
    name: c.name,
    slug: c.slug,
    state: c.state,
    coordinates: c.coordinates,
    bannerImage: c.image,
    isActive: true,
    sortOrder: idx + 1,
  }));

  return NextResponse.json({ success: true, data: fallbackCities });
}
