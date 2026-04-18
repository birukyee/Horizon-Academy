import { useI18n } from "@/lib/i18n";
import logo from "@/assets/horizon-logo.jpg";
import { Facebook, Instagram, Phone } from "lucide-react";

const Footer = () => {
  const { tr } = useI18n();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-14 grid md:grid-cols-3 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Horizon Academy" className="h-12 w-12 rounded-full ring-2 ring-secondary" />
            <div>
              <div className="font-display font-bold text-xl">Horizon Academy</div>
              <div className="text-xs opacity-80">{tr("footer.tagline")}</div>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            {tr("hero.subtitle")}
          </p>
        </div>

        <div>
          <div className="font-display font-bold text-lg mb-3">{tr("nav.contact")}</div>
          <ul className="space-y-2 text-sm opacity-90">
            <li>{tr("contact.address.value")}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0913-000055</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 0966-706126</li>
            <li>info@horizonacademy.et</li>
          </ul>
        </div>

        <div>
          <div className="font-display font-bold text-lg mb-3">Follow</div>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-primary-foreground/15 hover:bg-secondary hover:text-secondary-foreground flex items-center justify-center transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-primary-foreground/15 hover:bg-secondary hover:text-secondary-foreground flex items-center justify-center transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-80">
        © {new Date().getFullYear()} Horizon Academy · {tr("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
