import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';

export async function GET() {
  try {
    await dbConnect();
    const cities = await City.find({ isActive: true }).sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    console.error('GET /api/cities Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
