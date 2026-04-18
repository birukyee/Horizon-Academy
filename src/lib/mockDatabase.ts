import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Employee = Tables<"employees">;

export async function lookupEmployee(qrData: string): Promise<Employee | null> {
  // Try direct employee_id match
  const { data: directMatch } = await supabase
    .from("employees")
    .select("*")
    .eq("employee_id", qrData.trim())
    .maybeSingle();

  if (directMatch) return directMatch;

  // Try parsing as JSON
  try {
    const parsed = JSON.parse(qrData);
    if (parsed.id) {
      const { data } = await supabase
        .from("employees")
        .select("*")
        .eq("employee_id", parsed.id)
        .maybeSingle();
      if (data) return data;
    }
  } catch {
    // Not JSON
  }

  // Try partial match
  const upper = qrData.toUpperCase().trim();
  const { data: allEmployees } = await supabase.from("employees").select("*");
  if (allEmployees) {
    for (const emp of allEmployees) {
      if (upper.includes(emp.employee_id)) return emp;
    }
  }

  return null;
}
