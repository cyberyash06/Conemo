import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { generateRandomUsername, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    await connectDB();

    const username = generateRandomUsername();

    const newUser = await User.create({
      username,
    });

    const token = signToken({
      userId: newUser._id.toString(),
      username: newUser.username,
    });

    // Set HTTP-only cookie
    cookies().set({
      name: 'guest_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 6, // 6 hours
      sameSite: 'strict',
    });

    return NextResponse.json({
      success: true,
      message: 'Guest session created',
      data: {
        userId: newUser._id.toString(),
        username: newUser.username,
      },
    });
  } catch (error: unknown) {
    console.error('Guest Auth Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
