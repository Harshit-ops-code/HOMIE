import { notFound, redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';
import Category from '@/models/Category';
import Listing from '@/models/Listing';
import CityDashboardClient from '@/components/CityDashboardClient';
import { CITIES } from '@/constants/cities';
import { CATEGORIES } from '@/constants/categories';
import { MOCK_LISTINGS } from '@/constants/mockListings';

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

  let cityDoc = null;
  let categories = [];
  let rawListings = [];

  try {
    await dbConnect();
    cityDoc = await City.findOne({ slug: city.toLowerCase() }).lean();
    if (cityDoc) {
      categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .lean();
      rawListings = await Listing.find({ city: cityDoc._id, isActive: true })
        .populate('category', 'name slug icon')
        .limit(6)
        .lean();
    }
  } catch (err) {
    console.warn(`[CityDashboard] MongoDB connection error: ${err.message}. Using fallback constants.`);
  }

  // If cityDoc was not in DB or DB connection failed, resolve from CITIES constant
  if (!cityDoc) {
    const matchedCity = CITIES.find(c => c.slug.toLowerCase() === city.toLowerCase());
    if (matchedCity) {
      cityDoc = {
        _id: `fallback-${matchedCity.slug}`,
        name: matchedCity.name,
        slug: matchedCity.slug,
        bannerImage: matchedCity.image,
        description: `Explore verified listings, local checklists, and essential services in ${matchedCity.name}.`,
      };
    } else {
      redirect('/onboard');
    }
  }

  // If categories are empty, fallback to CATEGORIES constant
  if (!categories || categories.length === 0) {
    categories = CATEGORIES.map(cat => ({
      _id: `cat-${cat.slug}`,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      isActive: true,
      sortOrder: cat.sortOrder,
    }));
  }

  // If listings are empty in DB or DB offline, fallback to MOCK_LISTINGS
  if (!rawListings || rawListings.length === 0) {
    const citySlugLower = city.toLowerCase();
    rawListings = MOCK_LISTINGS.filter(l => l.citySlug.toLowerCase() === citySlugLower).slice(0, 6);
  }

  // Serialize Mongoose ObjectIds and Dates to plain JSON for client boundary
  const serializedCity = JSON.parse(JSON.stringify(cityDoc));
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedListings = JSON.parse(JSON.stringify(rawListings));

  return (
    <CityDashboardClient
      cityData={serializedCity}
      categories={serializedCategories}
      initialListings={serializedListings}
    />
  );
}
