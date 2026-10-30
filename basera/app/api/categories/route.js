import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { CATEGORIES } from '@/constants/categories';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    if (categories && categories.length > 0) {
      return NextResponse.json({ success: true, data: categories });
    }
  } catch (error) {
    console.warn('[GET /api/categories] MongoDB unreachable, returning fallback constants:', error.message);
  }

  const fallbackCategories = CATEGORIES.map((cat, idx) => ({
    _id: `cat-${cat.slug}`,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    description: cat.description,
    subcategories: cat.subcategories || [],
    color: cat.color,
    isActive: true,
    sortOrder: cat.sortOrder || idx + 1,
  }));

  return NextResponse.json({ success: true, data: fallbackCategories });
}
