import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_PATHS } from '@/services/api/apiPaths';


const NESTJS_API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').trim().replace(/['"]/g, '');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch(`${NESTJS_API_URL}${API_PATHS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed.' },
        { status: response.status }
      );
    }

    const { accessToken, refreshToken, user } = data;

    const sessionData = Buffer.from(
      JSON.stringify({ accessToken, refreshToken, user })
    ).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set('session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
