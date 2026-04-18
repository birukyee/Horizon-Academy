import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const { tr } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(tr("contact.form.success"));
    setForm({ name: "", email: "", message: "" });
  };

  const info = [
    {
      icon: MapPin,
      label: tr("contact.address.label"),
      value: tr("contact.address.value"),
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: Phone,
      label: tr("contact.phone.label"),
      value: "0913-000055 · 0966-706126",
      color: "bg-accent text-accent-foreground",
    },
    {
      icon: Clock,
      label: tr("contact.hours.label"),
      value: tr("contact.hours.value"),
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@horizonacademy.et",
      color: "bg-success text-success-foreground",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary font-bold text-sm">
            {tr("contact.eyebrow")}
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
            {tr("contact.title")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info + map */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {info.map((it) => (
                <div key={it.label} className="p-5 rounded-2xl bg-card border border-border/40 shadow-soft">
                  <div className={`w-10 h-10 rounded-xl ${it.color} flex items-center justify-center mb-3`}>
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-foreground">{it.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{it.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl overflow-hidden border border-border/40 shadow-soft h-72">
              <iframe
                title="Horizon Academy location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=38.74%2C8.83%2C38.86%2C8.92&layer=mapnik&marker=8.875%2C38.80"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="bg-gradient-soft rounded-3xl p-8 shadow-card border border-border/40 space-y-4">
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">{tr("contact.form.name")}</label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl h-12 bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">{tr("contact.form.email")}</label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl h-12 bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">{tr("contact.form.message")}</label>
              <Textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-xl bg-background resize-none"
              />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full h-13 font-bold gap-2">
              <Send className="h-4 w-4" />
              {tr("contact.form.send")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
