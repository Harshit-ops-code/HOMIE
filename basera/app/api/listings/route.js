import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import City from '@/models/City';
import Category from '@/models/Category';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const verified = searchParams.get('verified');
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    await dbConnect();

    // Resolve slugs to ObjectIds
    let cityDoc = null;
    if (city) {
      cityDoc = await City.findOne({ slug: city });
      if (!cityDoc) {
        return NextResponse.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
      }
    }

    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findOne({ slug: category });
      if (!categoryDoc) {
        return NextResponse.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
      }
    }

    // Build query filter
    const query = { isActive: true };
    if (cityDoc) query.city = cityDoc._id;
    if (categoryDoc) query.category = categoryDoc._id;
    if (subcategory) query.subcategory = subcategory;
    if (verified === 'true') query.isVerified = true;

    // Price query
    if (minPrice || maxPrice) {
      query['price.value'] = {};
      if (minPrice) query['price.value'].$gte = Number(minPrice);
      if (maxPrice) query['price.value'].$lte = Number(maxPrice);
    }

    // Text search query
    if (search) {
      query.$text = { $search: search };
    }

    // Sort strategy
    let sort = { isVerified: -1, 'rating.average': -1, createdAt: -1 };
    let scoreProj = {};

    if (search && !sortBy) {
      scoreProj = { score: { $meta: 'textScore' } };
      sort = { score: { $meta: 'textScore' } };
    } else if (sortBy === 'rating') {
      sort = { 'rating.average': -1, isVerified: -1 };
    } else if (sortBy === 'price') {
      sort = { 'price.value': 1, isVerified: -1 };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1, isVerified: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const listings = await Listing.find(query, scoreProj)
      .populate('city', 'name slug')
      .populate('category', 'name slug icon')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Listing.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/listings Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'vendor' && session.user.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, categorySlug, subcategory, citySlug, locality, address, coordinates, price, contact, amenities, timing, tags } = body;

    if (!name || !description || !categorySlug || !citySlug || !locality || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Resolve slugs to ObjectIds
    const cityDoc = await City.findOne({ slug: citySlug });
    const categoryDoc = await Category.findOne({ slug: categorySlug });

    if (!cityDoc || !categoryDoc) {
      return NextResponse.json(
        { success: false, error: 'Invalid city or category slug', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const listing = await Listing.create({
      name,
      description,
      category: categoryDoc._id,
      subcategory: subcategory || '',
      city: cityDoc._id,
      locality,
      address,
      coordinates: coordinates || null,
      price: price || { value: null, unit: 'on_request', displayText: 'On Request' },
      contact: contact || {},
      amenities: amenities || [],
      timing: timing || {},
      tags: tags || [],
      vendor: session.user.id,
      isActive: true,
      isVerified: false // Needs admin approval to get verified
    });

    // Increment city listing count
    await City.findByIdAndUpdate(cityDoc._id, { $inc: { listingCount: 1 } });

    return NextResponse.json({
      success: true,
      message: 'Listing created successfully. Waiting for admin approval.',
      data: listing
    }, { status: 211 }); // 211 or 201 Created
  } catch (error) {
    console.error('POST /api/listings Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
