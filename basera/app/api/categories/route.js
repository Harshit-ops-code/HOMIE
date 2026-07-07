import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('GET /api/categories Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
