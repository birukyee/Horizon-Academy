import { useI18n } from "@/lib/i18n";
import campus from "@/assets/horizon-campus.jpg";
import playground from "@/assets/gallery-playground.jpg";
import storytime from "@/assets/gallery-storytime.jpg";
import art from "@/assets/gallery-art.jpg";
import classroom from "@/assets/hero-children.jpg";

const Gallery = () => {
  const { tr } = useI18n();

  const images = [
    { src: classroom, alt: "Children in classroom", className: "row-span-2" },
    { src: playground, alt: "Playground fun" },
    { src: storytime, alt: "Story time" },
    { src: art, alt: "Arts and crafts", className: "col-span-2" },
    { src: campus, alt: "Campus exterior" },
  ];

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/30 text-foreground font-bold text-sm">
            {tr("gallery.eyebrow")}
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
            {tr("gallery.title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-3xl shadow-card group ${img.className ?? ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
