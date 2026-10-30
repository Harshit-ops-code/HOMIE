import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Magic bytes checks for image formats
function validateImageSignature(buffer) {
  if (buffer.length < 4) return false;
  
  const hex = buffer.toString('hex', 0, 4).toUpperCase();
  
  // JPEG: FF D8 FF
  if (hex.startsWith('FFD8FF')) return true;
  // PNG: 89 50 4E 47
  if (hex === '89504E47') return true;
  // GIF: 47 49 46 38 ("GIF8")
  if (hex === '47494638') return true;
  
  // WebP: RIFF ... WEBP (offset 8)
  if (buffer.length >= 12) {
    const riff = buffer.toString('utf8', 0, 4);
    const webp = buffer.toString('utf8', 8, 12);
    if (riff === 'RIFF' && webp === 'WEBP') return true;
  }
  
  return false;
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const rateLim = checkRateLimit(ip, 'user');
    if (!rateLim.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Try again in ${rateLim.resetSeconds}s.`, code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      );
    }

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum limit of 5MB', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPG, PNG, GIF, and WEBP image uploads are allowed', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Convert the Blob/File into a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify file content headers (magic numbers) to prevent executable masquerading
    if (!validateImageSignature(buffer)) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file signature does not match a valid image type', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary under the "basera" preset folder
    const secureUrl = await uploadToCloudinary(buffer);

    return NextResponse.json({
      success: true,
      url: secureUrl
    });
  } catch (error) {
    console.error('POST /api/upload Error Details:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed due to a server error.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
