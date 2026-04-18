-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Anyone can update employees" ON public.employees;
DROP POLICY IF EXISTS "Anyone can delete employees" ON public.employees;

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert employees" ON public.employees
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update employees" ON public.employees
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete employees" ON public.employees
  FOR DELETE USING (auth.uid() IS NOT NULL);