/*
  # Initial Schema Setup

  1. New Tables
    - `subscription_tiers`
      - Defines available subscription plans and their features
    - `user_subscriptions`
      - Links users to their subscription tier
    - `user_credits`
      - Tracks available credits for each user
    - `documents`
      - Stores document history and processing results

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Subscription tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  credits_per_month integer NOT NULL,
  price decimal(10,2) NOT NULL,
  features jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subscription_tiers"
  ON subscription_tiers
  FOR SELECT
  TO public
  USING (true);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  tier_id uuid REFERENCES subscription_tiers NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  credits_remaining integer NOT NULL DEFAULT 0,
  credits_used integer NOT NULL DEFAULT 0,
  last_reset_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  original_text text NOT NULL,
  humanized_text text,
  words_count integer NOT NULL,
  credits_used integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, description, credits_per_month, price, features)
VALUES
  ('Basic', 'Perfect for individuals and small projects', 5000, 9.99, '["5,000 words per month", "Basic text humanization", "Standard support", "Web-based editor"]'),
  ('Pro', 'Ideal for professionals and growing businesses', 50000, 29.99, '["50,000 words per month", "Advanced humanization features", "Priority support", "API access", "Custom tone settings", "Plagiarism checker"]'),
  ('Enterprise', 'For large organizations with specific needs', 999999, 99.99, '["Unlimited words", "Custom AI model training", "Dedicated support", "API access", "Custom integrations", "Team collaboration", "Advanced analytics"]');