import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id)
      .populate({
        path: 'savedListings',
        populate: [
          { path: 'city', select: 'name slug' },
          { path: 'category', select: 'name slug icon' }
        ]
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user.savedListings || []
    });
  } catch (error) {
    console.error('GET /api/listings/saved Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
