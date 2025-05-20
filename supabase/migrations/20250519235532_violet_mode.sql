/*
  # Add user credits trigger

  1. Changes
    - Creates a trigger function to handle new user registration
    - Automatically creates initial credits (5000) for new users
    - Adds trigger to auth.users table

  2. Security
    - Function runs with SECURITY DEFINER to ensure it has proper permissions
*/

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Create initial credits for the new user (5000 free credits)
  INSERT INTO public.user_credits (
    user_id,
    credits_remaining,
    credits_used
  ) VALUES (
    NEW.id,
    5000,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();