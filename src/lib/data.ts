import type { MembershipPlan, Product } from './types'

export const GYM_NAME = 'BodyHealthGym'
const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export const MEMBERSHIP_PLANS: Record<string, MembershipPlan> = {
  mensual: {
    id: 'mensual',
    name: 'Mensual',
    price: { currency: 'COP', amount: 129000 },
    days: 30,
  },
}

export const PRODUCTS: Product[] = [
  {
    id: 'creatina-monohidratada',
    name: 'Creatina Monohidratada 300g',
    category: 'Creatina',
    price: { currency: 'COP', amount: 89000 },
    promo: { label: 'Semana Fit', percentOff: 10 },
    memberOnlyPromo: { label: 'Precio miembro', percentOff: 8 },
    imageSrc: withBase('products/creatina.svg'),
    shortDescription: 'Fuerza y rendimiento. Ideal para progresión constante.',
    longDescription:
      'Creatina monohidratada de alta pureza. Útil para mejorar fuerza y rendimiento en esfuerzos cortos e intensos. Recomendación típica: 3–5g diarios (según tolerancia), con buena hidratación.',
    available: true,
  },
  {
    id: 'whey-proteina-vainilla',
    name: 'Whey Protein Vainilla 2kg',
    category: 'Proteína',
    price: { currency: 'COP', amount: 219000 },
    promo: { label: '2×1 en envío', percentOff: 0 },
    memberOnlyPromo: { label: 'Miembro -12%', percentOff: 12 },
    imageSrc: withBase('products/whey.svg'),
    shortDescription: 'Recuperación y músculo con sabor premium.',
    longDescription:
      'Proteína whey para apoyar recuperación y síntesis muscular. Ideal si no alcanzas tu objetivo de proteína con comida. Sugerencia: 1 scoop post-entreno o según tus macros.',
    available: true,
  },
  {
    id: 'pre-entreno-pump',
    name: 'Pre-entreno Pump 30 servicios',
    category: 'Pre-entreno',
    price: { currency: 'COP', amount: 129000 },
    promo: { label: 'Energía máxima -15%', percentOff: 15 },
    memberOnlyPromo: { label: 'Miembro -5%', percentOff: 5 },
    imageSrc: withBase('products/preworkout.svg'),
    shortDescription: 'Enfoque, energía y “pump” en cada sesión.',
    longDescription:
      'Pre-entreno para energía y enfoque. Empieza con 1/2 porción para evaluar tolerancia. Evita mezclar con exceso de cafeína y no usar cerca de la hora de dormir.',
    available: true,
  },
  {
    id: 'omega-3',
    name: 'Omega-3 120 cápsulas',
    category: 'Vitaminas',
    price: { currency: 'COP', amount: 69000 },
    promo: { label: 'Salud -8%', percentOff: 8 },
    memberOnlyPromo: { label: 'Miembro -10%', percentOff: 10 },
    imageSrc: withBase('products/omega3.svg'),
    shortDescription: 'Soporte para salud cardiovascular y recuperación.',
    longDescription:
      'Omega-3 (EPA/DHA) para soporte general de salud. Útil en recuperación e inflamación. Revisa etiquetas y consulta si tienes condiciones médicas o tomas anticoagulantes.',
    available: true,
  },
  {
    id: 'bcaa-2-1-1',
    name: 'BCAA 2:1:1 300g',
    category: 'Aminoácidos',
    price: { currency: 'COP', amount: 79000 },
    promo: { label: 'Recuperación -10%', percentOff: 10 },
    memberOnlyPromo: { label: 'Miembro -6%', percentOff: 6 },
    imageSrc: withBase('products/bcaa.svg'),
    shortDescription: 'Ayuda a mantener el rendimiento en entrenos intensos.',
    longDescription:
      'BCAA 2:1:1 para soporte durante entrenamientos largos. Puede ser útil si entrenas en ayunas o con baja ingesta de proteína. Mezcla con agua y ajusta al sabor.',
    available: true,
  },
  {
    id: 'shaker-bodyhealth',
    name: 'Shaker BodyHealthGym',
    category: 'Accesorios',
    price: { currency: 'COP', amount: 25000 },
    promo: { label: 'Accesorio -20%', percentOff: 20 },
    memberOnlyPromo: { label: 'Miembro -15%', percentOff: 15 },
    imageSrc: withBase('products/shaker.svg'),
    shortDescription: 'Mezcla perfecta, práctico y resistente.',
    longDescription:
      'Shaker resistente con mezclador interno. Ideal para proteína, creatina o electrolitos. Fácil de lavar y perfecto para llevar al gimnasio.',
    available: true,
  },
]

