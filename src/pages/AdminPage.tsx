import { useMemo, useState } from 'react'
import { CheckCircle2, Plus, Save, XCircle } from 'lucide-react'
import type { Product, ProductCategory } from '../lib/types'
import { readProducts, setProductAvailability, upsertProduct } from '../state/products'

const CATEGORIES: ProductCategory[] = [
  'Creatina',
  'Proteína',
  'Pre-entreno',
  'Vitaminas',
  'Aminoácidos',
  'Accesorios',
]

function moneyCop(value: string) {
  const n = Number(value.replace(/[^\d]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function AdminPage() {
  const [tick, setTick] = useState(0)
  const products = useMemo(() => {
    void tick
    return readProducts()
  }, [tick])

  const [draft, setDraft] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Creatina',
    price: { currency: 'COP', amount: 0 },
    promo: undefined,
    memberOnlyPromo: undefined,
    imageSrc: '/products/creatina.svg',
    shortDescription: '',
    longDescription: '',
    available: true,
  })

  function refresh() {
    setTick((v) => v + 1)
  }

  return (
    <div className="stack">
      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Admin</h2>
            <p className="muted">Gestiona productos: disponibilidad, precio, descripciones y crea nuevos.</p>
          </div>
          <div className="chip">Inventario</div>
        </div>

        <div className="grid2">
          <div className="card">
            <div className="cardTitle">Crear producto</div>
            <div className="grid2">
              <label className="field">
                <div className="fieldLabel">Nombre</div>
                <input className="input" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
              </label>
              <label className="field">
                <div className="fieldLabel">Categoría</div>
                <select
                  className="input"
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as ProductCategory }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid2">
              <label className="field">
                <div className="fieldLabel">Precio (COP)</div>
                <input
                  className="input"
                  value={draft.price.amount ? String(draft.price.amount) : ''}
                  onChange={(e) => setDraft((d) => ({ ...d, price: { currency: 'COP', amount: moneyCop(e.target.value) } }))}
                  placeholder="Ej: 89000"
                />
              </label>
              <label className="field">
                <div className="fieldLabel">Imagen (ruta)</div>
                <input
                  className="input"
                  value={draft.imageSrc}
                  onChange={(e) => setDraft((d) => ({ ...d, imageSrc: e.target.value }))}
                  placeholder="/products/creatina.svg"
                />
              </label>
            </div>

            <label className="field">
              <div className="fieldLabel">Descripción corta</div>
              <input
                className="input"
                value={draft.shortDescription}
                onChange={(e) => setDraft((d) => ({ ...d, shortDescription: e.target.value }))}
              />
            </label>

            <label className="field">
              <div className="fieldLabel">Descripción larga</div>
              <textarea
                className="input"
                style={{ minHeight: 110, resize: 'vertical' }}
                value={draft.longDescription}
                onChange={(e) => setDraft((d) => ({ ...d, longDescription: e.target.value }))}
              />
            </label>

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <label className="row muted" style={{ gap: 8 }}>
                <input
                  type="checkbox"
                  checked={draft.available}
                  onChange={(e) => setDraft((d) => ({ ...d, available: e.target.checked }))}
                />
                Disponible
              </label>
              <button
                className="btn btnPrimary"
                type="button"
                onClick={() => {
                  if (!draft.name.trim()) return
                  upsertProduct(draft)
                  setDraft((d) => ({ ...d, name: '', shortDescription: '', longDescription: '', price: { currency: 'COP', amount: 0 } }))
                  refresh()
                }}
              >
                <Plus size={16} /> Crear
              </button>
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">Productos ({products.length})</div>
            <div className="adminList">
              {products.map((p) => (
                <div className="adminRow" key={p.id}>
                  <div className="adminLeft">
                    <img className="adminImg" src={p.imageSrc} alt="" />
                    <div>
                      <div className="cardTitle">{p.name}</div>
                      <div className="muted">
                        {p.category} • COP ${p.price.amount.toLocaleString('es-CO')}
                      </div>
                    </div>
                  </div>
                  <div className="adminRight">
                    <button
                      className="btn btnGhost"
                      type="button"
                      onClick={() => {
                        setProductAvailability(p.id, !p.available)
                        refresh()
                      }}
                    >
                      {p.available ? (
                        <>
                          <CheckCircle2 size={16} /> Disponible
                        </>
                      ) : (
                        <>
                          <XCircle size={16} /> No disponible
                        </>
                      )}
                    </button>
                    <button
                      className="btn btnGhost"
                      type="button"
                      onClick={() => {
                        upsertProduct({ ...p, available: p.available, id: p.id })
                        refresh()
                      }}
                    >
                      <Save size={16} /> Guardar
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 ? <div className="empty">No hay productos.</div> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

