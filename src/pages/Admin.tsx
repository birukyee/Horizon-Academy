import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, Plus, Pencil, Trash2, LogOut, Loader2, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Employee = Tables<"employees">;

interface EmployeeForm {
  employee_id: string;
  name: string;
  position: string;
  organization: string;
  department: string;
  clearance_level: string;
}

const emptyForm: EmployeeForm = {
  employee_id: "",
  name: "",
  position: "",
  organization: "",
  department: "",
  clearance_level: "",
};

const Admin = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchEmployees();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Failed to load employees");
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({
      employee_id: emp.employee_id,
      name: emp.name,
      position: emp.position,
      organization: emp.organization,
      department: emp.department,
      clearance_level: emp.clearance_level,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from("employees")
          .update(form)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Employee updated!");
      } else {
        const { error } = await supabase.from("employees").insert(form);
        if (error) throw error;
        toast.success("Employee added!");
      }
      setDialogOpen(false);
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Delete ${emp.name}?`)) return;
    const { error } = await supabase.from("employees").delete().eq("id", emp.id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Employee deleted");
      fetchEmployees();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-admin", {
        body: { email: adminEmail, password: adminPassword },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(`Admin account created for ${adminEmail}`);
      setAdminDialogOpen(false);
      setAdminEmail("");
      setAdminPassword("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const updateField = (field: keyof EmployeeForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">Employee Management</h1>
              <p className="text-muted-foreground text-sm">Add, edit, or remove employees</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAdminDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" /> Add Admin
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Verifier
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Add button */}
        <div className="flex justify-end mb-4">
          <Button onClick={handleOpenAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border/50 overflow-hidden bg-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No employees yet. Click "Add Employee" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Position</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Clearance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-mono text-sm text-primary">{emp.employee_id}</TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{emp.position}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{emp.department}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                        {emp.clearance_level}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(emp)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(emp)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {(
              [
                ["employee_id", "Employee ID", "EMP-005"],
                ["name", "Full Name", "John Doe"],
                ["position", "Position", "Software Engineer"],
                ["organization", "Organization", "Nexus Corp"],
                ["department", "Department", "Engineering"],
                ["clearance_level", "Clearance Level", "Level 3"],
              ] as const
            ).map(([field, label, placeholder]) => (
              <div key={field} className="space-y-1.5">
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  value={form[field]}
                  onChange={(e) => updateField(field, e.target.value)}
                  placeholder={placeholder}
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editing ? "Update Employee" : "Add Employee"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="newadmin@example.com"
                required
                className="bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-muted/50 border-border/50"
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={creatingAdmin}>
              {creatingAdmin ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create Admin Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
