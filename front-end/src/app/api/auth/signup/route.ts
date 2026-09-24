import { API_PATHS } from '@/services/api/apiPaths';
import { NextResponse } from 'next/server';



const NESTJS_API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').trim().replace(/['"]/g, '');

export async function POST(request: Request) {
  try {
    const signupData = await request.json();

    const response = await fetch(`${NESTJS_API_URL}${API_PATHS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Signup failed.' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
