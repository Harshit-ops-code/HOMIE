import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { businessName, businessType, phone, address } = body;

    if (!businessName || !businessType || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required business details', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the user is already registered or has a pending vendor profile
    const existingVendor = await Vendor.findOne({ user: session.user.id });
    if (existingVendor) {
      return NextResponse.json(
        { success: false, error: 'You are already registered or have a pending application', code: 'ALREADY_REGISTERED' },
        { status: 400 }
      );
    }

    // Create the vendor profile (by default isApproved is false and requires admin verification)
    const vendor = await Vendor.create({
      user: session.user.id,
      businessName,
      businessType,
      phone,
      address,
      isApproved: false
    });

    // Update the user's role to 'vendor' so they receive access
    await User.findByIdAndUpdate(session.user.id, { $set: { role: 'vendor' } });

    return NextResponse.json({
      success: true,
      message: 'Vendor application submitted successfully. Your role has been updated to vendor.',
      data: vendor
    });
  } catch (error) {
    console.error('POST /api/vendors Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
