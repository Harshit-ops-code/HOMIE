import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateEmail, validateString } from '@/lib/validator';

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateLim = checkRateLimit(ip, 'auth');
    if (!rateLim.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${rateLim.resetSeconds}s.` },
        { status: 429 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const { name, email, password } = body || {};

    // Input Validation
    if (!validateString(name, 2, 50)) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 50 characters long.' },
        { status: 400 }
      );
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!validateString(password, 6, 100)) {
      return NextResponse.json(
        { error: 'Password must be between 6 and 100 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user'
    });

    return NextResponse.json(
      { success: true, message: 'User registered successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error details:', error);
    return NextResponse.json(
      { error: 'Registration failed due to a server error.' },
      { status: 500 }
    );
  }
}
