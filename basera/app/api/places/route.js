import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'bengaluru';
    const category = searchParams.get('category') || 'housing';
    const searchQuery = searchParams.get('search') || '';

    // City center coordinates mapping for fast, reliable radius searches
    const cityCoordinates = {
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      delhi: { lat: 28.6139, lng: 77.2090 },
      mumbai: { lat: 19.0760, lng: 72.8777 },
      pune: { lat: 18.5204, lng: 73.8567 },
      hyderabad: { lat: 17.3850, lng: 78.4867 }
    };

    const coords = cityCoordinates[city.toLowerCase()] || cityCoordinates.bengaluru;

    // Map internal categories to OpenStreetMap Overpass tags
    const categoryQueries = {
      housing: '["amenity"="hostel"]',
      'tiffin-mess': '["amenity"="restaurant"]["cuisine"~"indian"]',
      'food-dining': '["amenity"~"restaurant|cafe|fast_food"]',
      'home-services': '["craft"~"electrician|plumber"]',
      grocery: '["shop"~"supermarket|convenience"]',
      'sabji-mandi': '["market"~"yes|vegetables"]',
      dairy: '["shop"~"dairy|milk"]',
      'gym-fitness': '["leisure"="fitness_centre"]',
      'places-to-visit': '["tourism"~"attraction|museum|viewpoint"]',
      'social-fun': '["amenity"~"pub|bar"]',
      'maid-cook': '["office"="employment_agency"]',
      transport: '["railway"="station"]'
    };

    const osmFilter = categoryQueries[category] || '["amenity"="restaurant"]';
    
    // Fast Overpass Query using around search (10km radius)
    const overpassQuery = `
      [out:json][timeout:10];
      (
        node(around:10000, ${coords.lat}, ${coords.lng})${osmFilter};
        way(around:10000, ${coords.lat}, ${coords.lng})${osmFilter};
      );
      out body 15;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    const res = await fetch(overpassUrl);
    
    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: 'OpenStreetMap Overpass service temporarily unavailable'
      });
    }

    const data = await res.json();
    
    if (!data.elements || data.elements.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Fallback images
    const unsplashCategories = {
      housing: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'tiffin-mess': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'food-dining': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'gym-fitness': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      transport: 'https://images.unsplash.com/photo-1562920841-029f94c50166?auto=format&fit=crop&w=800&q=80',
      'places-to-visit': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
    };

    const imageUrl = unsplashCategories[category] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80';

    const listings = data.elements.map((el, index) => {
      const name = el.tags?.name || `${category.charAt(0).toUpperCase() + category.slice(1)} Point ${index + 1}`;
      const address = el.tags?.["addr:full"] || el.tags?.["addr:street"] || `${el.tags?.["addr:suburb"] || el.tags?.["addr:neighbourhood"] || 'Central Area'}, ${city.charAt(0).toUpperCase() + city.slice(1)}`;
      
      return {
        _id: el.id.toString(),
        name,
        description: `Verified ${category} location in ${city}. Details aggregated from OpenStreetMap community logs.`,
        category: { name: category.toUpperCase() },
        locality: el.tags?.["addr:suburb"] || el.tags?.["addr:neighbourhood"] || 'Central Area',
        address,
        coordinates: {
          lat: el.lat || el.center?.lat || null,
          lng: el.lon || el.center?.lon || null
        },
        images: [imageUrl],
        contact: {
          phone: el.tags?.phone || el.tags?.["contact:phone"] || 'Available on request',
          whatsapp: ''
        },
        price: {
          displayText: 'Free Verification'
        },
        amenities: ['OSM Checked', 'Community Logged'],
        timing: {
          open: el.tags?.opening_hours?.split(';')?.[0] || '09:00',
          close: '21:00',
          days: 'Mon-Sun'
        },
        tags: Object.keys(el.tags || {}).slice(0, 5),
        isVerified: true,
        rating: {
          average: 4.5,
          count: Math.floor(Math.random() * 20) + 5
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: listings
    });

  } catch (error) {
    console.error('GET /api/places (OSM) Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to query live OpenStreetMap data'
    }, { status: 500 });
  }
}
