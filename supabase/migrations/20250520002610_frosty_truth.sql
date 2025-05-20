/*
  # Fix deduct_credits function

  1. Changes
    - Drop and recreate the deduct_credits function with explicit table references
    - Use user_credits.user_id to avoid ambiguous column reference
    - Add proper error handling for insufficient credits
    - Add validation for negative credit deductions

  2. Security
    - Function remains accessible to authenticated users only
    - Maintains data integrity by using a transaction
*/

CREATE OR REPLACE FUNCTION deduct_credits(
  user_id uuid,
  credits_to_deduct integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  available_credits integer;
BEGIN
  -- Validate input
  IF credits_to_deduct <= 0 THEN
    RAISE EXCEPTION 'Credits to deduct must be positive';
  END IF;

  -- Get available credits
  SELECT credits_remaining INTO available_credits
  FROM user_credits
  WHERE user_credits.user_id = deduct_credits.user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF available_credits IS NULL OR available_credits < credits_to_deduct THEN
    RETURN false;
  END IF;

  -- Update credits
  UPDATE user_credits
  SET 
    credits_remaining = credits_remaining - credits_to_deduct,
    credits_used = credits_used + credits_to_deduct
  WHERE user_credits.user_id = deduct_credits.user_id;

  RETURN true;
END;
$$;