/*
  # Initial Schema Setup for SVS Mess Record Application

  ## Overview
  This migration sets up the complete database schema for the mess record management system.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key) - References auth.users(id)
  - `full_name` (text) - User's full name
  - `avatar_initials` (text) - Generated initials for avatar display
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. `daily_entries`
  Daily mess attendance and meal count records
  - `id` (uuid, primary key) - Unique entry identifier
  - `user_id` (uuid) - References profiles(id), who created the entry
  - `entry_date` (date) - The date for this entry (unique per day)
  - `morning_count` (integer) - Number of people for morning meal
  - `night_count` (integer) - Number of people for night meal
  - `total_attendance` (integer) - Total attendance for the day
  - `created_at` (timestamptz) - Entry creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `products`
  Inventory items and supplies
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `quantity` (text) - Quantity/unit description (e.g., "25kg Bag")
  - `created_by` (uuid) - References profiles(id)
  - `created_at` (timestamptz) - Product creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `entry_products`
  Junction table linking products used in daily entries
  - `id` (uuid, primary key) - Unique identifier
  - `entry_id` (uuid) - References daily_entries(id)
  - `product_id` (uuid) - References products(id)
  - `quantity_used` (text) - Amount of product used
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. `messages`
  Group chat messages
  - `id` (uuid, primary key) - Unique message identifier
  - `user_id` (uuid) - References profiles(id), message sender
  - `content` (text) - Message text content
  - `created_at` (timestamptz) - Message send timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:

  #### Profiles
  - Users can view all profiles (for chat and collaboration)
  - Users can only update their own profile
  - Profiles are auto-created via trigger on auth.users insert

  #### Daily Entries
  - All authenticated users can view entries
  - All authenticated users can create entries
  - Users can update/delete their own entries

  #### Products
  - All authenticated users can view products
  - All authenticated users can create products
  - Users can update/delete products they created

  #### Entry Products
  - All authenticated users can view entry products
  - Entry products inherit permissions from parent entry

  #### Messages
  - All authenticated users can view all messages
  - Users can only create messages as themselves
  - Users can only delete their own messages

  ## Important Notes
  - Uses UUID for all primary keys with gen_random_uuid() default
  - Timestamps use timestamptz with now() default for audit trails
  - Foreign keys use ON DELETE CASCADE for data consistency
  - Unique constraint on daily_entries.entry_date ensures one entry per day
  - Automatic profile creation via trigger when users sign up
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_initials text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create daily_entries table
CREATE TABLE IF NOT EXISTS daily_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date date NOT NULL UNIQUE,
  morning_count integer NOT NULL DEFAULT 0,
  night_count integer NOT NULL DEFAULT 0,
  total_attendance integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all entries"
  ON daily_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create entries"
  ON daily_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON daily_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON daily_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity text NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create entry_products junction table
CREATE TABLE IF NOT EXISTS entry_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES daily_entries(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity_used text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE entry_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all entry products"
  ON entry_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create entry products for their entries"
  ON entry_products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_entries
      WHERE daily_entries.id = entry_id
      AND daily_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete entry products for their entries"
  ON entry_products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_entries
      WHERE daily_entries.id = entry_id
      AND daily_entries.user_id = auth.uid()
    )
  );

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_initials)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', 'U'), 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();