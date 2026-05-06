import type { CartItem } from '../lib/types'
import { readJson, writeJson } from '../lib/storage'

const LS_CART = 'bhg_cart_v1'

export function readCart(): CartItem[] {
  return readJson<CartItem[]>(LS_CART, [])
}

export function writeCart(items: CartItem[]) {
  writeJson(LS_CART, items)
}

export function addToCart(productId: string, qty = 1) {
  const items = readCart()
  const idx = items.findIndex((i) => i.productId === productId)
  if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty }
  else items.push({ productId, qty })
  writeCart(items)
  return readCart()
}

export function removeFromCart(productId: string) {
  const items = readCart().filter((i) => i.productId !== productId)
  writeCart(items)
  return items
}

export function clearCart() {
  writeCart([])
}

