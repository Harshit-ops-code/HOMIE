import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Listing from '@/models/Listing';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateObjectId, validateNumberRange, validateString } from '@/lib/validator';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!listingId || !validateObjectId(listingId)) {
      return NextResponse.json(
        { success: false, error: 'Valid listingId query parameter is required', code: 'VALIDATION_ERROR' },
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
    const ip = getClientIp(request);
    const rateLim = checkRateLimit(ip, 'user');
    if (!rateLim.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Try again in ${rateLim.resetSeconds}s.`, code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, rating, comment } = body || {};

    // Strict validation
    if (!validateObjectId(listingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Listing ID format', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (!validateNumberRange(numericRating, 1, 5) || !Number.isInteger(numericRating)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be an integer between 1 and 5', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (comment !== undefined && !validateString(comment, 0, 500)) {
      return NextResponse.json(
        { success: false, error: 'Comment cannot exceed 500 characters', code: 'VALIDATION_ERROR' },
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
      comment: (comment || '').trim()
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

    const populatedReview = {
      ...review.toObject(),
      user: { name: session.user.name || 'Anonymous User', _id: session.user.id }
    };

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview,
      review: populatedReview
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews Error Details:', error);
    return NextResponse.json(
      { success: false, error: 'Submit failed due to a server error.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
