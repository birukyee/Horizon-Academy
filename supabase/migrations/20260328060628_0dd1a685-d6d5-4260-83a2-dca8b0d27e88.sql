
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'barber');

-- User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
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

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Barbers table
CREATE TABLE public.barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Barber',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view barbers" ON public.barbers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert barbers" ON public.barbers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update barbers" ON public.barbers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete barbers" ON public.barbers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Service types table
CREATE TABLE public.service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view service types" ON public.service_types
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert service types" ON public.service_types
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update service types" ON public.service_types
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete service types" ON public.service_types
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Service records table
CREATE TABLE public.service_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid REFERENCES public.barbers(id) ON DELETE CASCADE NOT NULL,
  service_type_id uuid REFERENCES public.service_types(id) NOT NULL,
  service_date date NOT NULL DEFAULT CURRENT_DATE,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all records" ON public.service_records
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Barbers can view own records" ON public.service_records
  FOR SELECT TO authenticated USING (
    barber_id IN (SELECT id FROM public.barbers WHERE user_id = auth.uid())
  );
CREATE POLICY "Admins can insert records" ON public.service_records
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update records" ON public.service_records
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete records" ON public.service_records
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Barbers can confirm own records" ON public.service_records
  FOR UPDATE TO authenticated
  USING (barber_id IN (SELECT id FROM public.barbers WHERE user_id = auth.uid()))
  WITH CHECK (barber_id IN (SELECT id FROM public.barbers WHERE user_id = auth.uid()));
