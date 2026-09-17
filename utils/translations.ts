export const translations = {
  en: {
    "nav.schedule": "Schedule",
    "nav.stats": "Stats",
    "nav.news": "News",
    "hero.line1": "Your schedule, your sessions —",
    "hero.line2": "one place",
  },
  es: {
    "nav.schedule": "Horario",
    "nav.stats": "Estadísticas",
    "nav.news": "Noticias",
    "hero.line1": "Tu agenda, tus sesiones —",
    "hero.line2": "en un solo lugar",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["en"];
