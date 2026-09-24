import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NESTJS_API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').trim().replace(/['"]/g, '');

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    // Decode session and extract access token
    const sessionDataStr = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(sessionDataStr);
    const { accessToken } = session;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    // Parse incoming queries from request URL
    const { search } = new URL(request.url);

    // Call NestJS backend /api/audit-logs passing queries and attaching the Bearer token
    const response = await fetch(`${NESTJS_API_URL}/api/audit-logs${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch audit logs.' },
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
