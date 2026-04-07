
-- Create profiles table
CREATE TABLE public.profiles (
  uid TEXT PRIMARY KEY,
  telegram_id TEXT UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'Алхимик',
  username TEXT,
  telegram_profile_url TEXT,
  avatar_url TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'player',
  balance INTEGER NOT NULL DEFAULT 1000,
  level INTEGER NOT NULL DEFAULT 1,
  referral_code TEXT UNIQUE,
  referral_count INTEGER NOT NULL DEFAULT 0,
  referral_earnings INTEGER NOT NULL DEFAULT 0,
  referred_by TEXT,
  referred_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (true);

-- Create user_roles table  
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'player');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.profiles(uid) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Superadmins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid()::text, 'superadmin'));

-- Create user_elements table
CREATE TABLE public.user_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid TEXT NOT NULL REFERENCES public.profiles(uid) ON DELETE CASCADE,
  element_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '❓',
  rarity TEXT NOT NULL DEFAULT 'Обычный',
  type TEXT NOT NULL DEFAULT 'Материя',
  state TEXT NOT NULL DEFAULT 'Твердое',
  complexity INTEGER NOT NULL DEFAULT 1,
  temperature DOUBLE PRECISION NOT NULL DEFAULT 20,
  target_temperature DOUBLE PRECISION NOT NULL DEFAULT 22,
  stability DOUBLE PRECISION NOT NULL DEFAULT 100,
  essences TEXT[] NOT NULL DEFAULT '{}',
  reality_level INTEGER NOT NULL DEFAULT 1,
  parents TEXT[],
  is_mutation BOOLEAN NOT NULL DEFAULT false,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  last_decay_at BIGINT,
  last_temp_decay_at BIGINT,
  discovered_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_uid, element_id)
);

ALTER TABLE public.user_elements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own elements"
  ON public.user_elements FOR ALL
  USING (true);

-- Create game_state table
CREATE TABLE public.game_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid TEXT NOT NULL UNIQUE REFERENCES public.profiles(uid) ON DELETE CASCADE,
  world_phase TEXT NOT NULL DEFAULT 'day',
  phase_timer INTEGER NOT NULL DEFAULT 300,
  aihim_balance INTEGER NOT NULL DEFAULT 1000,
  history JSONB NOT NULL DEFAULT '[]',
  prev_rank TEXT NOT NULL DEFAULT 'Закалка Тела',
  prev_layer INTEGER NOT NULL DEFAULT 1,
  prev_level INTEGER NOT NULL DEFAULT 1,
  selected_reality_level INTEGER NOT NULL DEFAULT 1,
  regen_timer INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own game state"
  ON public.game_state FOR ALL
  USING (true);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_uid TEXT NOT NULL REFERENCES public.profiles(uid) ON DELETE CASCADE,
  referred_uid TEXT NOT NULL REFERENCES public.profiles(uid) ON DELETE CASCADE,
  bonus_amount INTEGER NOT NULL DEFAULT 500,
  source TEXT NOT NULL DEFAULT 'telegram',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referred_uid)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own referrals"
  ON public.referrals FOR SELECT
  USING (true);

CREATE POLICY "Insert referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (true);

-- Timestamp update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_elements_updated_at
  BEFORE UPDATE ON public.user_elements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_state_updated_at
  BEFORE UPDATE ON public.game_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert superadmin role for telegram user 169262990
-- This will be linked when the user registers
