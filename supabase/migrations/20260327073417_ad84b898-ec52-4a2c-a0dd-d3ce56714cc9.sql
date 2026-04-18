-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  department TEXT NOT NULL,
  clearance_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read employees (for verification)
CREATE POLICY "Anyone can view employees" ON public.employees FOR SELECT USING (true);

-- Allow anyone to insert employees (no auth for now)
CREATE POLICY "Anyone can insert employees" ON public.employees FOR INSERT WITH CHECK (true);

-- Allow anyone to update employees
CREATE POLICY "Anyone can update employees" ON public.employees FOR UPDATE USING (true);

-- Allow anyone to delete employees
CREATE POLICY "Anyone can delete employees" ON public.employees FOR DELETE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with initial data
INSERT INTO public.employees (employee_id, name, position, organization, department, clearance_level) VALUES
  ('EMP-001', 'Sarah Mitchell', 'Senior Software Engineer', 'Nexus Corp', 'Engineering', 'Level 3'),
  ('EMP-002', 'James Chen', 'Security Director', 'Nexus Corp', 'Security Operations', 'Level 5'),
  ('EMP-003', 'Emily Ross', 'Data Analyst', 'Nexus Corp', 'Intelligence', 'Level 2'),
  ('EMP-004', 'David Park', 'Operations Manager', 'Nexus Corp', 'Operations', 'Level 4');