import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'vendor' && session.user.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in the request', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Convert the Blob/File into a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary under the "basera" preset folder
    const secureUrl = await uploadToCloudinary(buffer);

    return NextResponse.json({
      success: true,
      url: secureUrl
    });
  } catch (error) {
    console.error('POST /api/upload Error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
