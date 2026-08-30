import { getSheetRows, rowsToKeyValue } from "./sheets";

/** Nombres exactos de las hojas (tabs) dentro del Google Sheet. */
const SHEET_TABS = {
  churchInfo: "DatosIglesia",
  ministerios: "Ministerios",
  reuniones: "Reuniones",
  reunionesEspeciales: "ReunionesEspeciales",
  equipoPastoral: "EquipoPastoral",
  ofrendas: "Ofrendas",
  ofrendasCategorias: "OfrendasCategorias",
  programacionRadio: "ProgramacionRadio",
  primeraVez: "PrimeraVez",
} as const;

export type Ministry = {
  slug: string;
  name: string;
  tagline: string;
  schedule: string;
  scheduleNote?: string;
  description: string;
  longDescription: string[];
  audience: string;
  category: "life-stage" | "formation" | "community" | "serve";
  location: "auditorium" | "homes" | "community";
  locationLabel?: string;
  joinLabel: string;
  contactTopic: string;
  highlights: string[];
  acceptingMembers: boolean;
  featured: boolean;
  featuredOrder?: number;
  color: string;
  icon: string;
  image: string;
  image2?: string;
  subMinistry?: {
    name: string;
    schedule: string;
    description: string;
    image?: string;
  };
  isOutreach?: boolean;
};

type MinistryText = Omit<Ministry, "color" | "icon" | "image" | "image2">;

/** Orden y slugs fijos de los ministerios (no editables desde la hoja). */
export const ministrySlugs = [
  "avivamiento-jovenes",
  "anos-dorados",
  "ibe",
  "escuela-de-vida",
  "escuela-biblica",
  "avivamiento-en-las-calles",
  "gdi",
] as const;

/** Imágenes, colores e íconos: se administran en el código, no desde la hoja. */
const ministryMeta: Record<
  string,
  { color: string; icon: string; image: string; image2?: string; subMinistryImage?: string }
> = {
  "avivamiento-jovenes": {
    color: "from-brand to-brand-dark",
    icon: "flame",
    image: "/images/ministries/avivamiento-jovenes-1.jpg",
    image2: "/images/ministries/avivamiento-jovenes-2.jpg",
  },
  "anos-dorados": {
    color: "from-gold to-gold-dark",
    icon: "sun",
    image: "/images/ministries/anos-dorados-1.jpg",
    image2: "/images/ministries/anos-dorados-2.jpg",
  },
  ibe: {
    color: "from-slate-500 to-slate-800",
    icon: "book",
    image: "/images/ministries/ibe.jpg",
  },
  "escuela-de-vida": {
    color: "from-brand-dark to-brand",
    icon: "seedling",
    image: "/images/ministries/escuela-de-vida.jpg",
  },
  "escuela-biblica": {
    color: "from-brand-light to-brand",
    icon: "star",
    image: "/images/ministries/escuela-biblica.jpg",
  },
  "avivamiento-en-las-calles": {
    color: "from-brand to-brand-dark",
    icon: "megaphone",
    image: "/images/ministries/avivamiento-en-las-calles-1.jpg",
    image2: "/images/ministries/avivamiento-en-las-calles-2.jpg",
    subMinistryImage: "/images/ministries/buen-samaritano.jpg",
  },
  gdi: {
    color: "from-slate-600 to-slate-800",
    icon: "users",
    image: "/images/ministries/gdi.jpg",
  },
};

