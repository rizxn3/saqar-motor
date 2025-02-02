import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth/utils';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find auth record with user details
    const { data: auth, error: authError } = await supabase
      .from('auth')
      .select(`
        *,
        users (
          id,
          name,
          role
        )
      `)
      .eq('email', email)
      .single();

    if (authError || !auth) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = verifyPassword(password, auth.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: auth.users.id,
        name: auth.users.name,
        email: auth.email,
        role: auth.users.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
} 