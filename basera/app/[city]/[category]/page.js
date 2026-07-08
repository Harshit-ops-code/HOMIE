import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';
import Category from '@/models/Category';
import Listing from '@/models/Listing';
import CategoryListingsClient from '@/components/CategoryListingsClient';

export async function generateMetadata({ params }) {
  const { city, category } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${categoryName} in ${cityName} — Basera`,
    description: `Find verified ${categoryName} services and locations in ${cityName} with details and reviews.`,
  };
}

export default async function CategoryListingsPage({ params }) {
  const { city, category } = await params;

  await dbConnect();

  // Find the city and category documents
  const cityDoc = await City.findOne({ slug: city }).lean();
  const categoryDoc = await Category.findOne({ slug: category }).lean();
  const allCategories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

  if (!cityDoc || !categoryDoc) {
    notFound();
  }

  // Find all active listings for this city (regardless of category, showing everything at the start!)
  const rawListings = await Listing.find({
    city: cityDoc._id,
    isActive: true
  })
    .populate('category', 'name slug icon')
    .sort({ isVerified: -1, 'rating.average': -1 })
    .lean();

  // Extract unique subcategories from matching listings
  const subcategories = Array.from(
    new Set(rawListings.map(l => l.subcategory).filter(Boolean))
  );

  // Serialize Mongoose data for Next.js Server-Client boundaries
  const serializedCity = {
    ...cityDoc,
    _id: cityDoc._id.toString(),
  };

  const serializedCategory = {
    ...categoryDoc,
    _id: categoryDoc._id.toString(),
  };

  const serializedCategories = allCategories.map(cat => ({
    ...cat,
    _id: cat._id.toString(),
  }));

  const serializedListings = rawListings.map(listing => ({
    ...listing,
    _id: listing._id.toString(),
    city: listing.city?.toString() || '',
    category: (listing.category && typeof listing.category === 'object' && listing.category._id) ? {
      name: listing.category.name || '',
      slug: listing.category.slug || '',
      icon: listing.category.icon || '',
      _id: listing.category._id.toString(),
    } : null,
    vendor: listing.vendor?.toString() || null,
    createdAt: listing.createdAt?.toISOString() || null,
    updatedAt: listing.updatedAt?.toISOString() || null,
  }));

  return (
    <CategoryListingsClient
      cityData={serializedCity}
      categoryData={serializedCategory}
      categories={serializedCategories}
      initialListings={serializedListings}
      subcategories={subcategories}
    />
  );
}
