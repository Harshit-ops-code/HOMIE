import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import Review from '@/models/Review';
import ListingDetailsClient from '@/components/ListingDetailsClient';
import mongoose from 'mongoose';
import { MOCK_LISTINGS } from '@/constants/mockListings';


export async function generateMetadata({ params }) {
  const { id } = await params;
  let listing = null;
  try {
    if (mongoose.isValidObjectId(id)) {
      await dbConnect();
      listing = await Listing.findById(id).lean();
    }
  } catch (err) {
    console.warn('[ListingDetails generateMetadata] DB offline:', err.message);
  }

  if (!listing) {
    listing = MOCK_LISTINGS.find(l => l._id === id);
  }

  return {
    title: listing ? `${listing.name} — Details` : 'Listing Details',
    description: listing ? listing.description : 'Explore listing details on Basera.',
  };
}

export default async function ListingDetailsPage({ params }) {
  const { city, category, id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    notFound();
  }

  let listingDoc = null;
  let reviews = [];

  try {
    await dbConnect();

    // Find listing by ID and increment view count
    listingDoc = await Listing.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after' }
    )
      .populate('city', 'name slug')
      .populate('category', 'name slug icon')
      .lean();

    if (listingDoc) {
      reviews = await Review.find({ listing: id })
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .lean();
    }
  } catch (err) {
    console.warn(`[ListingDetailsPage] MongoDB error: ${err.message}`);
  }

  if (!listingDoc) {
    const matched = MOCK_LISTINGS.find(l => l._id === id);
    if (matched) {
      listingDoc = matched;
    }
  }

  if (!listingDoc) {
    notFound();
  }

  // Serialize Mongoose values for Next.js boundary transfer
  const serializedListing = {
    ...listingDoc,
    _id: listingDoc._id.toString(),
    city: (listingDoc.city && typeof listingDoc.city === 'object' && listingDoc.city._id) ? {
      name: listingDoc.city.name || '',
      slug: listingDoc.city.slug || '',
      _id: listingDoc.city._id.toString(),
    } : null,
    category: (listingDoc.category && typeof listingDoc.category === 'object' && listingDoc.category._id) ? {
      name: listingDoc.category.name || '',
      slug: listingDoc.category.slug || '',
      icon: listingDoc.category.icon || '',
      _id: listingDoc.category._id.toString(),
    } : null,
    vendor: listingDoc.vendor?.toString() || null,
    createdAt: listingDoc.createdAt?.toISOString() || null,
    updatedAt: listingDoc.updatedAt?.toISOString() || null,
  };

  const serializedReviews = reviews.map(rev => ({
    ...rev,
    _id: rev._id.toString(),
    listing: rev.listing.toString(),
    user: rev.user ? {
      ...rev.user,
      _id: rev.user._id.toString(),
    } : null,
    createdAt: rev.createdAt?.toISOString() || null,
  }));

  return (
    <ListingDetailsClient
      city={city}
      category={category}
      listing={serializedListing}
      initialReviews={serializedReviews}
    />
  );
}
