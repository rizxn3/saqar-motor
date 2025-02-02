-- Create enum type for user roles
create type user_role as enum ('USER', 'ADMIN', 'VENDOR');

-- Create auth table
create table if not exists auth (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth(id) on delete cascade unique not null,
  name text not null,
  role user_role default 'USER'::user_role not null,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table auth enable row level security;
alter table users enable row level security;

-- Create policies for auth table
create policy "Public read access"
  on auth for select
  using (true);

create policy "Users can insert their own records"
  on auth for insert
  with check (true);

create policy "Users can update their own records"
  on auth for update
  using (id = auth.uid());

-- Create policies for users table
create policy "Public read access"
  on users for select
  using (true);

create policy "Users can insert their own records"
  on users for insert
  with check (true);

create policy "Users can update their own records"
  on users for update
  using (auth_id = auth.uid());

-- Create indexes for better query performance
create index auth_email_idx on auth (email);
create index users_auth_id_idx on users (auth_id); 