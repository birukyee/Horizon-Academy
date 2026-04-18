import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import heroImg from "@/assets/hero-children.jpg";

const Hero = () => {
  const { tr } = useI18n();

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-soft pt-12 pb-24">
      {/* playful blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-secondary/30 animate-blob" aria-hidden />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-accent/20 animate-blob" style={{ animationDelay: "2s" }} aria-hidden />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary/15 animate-blob" style={{ animationDelay: "4s" }} aria-hidden />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/40 border border-secondary text-sm font-bold text-foreground">
            <Sparkles className="h-4 w-4" />
            {tr("hero.tag")}
          </div>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            {tr("hero.title").split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-primary">{word}</span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">{tr("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full h-14 px-8 text-base font-bold gap-2 shadow-soft"
            >
              {tr("hero.cta")} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.querySelector("#programs")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full h-14 px-8 text-base font-bold border-2"
            >
              {tr("hero.cta2")}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-card ring-4 ring-background animate-fade-in">
            <img
              src={heroImg}
              alt="Happy children learning at Horizon Academy"
              width={1536}
              height={1024}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground rounded-2xl px-5 py-4 shadow-soft animate-float">
            <div className="font-display font-bold text-3xl leading-none">A+</div>
            <div className="text-xs font-semibold">Quality Care</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-2xl px-5 py-4 shadow-soft animate-float" style={{ animationDelay: "1.5s" }}>
            <div className="font-display font-bold text-3xl leading-none">500+</div>
            <div className="text-xs font-semibold">Happy Kids</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