const defaultMinistries: MinistryText[] = [
  {
    slug: "avivamiento-jovenes",
    name: "Avivamiento Jóvenes",
    tagline: "Una generación que arde por Dios",
    schedule: "Sábados 20:30 h",
    description:
      "El ministerio de jóvenes de la iglesia: alabanza, palabra y comunidad para vivir una fe real.",
    longDescription: [
      "Avivamiento Jóvenes es el espacio donde adolescentes y jóvenes se encuentran cada semana para adorar, aprender de la Palabra y construir amistades que perduran.",
      "Cada sábado vivimos una noche de alabanza en vivo, prédica relevante para la vida real y momentos de oración en comunidad. Es un ambiente moderno, cercano y sin prejuicios: venís como estás.",
      "Además de la reunión semanal, organizamos retiros, campamentos, noches temáticas y actividades de servicio para que cada joven descubra su propósito.",
    ],
    audience: "Jóvenes y adolescentes",
    category: "life-stage",
    location: "auditorium",
    joinLabel: "Quiero sumarme a Jóvenes",
    contactTopic: "Ministerios o GDI",
    highlights: ["Alabanza", "Palabra práctica", "Comunidad", "Actividades durante el año"],
    acceptingMembers: true,
    featured: true,
    featuredOrder: 2,
    subMinistry: {
      name: "Avivamiento Adolescente",
      schedule: "Domingos 18:00 h",
      description:
        "Un espacio propio dentro de Jóvenes, pensado exclusivamente para adolescentes, para crecer en la fe entre pares, con dinámicas, alabanza y una palabra adaptada a esta etapa de la vida.",
    },
  },
  {
    slug: "anos-dorados",
    name: "Años Dorados",
    tagline: "Sabiduría y fe que inspiran generaciones",
    schedule: "Viernes cada 15 días · 18:30 h",
    scheduleNote:
      "Al reunirse de forma quincenal, te recomendamos contactarte con nosotros para confirmar la próxima fecha.",
    description:
      "El ministerio de nuestros hermanos mayores: un espacio de comunión, cuidado y palabra para la tercera edad.",
    longDescription: [
      "Años Dorados es el ministerio dedicado a los hermanos y hermanas mayores de nuestra iglesia. Un espacio de encuentro, contención y comunión donde la experiencia y la fe de toda una vida se comparten en comunidad.",
      "Nos reunimos de forma quincenal para pasar una tarde juntos: alabanza, la Palabra, testimonios y mucho compañerismo.",
      "Si sos parte de este hermoso grupo o querés invitar a un familiar, contactanos para confirmar la fecha del próximo encuentro.",
    ],
    audience: "Adultos mayores",
    category: "life-stage",
    location: "auditorium",
    joinLabel: "Quiero conocer Años Dorados",
    contactTopic: "Ministerios o GDI",
    highlights: ["Comunión", "Palabra", "Testimonios", "Compañerismo"],
    acceptingMembers: true,
    featured: false,
  },
  {
    slug: "ibe",
    name: "I.B.E. — Instituto Bíblico Externo",
    tagline: "Formación teológica seria, cerca de casa",
    schedule: "Clases presenciales — consultar días",
    description:
      "Extensión oficial del I.B.R.P. (Instituto Bíblico Río de la Plata) dentro de nuestra iglesia, con menor carga horaria.",
    longDescription: [
      "El I.B.E. es una extensión oficial del Instituto Bíblico Río de la Plata (I.B.R.P.), reconocida institución de formación teológica de la U.A.D. con amplia trayectoria en Argentina.",
      "Funciona de manera presencial en nuestro auditorio, con una carga horaria reducida respecto a la sede central, pensada para quienes quieren formarse en las Escrituras sin dejar de lado su vida cotidiana.",
      "Es el camino ideal para quienes sienten un llamado a servir con mayor profundidad doctrinal y ministerial, con materias, docentes y un plan de estudios oficial.",
    ],
    audience: "Jóvenes y adultos con llamado ministerial",
    category: "formation",
    location: "auditorium",
    joinLabel: "Quiero consultar por I.B.E.",
    contactTopic: "Ministerios o GDI",
    highlights: ["Formación teológica", "Clases presenciales", "Plan oficial", "Docentes preparados"],
    acceptingMembers: true,
    featured: false,
  },
  {
    slug: "escuela-de-vida",
    name: "Escuela de Vida",
    tagline: "Los primeros pasos del cristiano",
    schedule: "Lunes 19:00 h",
    description:
      "Nuestra escuela interna para nuevos creyentes: los fundamentos de la vida cristiana en un ambiente cercano.",
    longDescription: [
      "Escuela de Vida es la escuela propia de nuestra iglesia, pensada para todo aquel que está dando sus primeros pasos en la fe.",
      "A diferencia del I.B.E., no es un instituto oficial: es un espacio más de contención y acompañamiento que de estudio académico, donde enseñamos de forma clara y práctica los principios y doctrinas básicas de la vida cristiana.",
      "Ideal si te acercaste hace poco a la iglesia y querés entender qué creemos y por qué, en un ambiente cálido y sin tecnicismos.",
    ],
    audience: "Nuevos creyentes",
    category: "formation",
    location: "auditorium",
    joinLabel: "Quiero conocer Escuela de Vida",
    contactTopic: "Ministerios o GDI",
    highlights: ["Fundamentos de fe", "Acompañamiento", "Enseñanza práctica", "Primeros pasos"],
    acceptingMembers: true,
    featured: false,
  },
  {
    slug: "escuela-biblica",
    name: "Escuela Bíblica",
    tagline: "Sembrando la Palabra desde pequeños",
    schedule: "Sábados 10:30 h",
    description:
      "Nuestra 'escuela dominical': el ministerio de niños y preadolescentes de la iglesia.",
    longDescription: [
      "La Escuela Bíblica es el ministerio dedicado a los más chicos de la casa: niños y preadolescentes que cada semana aprenden de la Palabra de Dios a través de historias, juegos, música y mucha diversión.",
      "Contamos con maestros capacitados y un ambiente seguro y alegre, pensado para que cada niño descubra el amor de Dios desde temprana edad.",
      "Cada clase está organizada por edades, con materiales didácticos propios y actividades especiales durante el año.",
    ],
    audience: "Niños y preadolescentes",
    category: "life-stage",
    location: "auditorium",
    joinLabel: "Quiero conocer Escuela Bíblica",
    contactTopic: "Ministerios o GDI",
    highlights: ["Maestros capacitados", "Aprendizaje bíblico", "Actividades", "Espacio seguro"],
    acceptingMembers: true,
    featured: true,
    featuredOrder: 1,
  },
  {
    slug: "avivamiento-en-las-calles",
    name: "Avivamiento en las Calles",
    tagline: "La iglesia en movimiento",
    schedule: "Salidas evangelísticas periódicas",
    description:
      "Nuestro equipo de evangelismo que lleva la Palabra de Dios y una mano solidaria a las calles de nuestra ciudad.",
    longDescription: [
      "Avivamiento en las Calles es el equipo de evangelismo de nuestra iglesia. Salimos a las calles del barrio y de la ciudad para predicar el evangelio, orar por las personas y ser una mano de ayuda concreta para quien lo necesite.",
      "Esta sección no busca sumar nuevos integrantes al equipo, sino mostrar el trabajo que realizamos puertas afuera del templo: creemos que la fe se vive también sirviendo a la comunidad.",
      "Dentro de este equipo funciona 'El Buen Samaritano', dedicado a la asistencia social.",
    ],
    audience: "Trabajo comunitario y evangelístico",
    category: "serve",
    location: "community",
    joinLabel: "Conocé cómo colaborar",
    contactTopic: "Fundación o colaboración",
    highlights: ["Evangelismo", "Oración", "Ayuda concreta", "El Buen Samaritano"],
    acceptingMembers: false,
    featured: false,
    isOutreach: true,
    subMinistry: {
      name: "El Buen Samaritano",
      schedule: "Jornadas solidarias periódicas",
      description:
        "Dedicado a repartir comida, ropa y elementos de primera necesidad entre las personas en situación de calle, llevando ayuda concreta junto con la Palabra de Dios.",
    },
  },
  {
    slug: "gdi",
    name: "GDI — Grupos de Integración",
    tagline: "Iglesia en cada casa, familia en cada célula",
    schedule: "Miércoles 19:30 h",
    description:
      "Nuestros grupos celulares: espacios pequeños de contención, estudio de la Palabra y comunidad real.",
    longDescription: [
      "Los GDI (Grupos de Integración) son nuestras células: pequeños grupos que se reúnen durante la semana en distintos hogares, guiados por un líder que comparte la Palabra y acompaña a cada integrante.",
      "Están organizados por edad y sexo para generar un ambiente de mayor confianza y contención, donde cada persona puede ser conocida, acompañada y llamada por su nombre.",
      "Los GDI también son considerados parte de las reuniones generales de la iglesia. Si querés sumarte a una célula cerca de tu casa, contactanos y te conectamos con un grupo.",
    ],
    audience: "Toda la congregación, por edad y sexo",
    category: "community",
    location: "homes",
    joinLabel: "Encontrá un GDI",
    contactTopic: "Ministerios o GDI",
    highlights: ["Grupos pequeños", "Palabra", "Contención", "Comunidad"],
    acceptingMembers: true,
    featured: true,
    featuredOrder: 3,
  },
];

