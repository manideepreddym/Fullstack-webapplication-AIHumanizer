/*
  # Create trigger for initial user credits

  1. New Trigger
    - Creates a trigger to automatically create user credits when a new user signs up
    - Assigns initial free credits to new users
    
  2. Changes
    - Adds a function to handle new user registration
    - Creates a trigger on auth.users table
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();