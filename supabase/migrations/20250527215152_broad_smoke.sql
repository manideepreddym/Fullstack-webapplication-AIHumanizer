/*
  # Database Schema Setup

  1. Tables
    - subscription_tiers: Subscription plans and pricing
    - user_subscriptions: User subscription management
    - user_credits: Credit tracking system
    - documents: Document storage and processing

  2. Security
    - RLS enabled on all tables
    - User-specific data protection policies
    - Public read access for subscription tiers
    - Authenticated user access for own data

  3. Functions
    - deduct_credits: Secure credit deduction system
*/

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  credits_per_month integer NOT NULL,
  price numeric(10,2) NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Allow public read access to subscription_tiers'
      AND tablename = 'subscription_tiers'
  ) THEN
    CREATE POLICY "Allow public read access to subscription_tiers" ON subscription_tiers FOR
    SELECT TO public USING (TRUE);
  END IF;
END $$;

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  tier_id uuid NOT NULL REFERENCES subscription_tiers(id),
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can read own subscriptions'
      AND tablename = 'user_subscriptions'
  ) THEN
    CREATE POLICY "Users can read own subscriptions" ON user_subscriptions FOR
    SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  credits_remaining integer NOT NULL DEFAULT 0,
  credits_used integer NOT NULL DEFAULT 0,
  last_reset_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can read own credits'
      AND tablename = 'user_credits'
  ) THEN
    CREATE POLICY "Users can read own credits" ON user_credits FOR
    SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can update own credits'
      AND tablename = 'user_credits'
  ) THEN
    CREATE POLICY "Users can update own credits" ON user_credits FOR
    UPDATE TO authenticated USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  original_text text NOT NULL,
  humanized_text text,
  words_count integer NOT NULL,
  credits_used integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can read own documents'
      AND tablename = 'documents'
  ) THEN
    CREATE POLICY "Users can read own documents" ON documents FOR
    SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can insert own documents'
      AND tablename = 'documents'
  ) THEN
    CREATE POLICY "Users can insert own documents" ON documents FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can update own documents'
      AND tablename = 'documents'
  ) THEN
    CREATE POLICY "Users can update own documents" ON documents FOR
    UPDATE TO authenticated USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Users can delete own documents'
      AND tablename = 'documents'
  ) THEN
    CREATE POLICY "Users can delete own documents" ON documents FOR
    DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
  user_id uuid,
  credits_to_deduct integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_credits
  SET credits_remaining = credits_remaining - credits_to_deduct,
      credits_used = credits_used + credits_to_deduct
  WHERE user_id = deduct_credits.user_id
    AND credits_remaining >= credits_to_deduct;
  
  RETURN FOUND;
END;
$$;