function rowToMinistry(row: Record<string, string>): MinistryText {
  const longDescription = [row.longDescription1, row.longDescription2, row.longDescription3]
    .map((s) => s?.trim())
    .filter((s): s is string => Boolean(s));
  const fallback = defaultMinistries.find((ministry) => ministry.slug === row.slug);

  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    schedule: row.schedule,
    scheduleNote: row.scheduleNote || undefined,
    description: row.description,
    longDescription: longDescription.length > 0 ? longDescription : [row.description],
    audience: row.audience,
    category: isMinistryCategory(row.category) ? row.category : fallback?.category ?? categoryForSlug(row.slug),
    location: isMinistryLocation(row.location) ? row.location : fallback?.location ?? locationForSlug(row.slug),
    locationLabel: row.locationLabel || undefined,
    joinLabel: row.joinLabel || fallback?.joinLabel || joinLabelForSlug(row.slug),
    contactTopic: row.contactTopic || fallback?.contactTopic || "Ministerios o GDI",
    highlights: row.highlights
      ? row.highlights.split("|").map((highlight) => highlight.trim()).filter(Boolean)
      : highlightsForSlug(row.slug),
    acceptingMembers: row.acceptingMembers?.trim()
      ? row.acceptingMembers.trim().toUpperCase() === "TRUE"
      : fallback?.acceptingMembers ?? row.slug !== "avivamiento-en-las-calles",
    featured: row.featured?.trim()
      ? row.featured.trim().toUpperCase() === "TRUE"
      : fallback?.featured ?? false,
    featuredOrder: Number(row.featuredOrder) || fallback?.featuredOrder,
    isOutreach: row.isOutreach?.trim().toUpperCase() === "TRUE",
    subMinistry: row.subMinistryName
      ? {
          name: row.subMinistryName,
          schedule: row.subMinistrySchedule ?? "",
          description: row.subMinistryDescription ?? "",
        }
      : undefined,
  };
}

