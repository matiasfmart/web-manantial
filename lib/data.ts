export type Ministry = {
  slug: string;
  name: string;
  tagline: string;
  schedule: string;
  scheduleNote?: string;
  description: string;
  longDescription: string[];
  audience: string;
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

export const ministries: Ministry[] = [
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
    color: "from-brand to-brand-dark",
    icon: "flame",
    image: "/images/ministries/avivamiento-jovenes-1.jpg",
    image2: "/images/ministries/avivamiento-jovenes-2.jpg",
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
    color: "from-gold to-gold-dark",
    icon: "sun",
    image: "/images/ministries/anos-dorados-1.jpg",
    image2: "/images/ministries/anos-dorados-2.jpg",
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
    color: "from-slate-500 to-slate-800",
    icon: "book",
    image: "/images/ministries/ibe.jpg",
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
    color: "from-brand-dark to-brand",
    icon: "seedling",
    image: "/images/ministries/escuela-de-vida.jpg",
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
    color: "from-brand-light to-brand",
    icon: "star",
    image: "/images/ministries/escuela-biblica.jpg",
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
    color: "from-brand to-brand-dark",
    icon: "megaphone",
    image: "/images/ministries/avivamiento-en-las-calles-1.jpg",
    image2: "/images/ministries/avivamiento-en-las-calles-2.jpg",
    isOutreach: true,
    subMinistry: {
      name: "El Buen Samaritano",
      schedule: "Jornadas solidarias periódicas",
      description:
        "Dedicado a repartir comida, ropa y elementos de primera necesidad entre las personas en situación de calle, llevando ayuda concreta junto con la Palabra de Dios.",
      image: "/images/ministries/buen-samaritano.jpg",
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
    color: "from-slate-600 to-slate-800",
    icon: "users",
    image: "/images/ministries/gdi.jpg",
  },
];

export const generalServices: {
  day: string;
  time: string;
  label: string;
  streamed?: boolean;
}[] = [
  { day: "Martes", time: "20:00 h", label: "Reunión general" },
  { day: "Miércoles", time: "19:30 h", label: "GDI — Grupos de Integración" },
  { day: "Sábados", time: "10:30 h", label: "Escuela Bíblica (niños)" },
  { day: "Sábados", time: "19:00 h", label: "Reunión general" },
  { day: "Sábados", time: "20:30 h", label: "Avivamiento Jóvenes" },
  { day: "Domingos", time: "10:30 h", label: "Reunión general" },
  { day: "Domingos", time: "18:00 h", label: "Avivamiento Adolescente" },
  { day: "Domingos", time: "19:30 h", label: "Reunión general", streamed: true },
];

export const churchInfo = {
  name: "Ministerio Manantial de Avivamiento",
  shortName: "Manantial de Avivamiento",
  auditoriumName: "Auditorio Manantial de Avivamiento",
  historicNote: 'Conocido en el barrio de Lugano como el "Ex Cine Progreso"',
  address: "Av. Riestra 5651, Villa Lugano, Ciudad Autónoma de Buenos Aires",
  mapsQuery: "Av. Riestra 5651, Villa Lugano, CABA",
  phone: "+54 11 2799-4682",
  email: "-",
  logoLight: "/logo/logo-blanco.png",
  logoDark: "/logo/logo-negro.png",
  logoColor: "/logo/logo-color.png",
  radioName: "Radio Manantial",
  radioStreamUrl: "https://stream.example.com/radio-manantial.mp3",
  // Completá el ID del canal (empieza con "UC...") en YouTube Studio → Configuración →
  // Canal → Configuración avanzada, para activar el embed en vivo automático.
  youtubeChannelId: "",
  liveServiceSchedule: "Domingos 19:30 h",
  social: {
    instagram: "https://www.instagram.com/manantialavivamiento/",
    youtube: "https://www.youtube.com/@ManantialdeAvivamiento",
    facebook: "https://www.facebook.com/mavivamiento",
    tiktok: "https://www.tiktok.com/@manantialavivamiento",
  },
  whatsappChannelUrl: "https://whatsapp.com/channel/0029VaakItABqbr5DFewW12c",
  prayerRequest: {
    intro:
      "¿Necesitás que oremos por vos o por tu familia? Escribinos o llamanos, con toda confianza.",
    mobile: "+54 9 11 2799-4682",
    landline: "-",
    whatsappLink: "https://wa.me/5491127994682",
  },
  appStore: "https://apps.apple.com/app/radio-manantial/id0000000000",
  playStore:
    "https://play.google.com/store/apps/details?id=org.iglesiamanantial.radio",
};

export type PastoralMember = {
  names: string[];
  role: string;
};

// Fotos pendientes: reemplazar los avatares con iniciales por fotos reales del equipo pastoral.
export const pastoralTeam: PastoralMember[] = [
  { names: ["Silvana Zagari"], role: "Pastora principal" },
  { names: ["Iván González", "Damaris Álvarez"], role: "Equipo pastoral" },
  { names: ["Alejandro Martínez", "Claudia Martínez"], role: "Equipo pastoral" },
  { names: ["Matías Martínez", "Abigail Álvarez"], role: "Equipo pastoral" },
  { names: ["Mathias Díaz", "Lorena Villalba"], role: "Equipo pastoral" },
  { names: ["Samuel Arroyo", "Leticia Arroyo"], role: "Equipo pastoral" },
  { names: ["Orlando Flores"], role: "Evangelista" },
];

export const givingInfo = {
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
  qrNote:
    "Escaneá el código QR desde la app de tu banco o Mercado Pago para ofrendar al instante.",
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

export const radioSchedule = [
  { time: "06:00 – 09:00", program: "Buen Día Manantial", host: "Equipo de radio" },
  { time: "09:00 – 12:00", program: "Alabanza sin fin", host: "Automatizado" },
  { time: "12:00 – 14:00", program: "Palabra al mediodía", host: "Pastor invitado" },
  { time: "14:00 – 18:00", program: "Música para tu tarde", host: "Automatizado" },
  { time: "18:00 – 20:00", program: "Voces Jóvenes", host: "Avivamiento Jóvenes" },
  { time: "20:00 – 23:00", program: "Noche de Alabanza", host: "Equipo de radio" },
  { time: "23:00 – 06:00", program: "Adoración Nocturna", host: "Automatizado" },
];
