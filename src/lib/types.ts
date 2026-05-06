export type Money = {
  currency: 'USD' | 'MXN' | 'COP'
  amount: number
}

export type ProductCategory =
  | 'Creatina'
  | 'Proteína'
  | 'Pre-entreno'
  | 'Vitaminas'
  | 'Aminoácidos'
  | 'Accesorios'

export type Product = {
  id: string
  name: string
  category: ProductCategory
  price: Money
  promo?: { label: string; percentOff: number }
  memberOnlyPromo?: { label: string; percentOff: number }
  imageSrc: string
  shortDescription: string
  longDescription: string
  available: boolean
}

export type MembershipPlan = {
  id: 'mensual'
  name: 'Mensual'
  price: Money
  days: number
}

export type MemberAccount = {
  id: string
  fullName: string
  username: string
  password: string
  role?: 'member' | 'admin'
  profile?: {
    showInCommunity: boolean
    about?: string
    goal?: string
    photoDataUrl?: string
    phone?: string
    social?: string
    optionalInfo?: string
    visibility?: {
      photo: boolean
      phone: boolean
      social: boolean
      optionalInfo: boolean
    }
  }
  membership: {
    planId: MembershipPlan['id']
    expiresAtIso: string
    lastPaymentAtIso?: string
  }
}

export type CartItem = { productId: string; qty: number }

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAtIso: string
}