function isMinistryCategory(value: string | undefined): value is Ministry["category"] {
  return value === "life-stage" || value === "formation" || value === "community" || value === "serve";
}

function isMinistryLocation(value: string | undefined): value is Ministry["location"] {
  return value === "auditorium" || value === "homes" || value === "community";
}

function categoryForSlug(slug: string): Ministry["category"] {
  if (slug === "ibe" || slug === "escuela-de-vida") return "formation";
  if (slug === "gdi") return "community";
  if (slug === "avivamiento-en-las-calles") return "serve";
  return "life-stage";
}

function locationForSlug(slug: string): Ministry["location"] {
  if (slug === "gdi") return "homes";
  if (slug === "avivamiento-en-las-calles") return "community";
  return "auditorium";
}

function joinLabelForSlug(slug: string) {
  if (slug === "gdi") return "Encontrá un GDI";
  if (slug === "avivamiento-en-las-calles") return "Conocé cómo colaborar";
  return "Quiero sumarme";
}

function highlightsForSlug(slug: string) {
  return defaultMinistries.find((ministry) => ministry.slug === slug)?.highlights ?? [];
}

/** Trae los ministerios: usa la hoja "Ministerios" si tiene filas, si no el contenido por defecto. */
export async function getMinistries(): Promise<Ministry[]> {
  const rows = await getSheetRows(SHEET_TABS.ministerios);
  const list = rows.length > 0 ? rows.map(rowToMinistry) : defaultMinistries;

  return list
    .filter((m) => ministryMeta[m.slug])
    .map((m) => {
      const meta = ministryMeta[m.slug];
      return {
        ...m,
        ...meta,
        subMinistry: m.subMinistry
          ? { ...m.subMinistry, image: meta.subMinistryImage }
          : undefined,
      };
    });
}

export async function getMinistryBySlug(slug: string): Promise<Ministry | undefined> {
  const all = await getMinistries();
  return all.find((m) => m.slug === slug);
}

export type ServiceAudience = "all" | "children" | "teens" | "youth" | "formation" | "service";

export type GeneralService = {
  day: string;
  time: string;
  label: string;
  isPublic: boolean;
  audience: ServiceAudience;
  streamed?: boolean;
  location?: "auditorium" | "homes";
  locationLabel?: string;
  calendarEnabled?: boolean;
  calendarTitle?: string;
  calendarDurationMinutes?: number;
};

const defaultGeneralServices: GeneralService[] = [
  { day: "Martes", time: "20:00 h", label: "Reunión general", isPublic: true, audience: "all" },
  { day: "Miércoles", time: "19:30 h", label: "GDI — Grupos de Integración", isPublic: true, audience: "all", location: "homes" },
  { day: "Sábados", time: "10:30 h", label: "Escuela Bíblica (niños)", isPublic: false, audience: "children" },
  { day: "Sábados", time: "19:00 h", label: "Reunión general", isPublic: true, audience: "all" },
  { day: "Sábados", time: "20:30 h", label: "Avivamiento Jóvenes", isPublic: false, audience: "youth" },
  { day: "Domingos", time: "10:30 h", label: "Reunión general", isPublic: true, audience: "all" },
  { day: "Domingos", time: "18:00 h", label: "Avivamiento Adolescente", isPublic: false, audience: "teens" },
  { day: "Domingos", time: "19:30 h", label: "Reunión general", isPublic: true, audience: "all", streamed: true },
];

