import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // e.g. "housing", "tiffin-mess", "home-services"
  },
  icon: {
    type: String,
    required: true,
    // emoji or icon name
  },
  description: {
    type: String,
    default: '',
  },
  subcategories: [
    {
      type: String, // e.g. ["PG", "Flat", "Hostel", "1BHK"]
    },
  ],
  color: {
    type: String,
    default: '#6366F1',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
