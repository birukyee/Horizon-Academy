import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  role: "admin" | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const fetchRole = async (userId: string) => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      return (roles?.[0]?.role as "admin") || null;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const role = await fetchRole(session.user.id);
          setState({ user: session.user, role, loading: false });
        } else {
          setState({ user: null, role: null, loading: false });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await fetchRole(session.user.id);
        setState({ user: session.user, role, loading: false });
      } else {
        setState({ user: null, role: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...state,
    isAdmin: state.role === "admin",
    signOut: () => supabase.auth.signOut(),
  };
}
