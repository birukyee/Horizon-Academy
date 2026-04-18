import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "am";

type Dict = Record<string, { en: string; am: string }>;

export const t: Dict = {
  // Nav
  "nav.home": { en: "Home", am: "መነሻ" },
  "nav.about": { en: "About", am: "ስለ እኛ" },
  "nav.programs": { en: "Programs", am: "ፕሮግራሞች" },
  "nav.gallery": { en: "Gallery", am: "ጋለሪ" },
  "nav.news": { en: "News", am: "ዜና" },
  "nav.contact": { en: "Contact", am: "ያግኙን" },
  "nav.enroll": { en: "Enroll Now", am: "ይመዝገቡ" },

  // Hero
  "hero.tag": { en: "Center of Wisdom", am: "የጥበብ ማዕከል" },
  "hero.title": { en: "Where Bright Minds Begin", am: "የብሩህ አእምሮዎች መነሻ" },
  "hero.subtitle": {
    en: "Horizon Academy nurtures curious learners with joyful classrooms, caring teachers, and a love for discovery.",
    am: "የሆራይዘን አካዳሚ ተማሪዎችን በደስታ የተሞላ ትምህርት ቤት፣ አሳቢ መምህራን እና የመማር ፍላጎት ያዳብራል።",
  },
  "hero.cta": { en: "Visit the Campus", am: "ካምፓሱን ይጎብኙ" },
  "hero.cta2": { en: "Our Programs", am: "ፕሮግራሞቻችን" },

  // About
  "about.eyebrow": { en: "About Horizon", am: "ስለ ሆራይዘን" },
  "about.title": { en: "A Joyful Place to Learn & Grow", am: "ለመማርና ለማደግ ደስ የሚል ቦታ" },
  "about.body": {
    en: "We believe every child carries a spark of brilliance. Our caring teachers, modern classrooms, and hands-on activities help children grow into confident, creative thinkers.",
    am: "እያንዳንዱ ልጅ የብሩህነት ብልጭታ እንዳለው እናምናለን። አሳቢ መምህራኖቻችን፣ ዘመናዊ ክፍሎቻችን እና ተግባራዊ ክንውኖቻችን ልጆች በራስ የሚተማመኑ ፈጠራዊ አሳቢዎች እንዲሆኑ ይረዳቸዋል።",
  },
  "about.stat1": { en: "Years of Excellence", am: "የልቀት ዓመታት" },
  "about.stat2": { en: "Happy Students", am: "ደስተኛ ተማሪዎች" },
  "about.stat3": { en: "Caring Teachers", am: "አሳቢ መምህራን" },

  // Programs
  "programs.eyebrow": { en: "What We Offer", am: "የምናቀርባቸው" },
  "programs.title": { en: "Programs That Spark Curiosity", am: "ጉጉትን የሚያነሳሱ ፕሮግራሞች" },
  "programs.kg.title": { en: "Kindergarten", am: "መዋዕለ ህፃናት" },
  "programs.kg.desc": { en: "Ages 3–5. Play-based learning that builds early literacy and social skills.", am: "ከ3-5 ዓመት። ቀደምት ማንበብና ማህበራዊ ችሎታን የሚገነባ የጨዋታ ትምህርት።" },
  "programs.primary.title": { en: "Primary School", am: "የመጀመሪያ ደረጃ" },
  "programs.primary.desc": { en: "Grades 1–6. Strong foundations in reading, math, science, and Amharic.", am: "ከ1-6 ክፍል። በማንበብ፣ ሂሳብ፣ ሳይንስ እና አማርኛ ጠንካራ መሰረት።" },
  "programs.arts.title": { en: "Arts & Sports", am: "ጥበብና ስፖርት" },
  "programs.arts.desc": { en: "Music, painting, football and more — every child finds their passion.", am: "ሙዚቃ፣ ስዕል፣ እግር ኳስ እና ሌሎችም — እያንዳንዱ ልጅ ፍቅሩን ያገኛል።" },
  "programs.tutor.title": { en: "After-school Tutoring", am: "ከትምህርት በኋላ ድጋፍ" },
  "programs.tutor.desc": { en: "Personalized help so every learner can shine.", am: "ለእያንዳንዱ ተማሪ የተለየ ድጋፍ።" },

  // Gallery
  "gallery.eyebrow": { en: "Campus Life", am: "የካምፓስ ሕይወት" },
  "gallery.title": { en: "Moments From Our School", am: "ከትምህርት ቤታችን ቅጽበቶች" },

  // News
  "news.eyebrow": { en: "Latest Updates", am: "የቅርብ ጊዜ መረጃ" },
  "news.title": { en: "News & Events", am: "ዜና እና ዝግጅቶች" },
  "news.1.title": { en: "2017 E.C. Registration Open", am: "የ2017 ዓ.ም ምዝገባ ተጀምሯል" },
  "news.1.body": { en: "Now welcoming new KG and Grade 1 families. Limited spaces available.", am: "ለመዋዕለ ህፃናት እና 1ኛ ክፍል አዲስ ቤተሰቦችን እየተቀበልን ነው።" },
  "news.2.title": { en: "Annual Sports Day", am: "ዓመታዊ የስፖርት ቀን" },
  "news.2.body": { en: "Join us for a day full of games, prizes and family fun on campus.", am: "በካምፓሱ የተሞላ የጨዋታና የቤተሰብ መዝናኛ ቀን ይቀላቀሉን።" },
  "news.3.title": { en: "Reading Champions", am: "የንባብ ሻምፒዮኖች" },
  "news.3.body": { en: "Our Grade 4 students completed 1,000 books this term — bravo!", am: "የ4ኛ ክፍል ተማሪዎቻችን በዚህ ሰሚስተር 1,000 መጻሕፍት አጠናቀዋል!" },

  // Contact
  "contact.eyebrow": { en: "Get In Touch", am: "ያግኙን" },
  "contact.title": { en: "Visit Us or Send a Message", am: "ይጎብኙን ወይም መልዕክት ይላኩ" },
  "contact.address.label": { en: "Address", am: "አድራሻ" },
  "contact.address.value": { en: "Gelan, Woreda 4, Lefto", am: "ገላን ወረዳ 4 ለፍቶ" },
  "contact.phone.label": { en: "Phone", am: "ስልክ" },
  "contact.hours.label": { en: "School Hours", am: "የትምህርት ሰዓት" },
  "contact.hours.value": { en: "Mon – Fri, 8:00 AM – 4:00 PM", am: "ሰኞ – አርብ፣ 2:00 – 10:00 ሰዓት" },
  "contact.form.name": { en: "Your Name", am: "ስምዎ" },
  "contact.form.email": { en: "Email", am: "ኢሜይል" },
  "contact.form.message": { en: "Message", am: "መልዕክት" },
  "contact.form.send": { en: "Send Message", am: "መልዕክት ላክ" },
  "contact.form.success": { en: "Thanks! We'll be in touch soon.", am: "እናመሰግናለን! በቅርቡ እንገናኛለን።" },

  // Footer
  "footer.tagline": { en: "Center of Wisdom", am: "የጥበብ ማዕከል" },
  "footer.rights": { en: "All rights reserved.", am: "መብቱ የተጠበቀ ነው።" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (key: string) => string;
}

const I18nContext = createContext<I18nCtx | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const tr = (key: string) => t[key]?.[lang] ?? key;
  return <I18nContext.Provider value={{ lang, setLang, tr }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
};
