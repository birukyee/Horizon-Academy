import { useI18n } from "@/lib/i18n";
import { Calendar } from "lucide-react";

const News = () => {
  const { tr } = useI18n();

  const items = [
    { key: "1", date: "Sep 2025", color: "bg-primary text-primary-foreground" },
    { key: "2", date: "Oct 2025", color: "bg-accent text-accent-foreground" },
    { key: "3", date: "Nov 2025", color: "bg-success text-success-foreground" },
  ];

  return (
    <section id="news" className="py-24 bg-gradient-soft">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent font-bold text-sm">
            {tr("news.eyebrow")}
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
            {tr("news.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <article key={it.key} className="bg-card rounded-3xl p-7 shadow-card hover:-translate-y-1 transition-transform border border-border/40">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${it.color} text-xs font-bold mb-4`}>
                <Calendar className="h-3.5 w-3.5" />
                {it.date}
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                {tr(`news.${it.key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr(`news.${it.key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