export async function getGeneralServices(): Promise<GeneralService[]> {
  const rows = await getSheetRows(SHEET_TABS.reuniones);
  if (rows.length === 0) return defaultGeneralServices;
  return rows.map((r) => ({
    day: r.day,
    time: r.time,
    label: r.label,
    isPublic: r.isPublic?.trim()
      ? r.isPublic.trim().toUpperCase() === "TRUE"
      : isPublicGeneralService(r.label),
    audience: parseServiceAudience(r.audience) ?? inferServiceAudience(r.label),
    streamed: r.streamed?.trim().toUpperCase() === "TRUE",
    location: r.location?.trim().toLowerCase() === "homes" ? "homes" : "auditorium",
    locationLabel: r.locationLabel || undefined,
    calendarEnabled: r.calendarEnabled?.trim().toUpperCase() !== "FALSE",
    calendarTitle: r.calendarTitle || undefined,
    calendarDurationMinutes: Number(r.calendarDurationMinutes) || undefined,
  }));
}

export type SpecialService = {
  name: string;
  schedule: string;
  description: string;
  isPublic: boolean;
  streamed?: boolean;
  recurrence: "first-day" | "first-sunday";
  time?: string;
  location?: "auditorium" | "homes";
  locationLabel?: string;
  calendarEnabled?: boolean;
  calendarTitle?: string;
  calendarDurationMinutes?: number;
  nextDate?: string;
  nextTime?: string;
  nextStreamed?: boolean;
  nextNote?: string;
  featureOnHome: boolean;
  featureTitle?: string;
  featureDate?: string;
  featureAudience?: string;
  featureCtaLabel?: string;
  featureCtaUrl?: string;
};

const defaultSpecialServices: SpecialService[] = [
  {
    name: "Noche de Unción",
    schedule: "Día 1 de cada mes",
    description:
      "Una reunión especial para ungir con aceite, orar por milagros y buscar juntos la presencia de Dios.",
    isPublic: true,
    streamed: true,
    recurrence: "first-day",
    calendarEnabled: true,
    featureOnHome: false,
  },
  {
    name: "Santa Cena",
    schedule: "Primer domingo de cada mes",
    description:
      "Dentro del culto dominical conmemoramos la cena del Señor como iglesia, recordando el sacrificio de Jesús.",
    isPublic: true,
    streamed: true,
    recurrence: "first-sunday",
    calendarEnabled: true,
    featureOnHome: false,
  },
];

export async function getSpecialServices(): Promise<SpecialService[]> {
  const rows = await getSheetRows(SHEET_TABS.reunionesEspeciales);
  if (rows.length === 0) return defaultSpecialServices;
  return rows.map((r) => ({
    name: r.name,
    schedule: r.schedule,
    description: r.description,
    isPublic: r.isPublic?.trim() ? r.isPublic.trim().toUpperCase() === "TRUE" : true,
    streamed: r.streamed?.trim().toUpperCase() === "TRUE",
    recurrence: r.recurrence?.trim() === "first-sunday" || r.name === "Santa Cena" ? "first-sunday" : "first-day",
    time: r.time || undefined,
    location: r.location?.trim().toLowerCase() === "homes" ? "homes" : "auditorium",
    locationLabel: r.locationLabel || undefined,
    calendarEnabled: r.calendarEnabled?.trim().toUpperCase() !== "FALSE",
    calendarTitle: r.calendarTitle || undefined,
    calendarDurationMinutes: Number(r.calendarDurationMinutes) || undefined,
    nextDate: r.nextDate?.trim() || undefined,
    nextTime: r.nextTime?.trim() || undefined,
    nextStreamed: r.nextStreamed?.trim()
      ? r.nextStreamed.trim().toUpperCase() === "TRUE"
      : undefined,
    nextNote: r.nextNote?.trim() || undefined,
    featureOnHome: r.featureOnHome?.trim().toUpperCase() === "TRUE",
    featureTitle: r.featureTitle?.trim() || undefined,
    featureDate: r.featureDate?.trim() || undefined,
    featureAudience: r.featureAudience?.trim() || undefined,
    featureCtaLabel: r.featureCtaLabel?.trim() || undefined,
    featureCtaUrl: r.featureCtaUrl?.trim() || undefined,
  }));
}

function isPublicGeneralService(label: string) {
  const normalizedLabel = label.trim().toLocaleLowerCase("es-AR");
  return normalizedLabel.includes("reunión general") || normalizedLabel.includes("gdi");
}

function parseServiceAudience(value?: string): ServiceAudience | undefined {
  const audience = value?.trim().toLowerCase();
  return audience === "all" || audience === "children" || audience === "teens" || audience === "youth" || audience === "formation" || audience === "service"
    ? audience
    : undefined;
}

