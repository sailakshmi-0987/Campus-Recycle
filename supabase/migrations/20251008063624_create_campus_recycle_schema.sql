/*
  # Campus Recycle Database Schema

  ## Overview
  Creates the complete database structure for a college peer-to-peer marketplace
  where students can share, exchange, or give away items.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User's email
  - `full_name` (text) - Student's full name
  - `college_name` (text) - Name of their college
  - `phone` (text, optional) - Contact number
  - `created_at` (timestamptz) - Account creation time
  
  ### `items`
  - `id` (uuid, primary key) - Unique item identifier
  - `user_id` (uuid, foreign key) - Owner of the item
  - `title` (text) - Item name/title
  - `description` (text) - Detailed description
  - `category` (text) - books, gadgets, clothes, furniture, stationery, other
  - `condition` (text) - new, like-new, good, fair
  - `image_url` (text) - Photo of the item
  - `pickup_location` (text) - Where to collect the item
  - `status` (text) - available, requested, given-away
  - `created_at` (timestamptz) - When item was posted
  
  ### `requests`
  - `id` (uuid, primary key) - Unique request identifier
  - `item_id` (uuid, foreign key) - Requested item
  - `requester_id` (uuid, foreign key) - Student requesting
  - `message` (text) - Request message
  - `status` (text) - pending, accepted, rejected, completed
  - `created_at` (timestamptz) - When request was made

  ## Security
  - Enable RLS on all tables
  - Users can read all profiles
  - Users can update only their own profile
  - Users can read all available items
  - Users can create/update/delete only their own items
  - Users can create requests and read their own requests
  - Item owners can read requests for their items
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  college_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('books', 'gadgets', 'clothes', 'furniture', 'stationery', 'other')),
  condition text NOT NULL CHECK (condition IN ('new', 'like-new', 'good', 'fair')),
  image_url text NOT NULL,
  pickup_location text NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'requested', 'given-away')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available items"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  requester_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON requests FOR SELECT
  TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() IN (
    SELECT user_id FROM items WHERE items.id = requests.item_id
  ));

CREATE POLICY "Users can create requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Item owners can update requests"
  ON requests FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM items WHERE items.id = requests.item_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM items WHERE items.id = requests.item_id
  ));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_requests_item_id ON requests(item_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester_id ON requests(requester_id);