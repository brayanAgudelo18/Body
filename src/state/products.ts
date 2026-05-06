import type { Product } from '../lib/types'
import { PRODUCTS as SEEDED_PRODUCTS } from '../lib/data'
import { readJson, uid, writeJson } from '../lib/storage'

const LS_PRODUCTS = 'bhg_products_v1'

export function seedProductsIfEmpty() {
  const existing = readJson<Product[]>(LS_PRODUCTS, [])
  if (existing.length) return
  writeJson(LS_PRODUCTS, SEEDED_PRODUCTS)
}

export function readProducts(): Product[] {
  seedProductsIfEmpty()
  return readJson<Product[]>(LS_PRODUCTS, [])
}

export function writeProducts(products: Product[]) {
  writeJson(LS_PRODUCTS, products)
}

export function upsertProduct(input: Omit<Product, 'id'> & { id?: string }): Product {
  const products = readProducts()
  const id = input.id ?? uid('p')
  const next: Product = { ...input, id }
  const idx = products.findIndex((p) => p.id === id)
  if (idx >= 0) products[idx] = next
  else products.unshift(next)
  writeProducts(products)
  return next
}

export function setProductAvailability(productId: string, available: boolean) {
  const products = readProducts()
  const idx = products.findIndex((p) => p.id === productId)
  if (idx < 0) return
  products[idx] = { ...products[idx], available }
  writeProducts(products)
}