function inferServiceAudience(label: string): ServiceAudience {
  const normalizedLabel = label.trim().toLocaleLowerCase("es-AR");
  if (normalizedLabel.includes("niño") || normalizedLabel.includes("escuela bíblica")) return "children";
  if (normalizedLabel.includes("adolesc")) return "teens";
  if (normalizedLabel.includes("joven")) return "youth";
  if (normalizedLabel.includes("ibe") || normalizedLabel.includes("escuela de vida")) return "formation";
  if (normalizedLabel.includes("calle") || normalizedLabel.includes("solidari")) return "service";
  return "all";
}

export const transmissionInfo = {
  title: "Transmisión por YouTube",
  liveLabel: "Estamos en vivo ahora",
  latestLabel: "Última reunión en vivo",
  unavailableLabel: "Canal de YouTube",
  description:
    "Transmitimos reuniones generales, Noche de Unción, Santa Cena y encuentros especiales que pueden surgir durante la semana.",
};

/** Rutas de logos e IDs técnicos: no se editan desde la hoja. */
const churchTechnical = {
  logoLight: "/logo/logo-blanco.png",
  logoDark: "/logo/logo-negro.png",
  logoColor: "/logo/logo-color.png",
  radioStreamUrl: "https://stream.example.com/radio-manantial.mp3",
  // Completá el ID del canal (empieza con "UC...") en YouTube Studio → Configuración →
  // Canal → Configuración avanzada, para activar el embed en vivo automático.
  youtubeChannelId: "UCBsH_17YGsnfglxEm0Z96Xw",
};

/** Evita usar/mostrar celdas rotas del Sheet (fórmulas con error, texto suelto, etc). */
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const defaultChurchText = {
  name: "Ministerio Manantial de Avivamiento",
  shortName: "Manantial de Avivamiento",
  auditoriumName: "Auditorio Manantial de Avivamiento",
  historicNote: 'Conocido en el barrio de Lugano como el "Ex Cine Progreso"',
  address: "Av. Riestra 5651, Villa Lugano, Ciudad Autónoma de Buenos Aires",
  mapsQuery: "Av. Riestra 5651, Villa Lugano, CABA",
  phone: "+54 11 2799-4682",
  email: "-",
  radioName: "Radio Maranata",
  liveServiceSchedule: "Domingos 19:30 h",
  instagram: "https://www.instagram.com/manantialavivamiento/",
  youtube: "https://www.youtube.com/@ManantialdeAvivamiento",
  facebook: "https://www.facebook.com/mavivamiento",
  tiktok: "https://www.tiktok.com/@manantialavivamiento",
  whatsappChannelUrl: "https://whatsapp.com/channel/0029VaakItABqbr5DFewW12c",
  prayerIntro:
    "¿Necesitás que oremos por vos o por tu familia? Escribinos o llamanos, con toda confianza.",
  prayerMobile: "+54 9 11 2799-4682",
  prayerLandline: "-",
  prayerWhatsappLink: "https://wa.me/5491127994682",
  historyTitle: "Del cine de barrio a casa de fe",
  historyText:
    "Durante años, este edificio reunió vecinos para compartir historias. Hoy sigue siendo un lugar de encuentro: una casa de fe, comunidad y esperanza para Villa Lugano.",
  vision: "Alcanzar cada generación con el amor y la Palabra de Dios.",
  mission: "Formar discípulos a través de la adoración, la enseñanza, la comunidad y el servicio.",
  values: "Fe genuina | Familia | Servicio | Excelencia | Comunidad",
  communityStatement:
    "Una fe que se vive en comunidad, sirviendo a las personas y al barrio que nos rodea.",
  firstVisitIntro:
    "Te contamos lo esencial para llegar tranquilo: horarios, ubicación y qué vas a encontrar al entrar.",
  firstVisitArrivalTitle: "Cuando llegues",
  firstVisitArrivalStep1: "Te recibimos en la entrada.",
  firstVisitArrivalStep2: "Te ayudamos a encontrar lugar.",
  firstVisitArrivalStep3: "Podés participar a tu ritmo.",
  firstVisitWhatsappMessage: "Hola, es mi primera vez y tengo una consulta antes de visitar.",
  homeHeroKicker: "Manantial de Avivamiento",
  homeHeroTitle: "Una comunidad de fe en Villa Lugano.",
  homeHeroText:
    "Un ministerio cristiano evangélico en el histórico Ex Cine Progreso. Reuniones, comunidad y acompañamiento espiritual para toda la familia.",
  homeWelcomeTitle: "Una comunidad para crecer acompañado",
  homeWelcomeText: "Un espacio para venir como estás, conocer personas y crecer acompañado.",
  homeStats1Value: "7",
  homeStats1Label: "Áreas ministeriales",
  homeStats2Value: "24/7",
  homeStats2Label: "Radio en vivo",
  homeStats3Value: "+25",
  homeStats3Label: "Años",
  homeStats4Value: "1",
  homeStats4Label: "Comunidad",
};

