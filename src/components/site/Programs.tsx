import { useI18n } from "@/lib/i18n";
import { Baby, BookOpen, Palette, GraduationCap } from "lucide-react";

const Programs = () => {
  const { tr } = useI18n();

  const programs = [
    { icon: Baby, key: "kg", color: "bg-secondary text-secondary-foreground" },
    { icon: BookOpen, key: "primary", color: "bg-primary text-primary-foreground" },
    { icon: Palette, key: "arts", color: "bg-accent text-accent-foreground" },
    { icon: GraduationCap, key: "tutor", color: "bg-success text-success-foreground" },
  ];

  return (
    <section id="programs" className="py-24 bg-gradient-soft">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary font-bold text-sm">
            {tr("programs.eyebrow")}
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
            {tr("programs.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p, i) => (
            <div
              key={p.key}
              className="group p-7 rounded-3xl bg-card shadow-card hover:-translate-y-2 transition-all duration-300 border border-border/40"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <p.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                {tr(`programs.${p.key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr(`programs.${p.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
