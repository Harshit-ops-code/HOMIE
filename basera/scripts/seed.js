import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CITIES } from '../constants/cities.js';
import { CATEGORIES } from '../constants/categories.js';

// Manually load environment variables from .env.local first
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

const mockListingsData = [
  // Bengaluru - Housing
  {
    name: "Stanza Living - Lorient House",
    description: "Premium fully managed co-living space for professionals and students. High-speed WiFi, daily housekeeping, 3-tier meals, and 24/7 security included.",
    categorySlug: "housing",
    subcategory: "Co-living PG",
    citySlug: "bengaluru",
    locality: "Koramangala",
    address: "128, 4th Cross Road, Koramangala 4th Block, Bengaluru, Karnataka 560034",
    coordinates: { lat: 12.9343, lng: 77.6291 },
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8069055555", whatsapp: "+91 8069055555", email: "info@stanzaliving.com", website: "https://www.stanzaliving.com" },
    price: { value: 14500, maxValue: 22000, unit: "per_month", displayText: "₹14,500 – ₹22,000/mo" },
    amenities: ["WiFi", "AC", "Meals", "Laundry", "Security", "Gym"],
    timing: { open: "00:00", close: "00:00", days: "Mon–Sun", is24Hours: true },
    tags: ["co-living", "managed", "premium", "corporate"],
    isVerified: true,
    rating: { average: 4.6, count: 85 }
  },
  {
    name: "Zolo Stay - Horizon Suites",
    description: "Modern co-living space offering single and double sharing rooms. No brokerage, fully furnished setup near major tech parks.",
    categorySlug: "housing",
    subcategory: "PG",
    citySlug: "bengaluru",
    locality: "Indiranagar",
    address: "789, 10th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    coordinates: { lat: 12.9718, lng: 77.6411 },
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8880123000", whatsapp: "+91 8880123000", website: "https://zolostays.com" },
    price: { value: 11000, maxValue: 17500, unit: "per_month", displayText: "₹11,000 – ₹17,500/mo" },
    amenities: ["WiFi", "TV", "Fridge", "Parking", "Housekeeping"],
    timing: { open: "06:00", close: "23:30", days: "Mon–Sun", is24Hours: false },
    tags: ["no-brokerage", "indiranagar", "professionals"],
    isVerified: true,
    rating: { average: 4.3, count: 42 }
  },
  {
    name: "Colive 179 - Olympus",
    description: "Premium co-living space equipped with high-tech amenities, fitness zones, gaming lounges, and work desks.",
    categorySlug: "housing",
    subcategory: "PG",
    citySlug: "bengaluru",
    locality: "Koramangala",
    address: "18, 1st A Main Road, Koramangala 8th Block, Bengaluru, Karnataka 560095",
    coordinates: { lat: 12.9388, lng: 77.6189 },
    images: ["https://images.unsplash.com/photo-1555854817-cc08c8391970?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 7676000500", website: "https://www.colive.com" },
    price: { value: 9000, maxValue: 14000, unit: "per_month", displayText: "₹9,000 – ₹14,000/mo" },
    amenities: ["WiFi", "Security", "Gym", "Gaming Lounge", "Housekeeping"],
    timing: { open: "00:00", close: "00:00", days: "Mon–Sun", is24Hours: true },
    tags: ["no-brokerage", "budget-friendly", "co-working"],
    isVerified: true,
    rating: { average: 4.1, count: 59 }
  },
  {
    name: "Stanza Living - Indiranagar Club House",
    description: "Exclusive co-living club with premium single rooms, a rooftop cafe, fitness studio, and professional laundry.",
    categorySlug: "housing",
    subcategory: "Co-living PG",
    citySlug: "bengaluru",
    locality: "Indiranagar",
    address: "542, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    coordinates: { lat: 12.9732, lng: 77.6405 },
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8069055555", website: "https://www.stanzaliving.com" },
    price: { value: 16500, maxValue: 25000, unit: "per_month", displayText: "₹16,500 – ₹25,000/mo" },
    amenities: ["WiFi", "AC", "Meals", "Laundry", "Gym", "Rooftop Cafe"],
    timing: { open: "00:00", close: "00:00", days: "Mon-Sun", is24Hours: true },
    tags: ["luxury", "verified", "no-brokerage"],
    isVerified: true,
    rating: { average: 4.8, count: 37 }
  },
  // Delhi NCR - Housing
  {
    name: "CoHo - Lajpat Nagar Luxury Rooms",
    description: "Premium serviced rooms and flatmates for professionals. Fully loaded kitchen, high speed internet, and lounge utilities.",
    categorySlug: "housing",
    subcategory: "Serviced Apartment",
    citySlug: "delhi",
    locality: "Lajpat Nagar",
    address: "E-32, Ring Road, Lajpat Nagar III, New Delhi 110024",
    coordinates: { lat: 28.5684, lng: 77.2435 },
    images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 9953833444", website: "https://www.coho.in" },
    price: { value: 18000, maxValue: 26000, unit: "per_month", displayText: "₹18,000 – ₹26,000/mo" },
    amenities: ["WiFi", "AC", "Power Backup", "Housekeeping", "Laundry"],
    timing: { open: "08:00", close: "22:00", days: "Mon–Sun", is24Hours: false },
    tags: ["premium", "co-living", "lajpat-nagar"],
    isVerified: true,
    rating: { average: 4.5, count: 31 }
  },
  {
    name: "Stanza Living - Poznan House",
    description: "Serviced accommodation offering premium single and double rooms with North Indian meals, high speed WiFi, and laundry.",
    categorySlug: "housing",
    subcategory: "PG",
    citySlug: "delhi",
    locality: "Greater Kailash",
    address: "M-44, Greater Kailash II, New Delhi 110048",
    coordinates: { lat: 28.5321, lng: 77.2489 },
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8069055555", website: "https://www.stanzaliving.com" },
    price: { value: 16000, maxValue: 24000, unit: "per_month", displayText: "₹16,000 – ₹24,000/mo" },
    amenities: ["WiFi", "AC", "Meals", "Laundry", "Power Backup"],
    timing: { open: "00:00", close: "00:00", days: "Mon–Sun", is24Hours: true },
    tags: ["student-friendly", "verified", "gk-2"],
    isVerified: true,
    rating: { average: 4.4, count: 26 }
  },
  {
    name: "Zolo Stay - Prime Suites Delhi",
    description: "Affordable co-living setups located near Dwarka Sector 12 metro station. Easy access to public transport, zero broker fees.",
    categorySlug: "housing",
    subcategory: "PG",
    citySlug: "delhi",
    locality: "Dwarka",
    address: "Sector 12, Dwarka, New Delhi 110075",
    coordinates: { lat: 28.5910, lng: 77.0425 },
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8880123000", website: "https://zolostays.com" },
    price: { value: 9500, maxValue: 15000, unit: "per_month", displayText: "₹9,500 – ₹15,000/mo" },
    amenities: ["WiFi", "TV", "Fridge", "Power Backup", "Housekeeping"],
    timing: { open: "06:00", close: "23:00", days: "Mon-Sun", is24Hours: false },
    tags: ["no-brokerage", "dwarka", "metro-adjacent"],
    isVerified: true,
    rating: { average: 4.2, count: 19 }
  },
  {
    name: "Colive - Delhi Residency Patel Nagar",
    description: "Fully furnished rental flats for girls and boys with high-speed WiFi, security guards, and water purifier facilities.",
    categorySlug: "housing",
    subcategory: "Flat",
    citySlug: "delhi",
    locality: "Patel Nagar",
    address: "14/8, West Patel Nagar, New Delhi 110008",
    coordinates: { lat: 28.6445, lng: 77.1582 },
    images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 7676000500", website: "https://www.colive.com" },
    price: { value: 12000, maxValue: 18000, unit: "per_month", displayText: "₹12,000 – ₹18,000/mo" },
    amenities: ["WiFi", "AC", "Kitchen Access", "Water Filter", "Security"],
    timing: { open: "08:00", close: "22:00", days: "Mon-Sat", is24Hours: false },
    tags: ["verified", "flatmate-friendly", "metro-line"],
    isVerified: true,
    rating: { average: 4.0, count: 12 }
  },
  // Mumbai - Housing
  {
    name: "Zolo Stay - Bandra Heights",
    description: "Premium fully managed co-living accommodation in Bandra West. Zero brokerage, fully furnished flats with sea views and regular housekeeping.",
    categorySlug: "housing",
    subcategory: "Serviced Apartment",
    citySlug: "mumbai",
    locality: "Bandra West",
    address: "22, Carter Road, Bandra West, Mumbai, Maharashtra 400050",
    coordinates: { lat: 19.0664, lng: 72.8252 },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8880123000", website: "https://zolostays.com" },
    price: { value: 25000, maxValue: 45000, unit: "per_month", displayText: "₹25,000 – ₹45,000/mo" },
    amenities: ["WiFi", "AC", "Sea View", "Housekeeping", "Security"],
    timing: { open: "00:00", close: "00:00", days: "Mon–Sun", is24Hours: true },
    tags: ["premium", "sea-view", "bandra"],
    isVerified: true,
    rating: { average: 4.7, count: 39 }
  },
  {
    name: "Colive 405 - Nest Studio",
    description: "Compact modern studio apartments for working professionals in Andheri. Commute easily to Western Express Highway.",
    categorySlug: "housing",
    subcategory: "Studio Flat",
    citySlug: "mumbai",
    locality: "Andheri West",
    address: "Off Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053",
    coordinates: { lat: 19.1350, lng: 72.8310 },
    images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 7676000500", website: "https://www.colive.com" },
    price: { value: 18000, maxValue: 28000, unit: "per_month", displayText: "₹18,000 – ₹28,000/mo" },
    amenities: ["WiFi", "AC", "Fridge", "Parking", "Security"],
    timing: { open: "08:00", close: "23:00", days: "Mon–Sun", is24Hours: false },
    tags: ["studio", "andheri", "corporate"],
    isVerified: true,
    rating: { average: 4.2, count: 18 }
  },
  {
    name: "Stanza Living - Juhu Beach Residency",
    description: "Sea-facing managed studio rooms for young professionals. Includes premium breakfast, workspace access, gym, and housekeeping.",
    categorySlug: "housing",
    subcategory: "Serviced Apartment",
    citySlug: "mumbai",
    locality: "Juhu",
    address: "Opposite Juhu Beach, Vile Parle West, Mumbai, Maharashtra 400049",
    coordinates: { lat: 19.1025, lng: 72.8258 },
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8069055555", website: "https://www.stanzaliving.com" },
    price: { value: 30000, maxValue: 55000, unit: "per_month", displayText: "₹30,000 – ₹55,000/mo" },
    amenities: ["WiFi", "AC", "Meals", "Gym", "Housekeeping", "Sea View"],
    timing: { open: "00:00", close: "00:00", days: "Mon-Sun", is24Hours: true },
    tags: ["luxury", "sea-face", "juhu"],
    isVerified: true,
    rating: { average: 4.9, count: 53 }
  },
  // Bengaluru - Tiffin & Mess
  {
    name: "Masala Box Home Kitchen",
    description: "Healthy home-style subscription meal services. No artificial preservatives, low oil, and packed in eco-friendly containers.",
    categorySlug: "tiffin-mess",
    subcategory: "Tiffin Subscription",
    citySlug: "bengaluru",
    locality: "HSR Layout",
    address: "19th Main Road, Sector 3, HSR Layout, Bengaluru, Karnataka 560102",
    coordinates: { lat: 12.9103, lng: 77.6450 },
    images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 8047092929", whatsapp: "+91 8047092929", website: "https://www.masalabox.com" },
    price: { value: 3200, unit: "per_month", displayText: "₹3,200/mo (Lunch + Dinner)" },
    amenities: ["Veg", "Non-Veg", "Home Delivery", "Weekly Plan Available"],
    timing: { open: "11:00", close: "21:30", days: "Mon–Sun", is24Hours: false },
    tags: ["organic", "home-style", "healthy"],
    isVerified: true,
    rating: { average: 4.7, count: 118 }
  },
  // Bengaluru - Local Transport
  {
    name: "Indiranagar Metro Station (Purple Line)",
    description: "Major elevated metro transit station on Namma Metro Purple Line connecting directly to MG Road and Majestic Central Station.",
    categorySlug: "transport",
    subcategory: "Metro Station",
    citySlug: "bengaluru",
    locality: "Indiranagar",
    address: "Chinmaya Mission Hospital Road, Indiranagar, Bengaluru, Karnataka 560038",
    coordinates: { lat: 12.9783, lng: 77.6386 },
    images: ["https://images.unsplash.com/photo-1562920841-029f94c50166?auto=format&fit=crop&w=800&q=80"],
    contact: {},
    price: { value: 15, maxValue: 45, unit: "range", displayText: "₹15 – ₹45 fare" },
    amenities: ["Token Machines", "Parking", "ATM", "Toilets"],
    timing: { open: "05:00", close: "23:00", days: "Mon–Sun", is24Hours: false },
    tags: ["metro", "namma-metro", "fast-transit"],
    isVerified: true,
    rating: { average: 4.6, count: 320 }
  },
  // Delhi NCR - Dairy
  {
    name: "Mother Dairy Booth Sector 6",
    description: "Government-supported milk booth supplying homogenized fresh milk, butter, curds, ghee, and milkshakes.",
    categorySlug: "dairy",
    subcategory: "Dairy Booth",
    citySlug: "delhi",
    locality: "Dwarka",
    address: "Sector 6 Market, Dwarka, New Delhi 110075",
    coordinates: { lat: 28.5921, lng: 77.0617 },
    images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "1800116200", website: "https://www.motherdairy.com" },
    price: { unit: "on_request", displayText: "Standard Dairy MRP rates" },
    amenities: ["Bulk Milk Vending", "Cold Storage"],
    timing: { open: "06:00", close: "21:30", days: "Mon–Sun", is24Hours: false },
    tags: ["fresh", "dairy", "daily-milk"],
    isVerified: true,
    rating: { average: 4.7, count: 95 }
  },
  // Delhi NCR - Food & Dining
  {
    name: "Sardarji Da Dhaba",
    description: "Famous local Punjabi eatery. Famous for rich Butter Chicken, Dal Makhani, Garlic Naan, and authentic thick Lassi.",
    categorySlug: "food-dining",
    subcategory: "Dhaba / North Indian",
    citySlug: "delhi",
    locality: "Karol Bagh",
    address: "Pusa Road, Block 11, Karol Bagh, New Delhi, Delhi 110005",
    coordinates: { lat: 28.6441, lng: 77.1895 },
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 1145012345", website: "https://sardarjidadhaba.com" },
    price: { value: 600, unit: "range", displayText: "₹400 – ₹700 for two" },
    amenities: ["AC Seating", "Home Delivery", "Cards Accepted"],
    timing: { open: "12:00", close: "23:30", days: "Mon–Sun", is24Hours: false },
    tags: ["punjabi", "north-indian", "legendary"],
    isVerified: true,
    rating: { average: 4.5, count: 240 }
  },
  {
    name: "Third Wave Coffee - Connaught Place",
    description: "Premium specialty coffee roasters and cafe. Excellent work-friendly environment with power outlets and high speed WiFi.",
    categorySlug: "food-dining",
    subcategory: "Cafe / Workspace",
    citySlug: "delhi",
    locality: "Connaught Place",
    address: "M-Block, Outer Circle, Connaught Place, New Delhi 110001",
    coordinates: { lat: 28.6304, lng: 77.2177 },
    images: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 9152345091", website: "https://www.thirdwavecoffeeroasters.com" },
    price: { value: 800, unit: "range", displayText: "₹600 – ₹900 for two" },
    amenities: ["Free WiFi", "AC", "Power Outlets", "Workspace Friendly"],
    timing: { open: "08:00", close: "23:00", days: "Mon-Sun", is24Hours: false },
    tags: ["coffee", "cafe", "workspace", "connaught-place"],
    isVerified: true,
    rating: { average: 4.4, count: 185 }
  },
  // Mumbai - Food & Dining
  {
    name: "Third Wave Coffee - Bandra",
    description: "Popular artisanal coffee and workspace cafe. Perfect for remote work with high-speed internet, outlets, and quiet atmosphere.",
    categorySlug: "food-dining",
    subcategory: "Cafe / Workspace",
    citySlug: "mumbai",
    locality: "Bandra West",
    address: "Ground Floor, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    coordinates: { lat: 19.0600, lng: 72.8360 },
    images: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"],
    contact: { phone: "+91 7349736854", website: "https://www.thirdwavecoffeeroasters.com" },
    price: { value: 800, unit: "range", displayText: "₹700 – ₹900 for two" },
    amenities: ["Free WiFi", "AC", "Workspace Friendly", "Cards Accepted"],
    timing: { open: "08:00", close: "23:00", days: "Mon–Sun", is24Hours: false },
    tags: ["workspace", "cafe", "bandra", "coffee"],
    isVerified: true,
    rating: { average: 4.4, count: 154 }
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    // Dynamically import database utilities and Mongoose models
    const dbConnect = (await import('../lib/mongodb.js')).default;
    const City = (await import('../models/City.js')).default;
    const Category = (await import('../models/Category.js')).default;
    const Listing = (await import('../models/Listing.js')).default;

    const conn = await dbConnect();
    console.log('Connected. Starting seed operation on:', conn.connection.name);

    // Dynamic import of Apify dataset from workspace if available
    let apifyListings = [];
    const parentDir = path.resolve(__dirname, '../');
    let delhiDatasetPath = '';
    let hydDatasetPath = '';
    
    // Look for dataset files in workspace
    try {
      const foldersToSearch = [parentDir, path.resolve(parentDir, '../')];
      for (const folder of foldersToSearch) {
        const files = fs.readdirSync(folder);
        
        // Find Delhi places file
        const delhiFile = files.find(f => f.startsWith('dataset_crawler-google-places_') && f.endsWith('.json'));
        if (delhiFile) {
          delhiDatasetPath = path.join(folder, delhiFile);
        }
        
        // Find Hyderabad places file
        const hydFile = files.find(f => f.toLowerCase() === 'hyderabad.json');
        if (hydFile) {
          hydDatasetPath = path.join(folder, hydFile);
        }
      }
    } catch (e) {
      console.log('Unable to scan workspace directory for datasets:', e.message);
    }

    // Helper to process raw items into listings format
    const processItems = (rawItems, citySlug, defaultLocality) => {
      rawItems.forEach(item => {
        let categorySlug = 'home-services';
        const catName = (item.categoryName || '').toLowerCase();
        const categoriesList = (item.categories || []).map(c => c.toLowerCase());
        
        const isHousing = catName.includes('hotel') || catName.includes('hostel') || catName.includes('pg') || catName.includes('stay') || catName.includes('lodg') || catName.includes('accommodation') || catName.includes('apartment') ||
                          categoriesList.some(c => c.includes('hotel') || c.includes('hostel') || c.includes('pg') || c.includes('stay') || c.includes('lodg') || c.includes('accommodation') || c.includes('apartment'));
        
        const isFoodDining = catName.includes('restaurant') || catName.includes('cafe') || catName.includes('dining') || catName.includes('eatery') || catName.includes('food') || catName.includes('bar') || catName.includes('pub') ||
                            categoriesList.some(c => c.includes('restaurant') || c.includes('cafe') || c.includes('dining') || c.includes('eatery') || c.includes('food') || c.includes('bar') || c.includes('pub'));

        const isTransport = catName.includes('transport') || catName.includes('bus') || catName.includes('taxi') || catName.includes('courier') || catName.includes('cab') ||
                            categoriesList.some(c => c.includes('transport') || c.includes('bus') || c.includes('taxi') || c.includes('courier') || c.includes('cab'));
        
        const isClean = catName.includes('clean') || catName.includes('maid') || catName.includes('cook') ||
                        categoriesList.some(c => c.includes('clean') || c.includes('maid') || c.includes('cook'));

        if (isHousing) {
          categorySlug = 'housing';
        } else if (isFoodDining) {
          categorySlug = 'food-dining';
        } else if (isTransport) {
          categorySlug = 'transport';
        } else if (isClean) {
          categorySlug = 'maid-cook';
        }
        
        apifyListings.push({
          name: item.title,
          description: item.description || `Verified ${item.categoryName || 'local business'} in ${citySlug === 'delhi' ? 'Delhi' : 'Hyderabad'}. Rated ${item.totalScore || '4.5'}/5 with ${item.reviewsCount || '10'} reviews.`,
          categorySlug,
          subcategory: item.categoryName || 'Service',
          citySlug,
          locality: item.neighborhood || defaultLocality,
          address: item.address || (citySlug === 'delhi' ? 'Delhi' : 'Hyderabad'),
          coordinates: item.location ? { lat: item.location.lat, lng: item.location.lng } : null,
          images: [item.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
          contact: {
            phone: item.phone || '',
            whatsapp: item.phone || '',
            website: item.website || ''
          },
          price: { value: null, unit: 'on_request', displayText: 'On Request' },
          amenities: ['Verified Info', 'Apify Import'],
          timing: { open: '09:00', close: '20:00', days: 'Mon-Sat', is24Hours: false },
          tags: item.categories || [],
          isVerified: true,
          rating: { average: item.totalScore || 4.5, count: item.reviewsCount || 10 }
        });
      });
    };

    // Load Delhi crawler JSON dataset
    if (delhiDatasetPath && fs.existsSync(delhiDatasetPath)) {
      console.log(`Detected Delhi JSON dataset at: ${delhiDatasetPath}!`);
      try {
        const rawContent = fs.readFileSync(delhiDatasetPath, 'utf8');
        const rawItems = JSON.parse(rawContent);
        processItems(rawItems, 'delhi', 'Delhi NCR');
      } catch (err) {
        console.error('Failed to parse Delhi JSON dataset:', err);
      }
    }

    // Load Hyderabad JSON dataset
    if (hydDatasetPath && fs.existsSync(hydDatasetPath)) {
      console.log(`Detected Hyderabad JSON dataset at: ${hydDatasetPath}!`);
      try {
        const rawContent = fs.readFileSync(hydDatasetPath, 'utf8');
        const rawItems = JSON.parse(rawContent);
        processItems(rawItems, 'hyderabad', 'Hyderabad Central');
      } catch (err) {
        console.error('Failed to parse Hyderabad JSON dataset:', err);
      }
    }

    const combinedListings = [...mockListingsData, ...apifyListings];

    // 1. Clear existing collections
    console.log('Clearing old collections...');
    await City.deleteMany({});
    await Category.deleteMany({});
    // Preserve vendor-created user listings so custom additions are never lost during seeding
    await Listing.deleteMany({ vendor: null });
    console.log('Cleared City, Category, and default Listing collections (preserved user listings).');

    // 2. Seed Cities
    console.log('Seeding Cities...');
    const insertedCities = await City.insertMany(CITIES);
    console.log(`Successfully seeded ${insertedCities.length} cities.`);

    // Build city slug -> ObjectId map
    const cityMap = {};
    insertedCities.forEach(city => {
      cityMap[city.slug] = city._id;
    });

    // 3. Seed Categories
    console.log('Seeding Categories...');
    const insertedCategories = await Category.insertMany(CATEGORIES);
    console.log(`Successfully seeded ${insertedCategories.length} categories.`);

    // Build category slug -> ObjectId map
    const categoryMap = {};
    insertedCategories.forEach(category => {
      categoryMap[category.slug] = category._id;
    });

    // 4. Seed Listings
    console.log('Seeding Listings...');
    const listingsToInsert = combinedListings.map(listing => {
      const cityId = cityMap[listing.citySlug];
      const categoryId = categoryMap[listing.categorySlug];

      if (!cityId) {
        throw new Error(`Missing city slug resolver for: ${listing.citySlug} in listing "${listing.name}"`);
      }
      if (!categoryId) {
        throw new Error(`Missing category slug resolver for: ${listing.categorySlug} in listing "${listing.name}"`);
      }

      return {
        ...listing,
        city: cityId,
        category: categoryId,
        isActive: true,
        saveCount: Math.floor(Math.random() * 100),
        viewCount: Math.floor(Math.random() * 500) + 100
      };
    });

    const insertedListings = await Listing.insertMany(listingsToInsert);
    console.log(`Successfully seeded ${insertedListings.length} listings.`);

    // 5. Update City listing counts
    console.log('Updating City listing counts...');
    for (const city of insertedCities) {
      const count = await Listing.countDocuments({ city: city._id });
      await City.findByIdAndUpdate(city._id, { listingCount: count });
    }
    console.log('City listing counts updated.');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding operation failed:', error);
    process.exit(1);
  }
}

seed();