export type ChurchInfo = Awaited<ReturnType<typeof getChurchInfo>>;

export async function getChurchInfo() {
  const rows = await getSheetRows(SHEET_TABS.churchInfo);
  const kv = rowsToKeyValue(rows);
  const t = (key: keyof typeof defaultChurchText) => kv[key] || defaultChurchText[key];

  return {
    ...churchTechnical,
    name: t("name"),
    shortName: t("shortName"),
    auditoriumName: t("auditoriumName"),
    historicNote: t("historicNote"),
    address: t("address"),
    mapsQuery: t("mapsQuery"),
    phone: t("phone"),
    email: isValidEmail(t("email")) ? t("email").trim() : "-",
    radioName: t("radioName"),
    liveServiceSchedule: t("liveServiceSchedule"),
    social: {
      instagram: t("instagram"),
      youtube: t("youtube"),
      facebook: t("facebook"),
      tiktok: t("tiktok"),
    },
    whatsappChannelUrl: t("whatsappChannelUrl"),
    about: {
      historyTitle: t("historyTitle"),
      historyText: t("historyText"),
      vision: t("vision"),
      mission: t("mission"),
      values: t("values").split("|").map((value) => value.trim()).filter(Boolean),
      communityStatement: t("communityStatement"),
    },
    firstVisit: {
      intro: t("firstVisitIntro"),
      arrivalTitle: t("firstVisitArrivalTitle"),
      arrivalSteps: [t("firstVisitArrivalStep1"), t("firstVisitArrivalStep2"), t("firstVisitArrivalStep3")],
      whatsappMessage: t("firstVisitWhatsappMessage"),
    },
    home: {
      heroKicker: t("homeHeroKicker"),
      heroTitle: t("homeHeroTitle"),
      heroText: t("homeHeroText"),
      welcomeTitle: t("homeWelcomeTitle"),
      welcomeText: t("homeWelcomeText"),
      stats: [
        [t("homeStats1Value"), t("homeStats1Label")],
        [t("homeStats2Value"), t("homeStats2Label")],
        [t("homeStats3Value"), t("homeStats3Label")],
        [t("homeStats4Value"), t("homeStats4Label")],
      ],
    },
    prayerRequest: {
      intro: t("prayerIntro"),
      mobile: t("prayerMobile"),
      landline: t("prayerLandline"),
      whatsappLink: t("prayerWhatsappLink"),
    },
  };
}

export type PastoralMember = {
  displayName: string;
  role: string;
  image?: string;
  order?: number;
};

const defaultPastoralTeam: PastoralMember[] = [
  { displayName: "Silvana Zagari", role: "Pastora principal" },
  { displayName: "Iván González y Damaris Álvarez", role: "Equipo pastoral" },
  { displayName: "Alejandro Martínez y Claudia Martínez", role: "Equipo pastoral" },
  { displayName: "Matías Martínez y Abigail Álvarez", role: "Equipo pastoral" },
  { displayName: "Mathias Díaz y Lorena Villalba", role: "Equipo pastoral" },
  { displayName: "Samuel Arroyo y Leticia Arroyo", role: "Equipo pastoral" },
  { displayName: "Orlando Flores", role: "Evangelista" },
];

