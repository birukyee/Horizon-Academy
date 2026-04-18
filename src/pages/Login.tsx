import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Dumbbell } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);
        const role = roles?.[0]?.role;
        if (role === "admin") navigate("/admin");
      }
      setCheckingAuth(false);
    };
    check();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Login failed");
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const role = roles?.[0]?.role;
      if (role === "admin") navigate("/admin");
      else {
        toast.error("No admin role assigned. Contact the owner.");
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await supabase.functions.invoke("create-admin", {
        body: { email, password },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      toast.success("Admin account created! You can now log in.");
      setIsSetup(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
            <Dumbbell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            GYM HOUSE
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSetup ? "Create the first admin account" : "Management System"}
          </p>
        </div>

        <form onSubmit={isSetup ? handleSetup : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gymhouse.com"
              required
              className="bg-card border-border/50 h-12 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-card border-border/50 h-12 text-foreground"
            />
          </div>
          <Button type="submit" className="w-full h-12 font-bold text-base" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSetup ? "Create Admin" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSetup(!isSetup)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isSetup ? "← Back to login" : "First time? Set up admin account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
