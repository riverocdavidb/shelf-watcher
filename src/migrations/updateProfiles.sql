
-- This SQL file is not directly executed but serves as a reference for the next migration needed

-- Update the profiles table to include username and user_id fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);

-- Update trigger to include username and user_id from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, username, user_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'user_id'
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- For inventory items, we should move from requiring user_id to being nullable for demo data
-- This requires a database migration that should be done carefully in production
-- For this example, we'll assume we can make this change:
ALTER TABLE public.inventory_items ALTER COLUMN user_id DROP NOT NULL;

-- Or alternatively, create a demo user and assign items to that user
-- INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000000', 'demo@example.com');
-- Then update inventory items:
-- UPDATE public.inventory_items SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
