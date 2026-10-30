import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import City from '@/models/City';
import Category from '@/models/Category';
import mongoose from 'mongoose';
import { MOCK_LISTINGS } from '@/constants/mockListings';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    await dbConnect();

    // Fetch listing and increment viewCount
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after' }
    )
      .populate('city', 'name slug')
      .populate('category', 'name slug icon')
      .lean();

    if (!listing) {
      const matched = MOCK_LISTINGS.find(l => l._id === id);
      if (matched) {
        return NextResponse.json({ success: true, data: matched });
      }
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    console.warn('[GET /api/listings/[id]] Error fetching listing:', error.message);
    const matched = MOCK_LISTINGS.find(l => l._id === (params?.id || id));
    if (matched) {
      return NextResponse.json({ success: true, data: matched });
    }
    return NextResponse.json(
      { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    await dbConnect();

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Only vendor owner or admin can update listing
    if (session.user.role !== 'admin' && listing.vendor?.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prevent changing vendor or structural ids directly unless admin
    const updateData = { ...body };
    delete updateData.vendor;
    delete updateData.rating;
    delete updateData.viewCount;
    delete updateData.saveCount;

    // Handle slug updates if city or category slug is provided
    if (body.citySlug) {
      const cityDoc = await City.findOne({ slug: body.citySlug });
      if (cityDoc) {
        // Handle city count changes if city is changing
        if (listing.city.toString() !== cityDoc._id.toString()) {
          await City.findByIdAndUpdate(listing.city, { $inc: { listingCount: -1 } });
          await City.findByIdAndUpdate(cityDoc._id, { $inc: { listingCount: 1 } });
        }
        updateData.city = cityDoc._id;
      }
    }
    if (body.categorySlug) {
      const categoryDoc = await Category.findOne({ slug: body.categorySlug });
      if (categoryDoc) updateData.category = categoryDoc._id;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' }
    ).populate('city category');

    return NextResponse.json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing
    });
  } catch (error) {
    console.error('PUT /api/listings/[id] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    await dbConnect();

    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Allow Admin or the listing's vendor owner
    if (session.user.role !== 'admin' && listing.vendor?.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    await Listing.findByIdAndDelete(id);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Decrement listing count on the associated city
    await City.findByIdAndUpdate(listing.city, { $inc: { listingCount: -1 } });

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/listings/[id] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
