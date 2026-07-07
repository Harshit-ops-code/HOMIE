import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Listing from '@/models/Listing';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'listingId query parameter is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    await dbConnect();

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ listing: listingId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({ listing: listingId });

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/reviews Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, rating, comment } = body;

    if (!listingId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and rating are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check for existing review by this user on this listing (Only one review per user per listing)
    const existingReview = await Review.findOne({ listing: listingId, user: session.user.id });
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this listing', code: 'ALREADY_REVIEWED' },
        { status: 400 }
      );
    }

    const review = await Review.create({
      listing: listingId,
      user: session.user.id,
      rating: numericRating,
      comment: comment || ''
    });

    // Recalculate listing average rating and counts
    const listingReviews = await Review.find({ listing: listingId });
    const count = listingReviews.length;
    const totalRatingSum = listingReviews.reduce((sum, r) => sum + r.rating, 0);
    const average = count > 0 ? Number((totalRatingSum / count).toFixed(1)) : 0;

    await Listing.findByIdAndUpdate(listingId, {
      $set: {
        'rating.average': average,
        'rating.count': count
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    }, { status: 211 }); // Created
  } catch (error) {
    console.error('POST /api/reviews Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
