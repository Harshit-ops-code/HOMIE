import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Listing name is required'],
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: String,
    default: '',
    // e.g. "PG", "Electrician", "Veg Mess"
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  locality: {
    type: String,
    required: true,
    // e.g. "Koramangala", "Indiranagar"
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  images: [
    {
      type: String, // Cloudinary URLs
    },
  ],
  contact: {
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  price: {
    value: { type: Number, default: null },
    maxValue: { type: Number, default: null },
    unit: {
      type: String,
      enum: ['per_month', 'per_visit', 'per_kg', 'per_meal', 'range', 'free', 'on_request'],
      default: 'on_request',
    },
    displayText: { type: String, default: '' }, // e.g. "₹5,500/mo" or "₹50–200"
  },
  amenities: [
    {
      type: String, // e.g. ["WiFi", "AC", "Attached Bathroom"]
    },
  ],
  timing: {
    open: { type: String, default: '' },   // e.g. "09:00"
    close: { type: String, default: '' },  // e.g. "22:00"
    days: { type: String, default: 'Mon–Sun' },
    is24Hours: { type: Boolean, default: false },
  },
  tags: [
    {
      type: String, // e.g. ["budget", "women-only", "vegetarian"]
    },
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  saveCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  // AI summarizer cache
  aiSummary: {
    type: String,
    default: null,
  },
  aiSummaryGeneratedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Indexes for fast queries
ListingSchema.index({ city: 1, category: 1 });
ListingSchema.index({ city: 1, 'rating.average': -1 });
ListingSchema.index({ name: 'text', description: 'text', locality: 'text' });
ListingSchema.index({ coordinates: '2dsphere' });

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
