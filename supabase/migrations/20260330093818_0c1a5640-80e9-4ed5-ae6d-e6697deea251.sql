
-- Members table
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  gender TEXT NOT NULL DEFAULT 'male',
  weight_kg NUMERIC,
  height_cm NUMERIC,
  emergency_contact TEXT,
  notes TEXT,
  starting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view members" ON public.members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update members" ON public.members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete members" ON public.members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  paid_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expires_at DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payments" ON public.payments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update payments" ON public.payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete payments" ON public.payments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Body metrics table
CREATE TABLE public.body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  weight_kg NUMERIC NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view metrics" ON public.body_metrics FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert metrics" ON public.body_metrics FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete metrics" ON public.body_metrics FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Gym settings table
CREATE TABLE public.gym_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_fee NUMERIC NOT NULL DEFAULT 500,
  gym_name TEXT NOT NULL DEFAULT 'My Gym',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gym_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view settings" ON public.gym_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON public.gym_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
