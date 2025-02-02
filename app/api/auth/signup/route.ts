import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth/utils';

export async function POST(request: Request) {
  try {
    const { name, email, password, companyName } = await request.json();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('auth')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create auth entry
    const { data: auth, error: authError } = await supabase
      .from('auth')
      .insert([
        {
          email,
          password: hashPassword(password)
        }
      ])
      .select()
      .single();

    if (authError) {
      throw new Error('Failed to create auth entry');
    }

    // Create user entry
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([
        {
          auth_id: auth.id,
          name,
          company_name: companyName,
          role: 'USER'
        }
      ])
      .select()
      .single();

    if (userError) {
      // Cleanup auth entry if user creation fails
      await supabase.from('auth').delete().eq('id', auth.id);
      throw new Error('Failed to create user entry');
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: auth.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 