export async function getPastoralTeam(): Promise<PastoralMember[]> {
  const rows = await getSheetRows(SHEET_TABS.equipoPastoral);
  if (rows.length === 0) return defaultPastoralTeam;
  return rows
    .map((r, index) => ({
      displayName: r.displayName,
      role: r.role,
      order: Number(r.order) || index + 1,
    }))
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

export type FirstVisitItem = {
  title: string;
  text: string;
  order: number;
};

const defaultFirstVisitItems: FirstVisitItem[] = [
  {
    title: "¿Voy a estar solo?",
    text: "Nuestro equipo de bienvenida te va a recibir en la entrada, y con gusto te acompaña a un lugar y responde cualquier duda.",
    order: 1,
  },
  {
    title: "¿Y si no creo en nada de esto?",
    text: "No hay problema. Vení a observar, a escuchar, a hacer preguntas. Nadie te va a obligar a nada: la puerta está abierta para vos tal cual estás.",
    order: 2,
  },
  {
    title: "¿Cómo me visto?",
    text: "Como quieras. Vení con la ropa que te haga sentir cómodo, no hace falta nada formal.",
    order: 3,
  },
  {
    title: "¿Venís con niños o adolescentes?",
    text: "Los más chicos tienen su propio espacio durante la reunión. Para adolescentes, también contamos con encuentros pensados para su etapa.",
    order: 4,
  },
  {
    title: "¿Cuánto dura?",
    text: "Nuestras reuniones generales duran entre una hora y media y dos horas: alabanza, palabra y un momento de oración.",
    order: 5,
  },
  {
    title: "¿Cómo llego?",
    text: "Estamos en Av. Riestra 5651, Villa Lugano, en el edificio conocido en el barrio como el Ex Cine Progreso. Hay colectivos y opciones de estacionamiento en la zona.",
    order: 6,
  },
];

export async function getFirstVisitItems(): Promise<FirstVisitItem[]> {
  const rows = await getSheetRows(SHEET_TABS.primeraVez);
  if (rows.length === 0) return defaultFirstVisitItems;

  const items = rows
    .filter((row) => row.title?.trim() && row.text?.trim())
    .map((row, index) => ({
      title: row.title.trim(),
      text: row.text.trim(),
      order: Number(row.order) || index + 1,
    }))
    .sort((left, right) => left.order - right.order);

  return items.length > 0 ? items : defaultFirstVisitItems;
}

const defaultGivingInfo = {
  intro:
    "Ofrendar es un acto de adoración y gratitud a Dios. Gracias por sembrar junto a nosotros para que el evangelio siga llegando a más vidas, dentro y fuera de nuestro auditorio.",
  verse:
    '"Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." — 2 Corintios 9:7',
  mercadoPago: {
    label: "Mercado Pago",
    link: "-",
    alias: "manan.tial.aviva",
  },
  bankTransfer: {
    bank: "Banco Nación",
    holder: "Asociación Iglesia Manantial",
    cbu: "0000003100000000123456",
    alias: "EJEMPLO.MANANTIAL",
    cuit: "30-00000000-0",
  },
  categories: [
    {
      name: "Ofrenda general",
      description: "Sostén de la obra, el auditorio y el ministerio semanal.",
    },
    {
      name: "Diezmo",
      description: "Tu diezmo fiel, con fe y gratitud.",
    },
    {
      name: "Misiones y Buen Samaritano",
      description: "Ayuda directa para personas en situación de calle y evangelismo.",
    },
  ],
};

export async function getGivingInfo() {
  const kv = rowsToKeyValue(await getSheetRows(SHEET_TABS.ofrendas));
  const categoryRows = await getSheetRows(SHEET_TABS.ofrendasCategorias);
  const categories =
    categoryRows.length > 0
      ? categoryRows.map((r) => ({ name: r.name, description: r.description }))
      : defaultGivingInfo.categories;

  return {
    intro: kv.intro || defaultGivingInfo.intro,
    verse: kv.verse || defaultGivingInfo.verse,
    mercadoPago: {
      label: "Mercado Pago",
      link: kv.mpLink || defaultGivingInfo.mercadoPago.link,
      alias: kv.mpAlias || defaultGivingInfo.mercadoPago.alias,
    },
    bankTransfer: {
      bank: kv.bankName || defaultGivingInfo.bankTransfer.bank,
      holder: kv.bankHolder || defaultGivingInfo.bankTransfer.holder,
      cbu: kv.bankCbu || defaultGivingInfo.bankTransfer.cbu,
      alias: kv.bankAlias || defaultGivingInfo.bankTransfer.alias,
      cuit: kv.bankCuit || defaultGivingInfo.bankTransfer.cuit,
    },
    categories,
  };
}

const defaultRadioSchedule = [
  { time: "06:00 – 09:00", program: "Buen Día Manantial", host: "Equipo de radio" },
  { time: "09:00 – 12:00", program: "Alabanza sin fin", host: "Automatizado" },
  { time: "12:00 – 14:00", program: "Palabra al mediodía", host: "Pastor invitado" },
  { time: "14:00 – 18:00", program: "Música para tu tarde", host: "Automatizado" },
  { time: "18:00 – 20:00", program: "Voces Jóvenes", host: "Avivamiento Jóvenes" },
  { time: "20:00 – 23:00", program: "Noche de Alabanza", host: "Equipo de radio" },
  { time: "23:00 – 06:00", program: "Adoración Nocturna", host: "Automatizado" },
];

export async function getRadioSchedule() {
  const rows = await getSheetRows(SHEET_TABS.programacionRadio);
  if (rows.length === 0) return defaultRadioSchedule;
  return rows.map((r) => ({ time: r.time, program: r.program, host: r.host }));
}

