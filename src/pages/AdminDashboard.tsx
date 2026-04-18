import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dumbbell, LogOut, Plus, UserPlus, Trash2, Edit, Calendar, Search,
  CreditCard, Users, Loader2, Activity, AlertTriangle, CheckCircle, Eye, Settings,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";

interface Member {
  id: string; full_name: string; phone: string | null; gender: string;
  weight_kg: number | null; height_cm: number | null; emergency_contact: string | null;
  notes: string | null; starting_date: string; active: boolean; created_at: string;
}
interface Payment {
  id: string; member_id: string; amount: number; paid_date: string; expires_at: string;
}
interface GymSettings {
  id: string; monthly_fee: number; gym_name: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");

  // Dialogs
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);

  // Member form
  const [mName, setMName] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mGender, setMGender] = useState("male");
  const [mWeight, setMWeight] = useState("");
  const [mHeight, setMHeight] = useState("");
  const [mEmergency, setMEmergency] = useState("");
  const [mNotes, setMNotes] = useState("");
  const [mStartDate, setMStartDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Payment form
  const [payMemberId, setPayMemberId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Settings form
  const [sMonthlyFee, setSMonthlyFee] = useState("");
  const [sGymName, setSGymName] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/login");
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [m, p, s] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("paid_date", { ascending: false }),
      supabase.from("gym_settings").select("*").limit(1).maybeSingle(),
    ]);
    setMembers((m.data as Member[]) || []);
    setPayments((p.data as Payment[]) || []);
    if (s.data) {
      setSettings(s.data as GymSettings);
      setSMonthlyFee(String((s.data as GymSettings).monthly_fee));
      setSGymName((s.data as GymSettings).gym_name);
    }
    setLoading(false);
  };

  const getMemberStatus = (member: Member) => {
    const memberPayments = payments.filter((p) => p.member_id === member.id);
    if (memberPayments.length === 0) {
      const daysSince = differenceInDays(new Date(), new Date(member.starting_date));
      return { status: daysSince > 30 ? "expired" : "active", daysLeft: Math.max(0, 30 - daysSince), lastExpiry: null };
    }
    const latest = memberPayments.sort((a, b) => new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime())[0];
    const daysLeft = differenceInDays(new Date(latest.expires_at), new Date());
    return { status: daysLeft < 0 ? "expired" : "active", daysLeft: Math.max(0, daysLeft), lastExpiry: latest.expires_at };
  };

  const stats = useMemo(() => {
    const today = new Date();
    let active = 0, expired = 0, expiringSoon = 0;
    const thisMonth = format(today, "yyyy-MM");
    const monthRevenue = payments
      .filter((p) => p.paid_date.startsWith(thisMonth))
      .reduce((s, p) => s + p.amount, 0);

    members.forEach((m) => {
      if (!m.active) return;
      const s = getMemberStatus(m);
      if (s.status === "active") { active++; if (s.daysLeft <= 5) expiringSoon++; }
      else expired++;
    });
    return { active, expired, expiringSoon, monthRevenue, total: members.length };
  }, [members, payments]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = m.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (m.phone && m.phone.includes(search));
      if (!matchSearch) return false;
      if (statusFilter === "all") return true;
      const s = getMemberStatus(m);
      return s.status === statusFilter;
    });
  }, [members, search, statusFilter, payments]);

  const resetMemberForm = () => {
    setMName(""); setMPhone(""); setMGender("male"); setMWeight(""); setMHeight("");
    setMEmergency(""); setMNotes(""); setMStartDate(format(new Date(), "yyyy-MM-dd"));
    setEditMember(null);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        full_name: mName, phone: mPhone || null, gender: mGender,
        weight_kg: mWeight ? parseFloat(mWeight) : null,
        height_cm: mHeight ? parseFloat(mHeight) : null,
        emergency_contact: mEmergency || null, notes: mNotes || null,
        starting_date: mStartDate,
      };

      if (editMember) {
        const { error } = await supabase.from("members").update(data).eq("id", editMember.id);
        if (error) throw error;
        toast.success("Member updated!");
      } else {
        const { error } = await supabase.from("members").insert(data);
        if (error) throw error;
        toast.success("Member registered!");
      }
      setMemberDialogOpen(false);
      resetMemberForm();
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Delete this member and all their data?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Member deleted"); setDetailMember(null); fetchAll(); }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const paidDate = new Date(payDate);
      const expiresAt = new Date(paidDate);
      expiresAt.setDate(expiresAt.getDate() + 30);
      const { error } = await supabase.from("payments").insert({
        member_id: payMemberId,
        amount: parseFloat(payAmount),
        paid_date: payDate,
        expires_at: format(expiresAt, "yyyy-MM-dd"),
      });
      if (error) throw error;
      toast.success("Payment recorded!");
      setPaymentDialogOpen(false);
      setPayMemberId(""); setPayAmount(settings ? String(settings.monthly_fee) : "");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!settings) throw new Error("No settings found");
      const { error } = await supabase.from("gym_settings").update({
        monthly_fee: parseFloat(sMonthlyFee), gym_name: sGymName,
      }).eq("id", settings.id);
      if (error) throw error;
      toast.success("Settings saved!");
      setSettingsDialogOpen(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEditMember = (m: Member) => {
    setEditMember(m);
    setMName(m.full_name); setMPhone(m.phone || ""); setMGender(m.gender);
    setMWeight(m.weight_kg ? String(m.weight_kg) : "");
    setMHeight(m.height_cm ? String(m.height_cm) : "");
    setMEmergency(m.emergency_contact || ""); setMNotes(m.notes || "");
    setMStartDate(m.starting_date);
    setMemberDialogOpen(true);
  };

  const openPayment = (memberId?: string) => {
    setPayMemberId(memberId || "");
    setPayAmount(settings ? String(settings.monthly_fee) : "500");
    setPayDate(format(new Date(), "yyyy-MM-dd"));
    setPaymentDialogOpen(true);
  };

  const getBMI = (w: number | null, h: number | null) => {
    if (!w || !h) return null;
    return (w / ((h / 100) ** 2)).toFixed(1);
  };

  const memberPayments = (id: string) => payments.filter((p) => p.member_id === id);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground">{settings?.gym_name || "GYM HOUSE"}</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSettingsDialogOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/login"); }} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<Users className="h-5 w-5" />} label="Active Members" value={stats.active} color="text-primary" />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Expired" value={stats.expired} color="text-destructive" />
          <StatCard icon={<Activity className="h-5 w-5" />} label="Expiring Soon" value={stats.expiringSoon} color="text-yellow-400" />
          <StatCard icon={<CreditCard className="h-5 w-5" />} label="This Month" value={`${stats.monthRevenue.toLocaleString()} ETB`} color="text-primary" />
        </div>

        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="bg-card border border-border/50 w-full justify-start overflow-x-auto">
            <TabsTrigger value="members" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Members</TabsTrigger>
            <TabsTrigger value="payments" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Payments</TabsTrigger>
            <TabsTrigger value="expiring" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Due This Week</TabsTrigger>
          </TabsList>

          {/* MEMBERS TAB */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card border-border/50"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-md bg-card border border-border/50 text-sm text-foreground"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
                <Button onClick={() => { resetMemberForm(); setMemberDialogOpen(true); }} className="gap-2" size="sm">
                  <UserPlus className="h-4 w-4" /> Add Member
                </Button>
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="rounded-xl bg-card border border-border/50 p-8 text-center text-muted-foreground">
                No members found
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredMembers.map((m) => {
                  const s = getMemberStatus(m);
                  return (
                    <div key={m.id} className="rounded-xl bg-card border border-border/50 p-4 animate-fade-in hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                            {m.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{m.full_name}</p>
                            <p className="text-xs text-muted-foreground">{m.phone || "No phone"}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                          s.status === "active"
                            ? "bg-primary/15 text-primary border-primary/20"
                            : "bg-destructive/15 text-destructive border-destructive/20"
                        }`}>
                          {s.status === "active" ? `${s.daysLeft}d left` : "Expired"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setDetailMember(m)} className="gap-1 flex-1">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditMember(m)} className="gap-1 flex-1">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openPayment(m.id)} className="gap-1 flex-1 text-primary">
                          <CreditCard className="h-3.5 w-3.5" /> Pay
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading text-foreground">Payment History</h2>
              <Button onClick={() => openPayment()} className="gap-2" size="sm">
                <Plus className="h-4 w-4" /> Record Payment
              </Button>
            </div>
            {payments.length === 0 ? (
              <div className="rounded-xl bg-card border border-border/50 p-8 text-center text-muted-foreground">
                No payments recorded yet
              </div>
            ) : (
              <div className="space-y-2">
                {payments.slice(0, 50).map((p) => {
                  const member = members.find((m) => m.id === p.member_id);
                  return (
                    <div key={p.id} className="rounded-xl bg-card border border-border/50 p-4 flex items-center justify-between animate-fade-in">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{member?.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          Paid: {format(new Date(p.paid_date), "MMM d, yyyy")} · Expires: {format(new Date(p.expires_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span className="font-bold text-primary">{p.amount.toLocaleString()} ETB</span>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* EXPIRING TAB */}
          <TabsContent value="expiring" className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-foreground">Due This Week</h2>
            {(() => {
              const due = members.filter((m) => {
                if (!m.active) return false;
                const s = getMemberStatus(m);
                return s.daysLeft <= 7;
              }).sort((a, b) => getMemberStatus(a).daysLeft - getMemberStatus(b).daysLeft);

              if (due.length === 0) return (
                <div className="rounded-xl bg-card border border-border/50 p-8 text-center text-muted-foreground">
                  No members expiring this week 🎉
                </div>
              );

              return (
                <div className="space-y-2">
                  {due.map((m) => {
                    const s = getMemberStatus(m);
                    return (
                      <div key={m.id} className="rounded-xl bg-card border border-border/50 p-4 flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            s.status === "expired" ? "bg-destructive/15 text-destructive" : "bg-yellow-500/15 text-yellow-400"
                          }`}>
                            {s.daysLeft}d
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{m.full_name}</p>
                            <p className="text-xs text-muted-foreground">{m.phone || "No phone"}</p>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => openPayment(m.id)} className="gap-1">
                          <CreditCard className="h-3.5 w-3.5" /> Pay
                        </Button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </main>

      {/* MEMBER DETAIL DIALOG */}
      <Dialog open={!!detailMember} onOpenChange={(o) => !o && setDetailMember(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Member Profile</DialogTitle>
          </DialogHeader>
          {detailMember && (() => {
            const s = getMemberStatus(detailMember);
            const bmi = getBMI(detailMember.weight_kg, detailMember.height_cm);
            const mPayments = memberPayments(detailMember.id);
            return (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl mb-2">
                    {detailMember.full_name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg">{detailMember.full_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    s.status === "active" ? "bg-primary/15 text-primary border-primary/20" : "bg-destructive/15 text-destructive border-destructive/20"
                  }`}>
                    {s.status === "active" ? `Active · ${s.daysLeft} days left` : "Expired"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoItem label="Phone" value={detailMember.phone || "—"} />
                  <InfoItem label="Gender" value={detailMember.gender} />
                  <InfoItem label="Weight" value={detailMember.weight_kg ? `${detailMember.weight_kg} kg` : "—"} />
                  <InfoItem label="Height" value={detailMember.height_cm ? `${detailMember.height_cm} cm` : "—"} />
                  <InfoItem label="BMI" value={bmi || "—"} />
                  <InfoItem label="Started" value={format(new Date(detailMember.starting_date), "MMM d, yyyy")} />
                  <InfoItem label="Emergency" value={detailMember.emergency_contact || "—"} />
                </div>
                {detailMember.notes && (
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs mb-1">Notes</p>
                    <p className="bg-muted/50 p-2 rounded text-foreground">{detailMember.notes}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Payment History</p>
                  {mPayments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No payments yet</p>
                  ) : (
                    <div className="space-y-1">
                      {mPayments.map((p) => (
                        <div key={p.id} className="flex justify-between text-sm bg-muted/30 rounded px-3 py-2">
                          <span className="text-muted-foreground">{format(new Date(p.paid_date), "MMM d, yyyy")}</span>
                          <span className="font-semibold text-primary">{p.amount.toLocaleString()} ETB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-1" onClick={() => openPayment(detailMember.id)}>
                    <CreditCard className="h-4 w-4" /> Record Payment
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteMember(detailMember.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ADD/EDIT MEMBER DIALOG */}
      <Dialog open={memberDialogOpen} onOpenChange={(o) => { if (!o) { setMemberDialogOpen(false); resetMemberForm(); } }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editMember ? "Edit Member" : "Register New Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMember} className="space-y-3">
            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input value={mName} onChange={(e) => setMName(e.target.value)} required className="bg-card" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={mPhone} onChange={(e) => setMPhone(e.target.value)} className="bg-card" />
              </div>
              <div className="space-y-1">
                <Label>Gender *</Label>
                <select value={mGender} onChange={(e) => setMGender(e.target.value)} className="w-full px-3 py-2 rounded-md bg-card border border-input text-sm text-foreground">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.1" value={mWeight} onChange={(e) => setMWeight(e.target.value)} className="bg-card" />
              </div>
              <div className="space-y-1">
                <Label>Height (cm)</Label>
                <Input type="number" step="0.1" value={mHeight} onChange={(e) => setMHeight(e.target.value)} className="bg-card" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Starting Date *</Label>
              <Input type="date" value={mStartDate} onChange={(e) => setMStartDate(e.target.value)} required className="bg-card" />
            </div>
            <div className="space-y-1">
              <Label>Emergency Contact</Label>
              <Input value={mEmergency} onChange={(e) => setMEmergency(e.target.value)} className="bg-card" />
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Textarea value={mNotes} onChange={(e) => setMNotes(e.target.value)} className="bg-card" rows={2} />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editMember ? "Update Member" : "Register Member"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAYMENT DIALOG */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Record Payment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecordPayment} className="space-y-3">
            <div className="space-y-1">
              <Label>Member *</Label>
              <select value={payMemberId} onChange={(e) => setPayMemberId(e.target.value)} required className="w-full px-3 py-2 rounded-md bg-card border border-input text-sm text-foreground">
                <option value="">Select member</option>
                {members.filter(m => m.active).map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Amount (ETB) *</Label>
                <Input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required className="bg-card" />
              </div>
              <div className="space-y-1">
                <Label>Date *</Label>
                <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} required className="bg-card" />
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
              Expires: <span className="text-foreground font-medium">
                {format(new Date(new Date(payDate).getTime() + 30 * 86400000), "MMM d, yyyy")}
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Record Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* SETTINGS DIALOG */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Gym Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="space-y-1">
              <Label>Gym Name</Label>
              <Input value={sGymName} onChange={(e) => setSGymName(e.target.value)} className="bg-card" />
            </div>
            <div className="space-y-1">
              <Label>Monthly Fee (ETB)</Label>
              <Input type="number" value={sMonthlyFee} onChange={(e) => setSMonthlyFee(e.target.value)} className="bg-card" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Settings
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
  <div className="rounded-xl bg-card border border-border/50 p-4 space-y-2">
    <div className={`${color}`}>{icon}</div>
    <p className="text-2xl font-bold font-heading text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

export default AdminDashboard;
