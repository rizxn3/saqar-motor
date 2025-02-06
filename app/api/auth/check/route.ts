import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token');

  if (!authToken?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}
