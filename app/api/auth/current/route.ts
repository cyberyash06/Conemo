import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const token = cookies().get('guest_token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      userId: payload.userId,
      username: payload.username,
    },
  });
}
