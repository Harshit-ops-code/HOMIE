import { notFound, redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';
import Category from '@/models/Category';
import Listing from '@/models/Listing';
import CityDashboardClient from '@/components/CityDashboardClient';

export async function generateMetadata({ params }) {
  const { city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `${cityName} Dashboard — Basera`,
    description: `Settle in like a local in ${cityName} with Basera checklists, properties, and tiffin services.`,
  };
}

export default async function CityDashboard({ params }) {
  const { city } = await params;

  await dbConnect();

  // Find the city
  const cityDoc = await City.findOne({ slug: city }).lean();
  
  if (!cityDoc) {
    // If city is not supported, redirect to onboard
    redirect('/onboard');
  }

  // Find all active categories
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .lean();

  // Find handpicked listings in this city (limit 6)
  const rawListings = await Listing.find({ city: cityDoc._id, isActive: true })
    .populate('category', 'name slug icon')
    .limit(6)
    .lean();

  // Serialize Mongoose ObjectIds to simple strings for client boundary
  const serializedCity = {
    ...cityDoc,
    _id: cityDoc._id.toString(),
  };

  const serializedCategories = categories.map(cat => ({
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
    <CityDashboardClient
      cityData={serializedCity}
      categories={serializedCategories}
      initialListings={serializedListings}
    />
  );
}
