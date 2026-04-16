CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  feeling TEXT NOT NULL,
  gratitude TEXT NOT NULL,
  intention TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying a user's check-ins efficiently
CREATE INDEX check_ins_user_id_idx ON public.check_ins (user_id);

-- Enable Row Level Security so users can only access their own data
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own check-ins"
  ON public.check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own check-ins"
  ON public.check_ins FOR SELECT
  USING (auth.uid() = user_id);
