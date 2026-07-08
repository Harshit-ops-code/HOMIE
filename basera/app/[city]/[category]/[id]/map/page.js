import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import MapPageClient from '@/components/MapPageClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await dbConnect();
  const listing = await Listing.findById(id).lean();
  return {
    title: listing ? `${listing.name} — Map Location` : 'Map Location',
    description: 'Find listing location and driving directions on the interactive map.',
  };
}

export default async function MapPage({ params }) {
  const { city, category, id } = await params;

  await dbConnect();

  const listing = await Listing.findById(id).lean();

  if (!listing) {
    notFound();
  }

  // Serialize listing coordinates and data for client component boundaries
  const coordinates = listing.coordinates || { lat: 12.9716, lng: 77.5946 };
  const serializedListing = {
    _id: listing._id.toString(),
    name: listing.name,
    address: listing.address || `${listing.locality}, ${city}`,
    coordinates
  };

  return (
    <MapPageClient
      listing={serializedListing}
      city={city}
      category={category}
      id={id}
    />
  );
}
