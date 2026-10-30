import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import City from '@/models/City';
import Category from '@/models/Category';
import Listing from '@/models/Listing';
import CategoryListingsClient from '@/components/CategoryListingsClient';
import { CITIES } from '@/constants/cities';
import { CATEGORIES } from '@/constants/categories';
import { MOCK_LISTINGS } from '@/constants/mockListings';

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

  let cityDoc = null;
  let categoryDoc = null;
  let allCategories = [];
  let rawListings = [];

  try {
    await dbConnect();
    cityDoc = await City.findOne({ slug: city.toLowerCase() }).lean();
    categoryDoc = await Category.findOne({ slug: category.toLowerCase() }).lean();
    allCategories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

    if (cityDoc) {
      rawListings = await Listing.find({
        city: cityDoc._id,
        isActive: true
      })
        .populate('category', 'name slug icon')
        .sort({ isVerified: -1, 'rating.average': -1 })
        .lean();
    }
  } catch (err) {
    console.warn(`[CategoryListingsPage] MongoDB connection error: ${err.message}. Using fallback constants.`);
  }

  if (!cityDoc) {
    const matchedCity = CITIES.find(c => c.slug.toLowerCase() === city.toLowerCase());
    if (matchedCity) {
      cityDoc = {
        _id: `fallback-${matchedCity.slug}`,
        name: matchedCity.name,
        slug: matchedCity.slug,
      };
    }
  }

  if (!categoryDoc) {
    const matchedCategory = CATEGORIES.find(c => c.slug.toLowerCase() === category.toLowerCase());
    if (matchedCategory) {
      categoryDoc = {
        _id: `cat-${matchedCategory.slug}`,
        name: matchedCategory.name,
        slug: matchedCategory.slug,
        icon: matchedCategory.icon,
        description: matchedCategory.description,
        subcategories: matchedCategory.subcategories || [],
      };
    }
  }

  if (!allCategories || allCategories.length === 0) {
    allCategories = CATEGORIES.map(cat => ({
      _id: `cat-${cat.slug}`,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      isActive: true,
      sortOrder: cat.sortOrder,
    }));
  }

  if (!cityDoc || !categoryDoc) {
    notFound();
  }

  // Fallback to MOCK_LISTINGS if DB returned no listings or was unreachable
  if (!rawListings || rawListings.length === 0) {
    const cityLower = city.toLowerCase();
    const catLower = category.toLowerCase();
    rawListings = MOCK_LISTINGS.filter(l => 
      l.citySlug.toLowerCase() === cityLower && 
      (catLower === 'all' || l.categorySlug.toLowerCase() === catLower)
    );
  }

  // Extract unique subcategories from matching listings or fallback from categoryDoc
  let subcategories = Array.from(
    new Set(rawListings.map(l => l.subcategory).filter(Boolean))
  );
  if (subcategories.length === 0 && categoryDoc.subcategories?.length > 0) {
    subcategories = categoryDoc.subcategories;
  }

  // Serialize Mongoose data for Next.js Server-Client boundaries
  const serializedCity = JSON.parse(JSON.stringify(cityDoc));
  const serializedCategory = JSON.parse(JSON.stringify(categoryDoc));
  const serializedCategories = JSON.parse(JSON.stringify(allCategories));
  const serializedListings = JSON.parse(JSON.stringify(rawListings));

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
