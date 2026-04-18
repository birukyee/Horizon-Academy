import { useState } from "react";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/horizon-logo.jpg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang, tr } = useI18n();

  const links = [
    { href: "#home", key: "nav.home" },
    { href: "#about", key: "nav.about" },
    { href: "#programs", key: "nav.programs" },
    { href: "#gallery", key: "nav.gallery" },
    { href: "#news", key: "nav.news" },
    { href: "#contact", key: "nav.contact" },
  ];

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-20">
        <button onClick={() => scrollTo("#home")} className="flex items-center gap-3">
          <img src={logo} alt="Horizon Academy logo" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" />
          <div className="text-left hidden sm:block">
            <div className="font-display font-bold text-lg leading-none text-primary">Horizon Academy</div>
            <div className="text-xs text-muted-foreground">{tr("footer.tagline")}</div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => scrollTo(l.href)}
              className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary-soft transition-colors"
            >
              {tr(l.key)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "am" : "en")}
            className="gap-1.5 rounded-full"
          >
            <Languages className="h-4 w-4" />
            <span className="font-bold text-xs">{lang === "en" ? "አማ" : "EN"}</span>
          </Button>
          <Button onClick={() => scrollTo("#contact")} className="hidden sm:inline-flex rounded-full font-semibold">
            {tr("nav.enroll")}
          </Button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-full hover:bg-muted">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => scrollTo(l.href)}
                className="px-4 py-3 text-left rounded-xl font-semibold text-foreground/80 hover:bg-primary-soft hover:text-primary"
              >
                {tr(l.key)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
