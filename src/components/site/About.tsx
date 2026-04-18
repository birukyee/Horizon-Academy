import { useI18n } from "@/lib/i18n";
import campusImg from "@/assets/horizon-campus.jpg";
import { Heart, Users, Award } from "lucide-react";

const About = () => {
  const { tr } = useI18n();

  const stats = [
    { icon: Award, value: "10+", label: tr("about.stat1") },
    { icon: Users, value: "500+", label: tr("about.stat2") },
    { icon: Heart, value: "30+", label: tr("about.stat3") },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="rounded-[2rem] overflow-hidden shadow-card ring-4 ring-primary-soft">
            <img src={campusImg} alt="Horizon Academy campus" loading="lazy" className="w-full h-auto object-cover" />
          </div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full animate-wiggle hidden md:block" aria-hidden />
        </div>

        <div className="order-1 lg:order-2 space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent font-bold text-sm">
            {tr("about.eyebrow")}
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground leading-tight">
            {tr("about.title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{tr("about.body")}</p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-4 rounded-2xl bg-primary-soft">
                <s.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="font-display font-bold text-2xl text-primary">{s.value}</div>
                <div className="text-xs font-semibold text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
