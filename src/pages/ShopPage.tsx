import { useMemo, useState } from 'react'
import { BadgePercent, ShoppingCart, Trash2, X } from 'lucide-react'
import { addToCart, clearCart, readCart, removeFromCart } from '../state/cart'
import { useAuth } from '../state/auth'
import { readProducts } from '../state/products'

function formatMoney(amount: number, currency: string) {
  if (currency === 'COP') return `COP $${amount.toLocaleString('es-CO')}`
  return `${currency} $${amount.toLocaleString('es-CO')}`
}

function applyPercentOff(base: number, percentOff: number) {
  return Math.round(base * (1 - percentOff / 100))
}

export function ShopPage() {
  const { member } = useAuth()
  const [cart, setCart] = useState(() => readCart())
  const [openId, setOpenId] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const products = useMemo(() => readProducts(), [])

  const cartDetails = useMemo(() => {
    const lines = cart
      .map((ci) => {
        const p = products.find((x) => x.id === ci.productId)
        if (!p) return null
        const memberOff = member ? p.memberOnlyPromo?.percentOff ?? 0 : 0
        const publicOff = p.promo?.percentOff ?? 0
        const bestOff = Math.max(memberOff, publicOff)
        const unit = bestOff ? applyPercentOff(p.price.amount, bestOff) : p.price.amount
        return { ...ci, product: p, unit, total: unit * ci.qty, bestOff }
      })
      .filter(Boolean) as Array<{
      productId: string
      qty: number
      product: (typeof products)[number]
      unit: number
      total: number
      bestOff: number
    }>

    const subtotal = lines.reduce((sum, l) => sum + l.total, 0)
    return { lines, subtotal }
  }, [cart, member, products])

  const openProduct = useMemo(() => products.find((p) => p.id === openId) ?? null, [openId, products])

  return (
    <div className="stack">
      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Tienda de suplementos</h2>
            <p className="muted">
              Creatina, proteínas y más. {member ? 'Estás viendo ofertas y promociones por ser miembro.' : 'Ves precio normal. Inicia sesión para ver promociones de miembro.'}
            </p>
          </div>
          <div className="chip">
            <ShoppingCart size={16} />
            {cart.reduce((sum, i) => sum + i.qty, 0)} item(s)
          </div>
        </div>

        <div className="grid3">
          {products.map((p) => {
            const publicOff = p.promo?.percentOff ?? 0
            const memberOff = member ? p.memberOnlyPromo?.percentOff ?? 0 : 0
            const bestOff = member ? Math.max(publicOff, memberOff) : 0
            const final = bestOff ? applyPercentOff(p.price.amount, bestOff) : p.price.amount

            return (
              <div className="card" key={p.id}>
                <div className="cardTop">
                  <button className="productThumb" type="button" onClick={() => setOpenId(p.id)} aria-label={`Ver ${p.name}`}>
                    <img className="productImg" src={p.imageSrc} alt={p.name} loading="lazy" />
                  </button>
                  <div>
                    <button className="cardTitleLink" type="button" onClick={() => setOpenId(p.id)}>
                      {p.name}
                    </button>
                    <div className="muted">{p.category} • {p.shortDescription}</div>
                    {!p.available ? <div className="badge badgeGhost">No disponible</div> : null}
                  </div>
                </div>

                <div className="promoRow">
                  {member && (p.promo || p.memberOnlyPromo) && (
                    <div className="promo">
                      <BadgePercent size={14} />
                      <span>
                        {p.promo ? p.promo.label : null}
                        {p.promo && member && p.memberOnlyPromo ? ' + ' : null}
                        {member && p.memberOnlyPromo ? p.memberOnlyPromo.label : null}
                      </span>
                    </div>
                  )}
                  {bestOff > 0 && <div className="badge">-{bestOff}%</div>}
                </div>

                <div className="cardBottom">
                  <div>
                    <div className="price">
                      {formatMoney(final, p.price.currency)}
                    </div>
                    {bestOff > 0 && (
                      <div className="muted strike">
                        {formatMoney(p.price.amount, p.price.currency)}
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <button className="btn btnGhost" type="button" onClick={() => setOpenId(p.id)}>
                      Ver
                    </button>
                    <button
                      className="btn btnPrimary"
                      type="button"
                      disabled={!p.available}
                      onClick={() => setCart(addToCart(p.id, 1))}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <button className="cartFab" type="button" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
        <ShoppingCart size={18} />
        <span>Carrito</span>
        <span className="cartFabCount">{cart.reduce((sum, i) => sum + i.qty, 0)}</span>
      </button>

      {openProduct ? (
        <div className="modalOverlay" role="dialog" aria-label={`Producto: ${openProduct.name}`}>
          <div className="modalCard">
            <div className="modalHeader">
              <div>
                <div className="modalTitle">{openProduct.name}</div>
                <div className="muted">{openProduct.category}</div>
              </div>
              <button className="iconBtn" type="button" onClick={() => setOpenId(null)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="modalBody">
              <div className="modalMedia">
                <img className="productImgLg" src={openProduct.imageSrc} alt={openProduct.name} />
              </div>
              <div className="modalInfo">
                <div className="muted">{openProduct.shortDescription}</div>
                <div className="modalDesc">{openProduct.longDescription}</div>

                <div className="divider" />

                <div className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
                  <div className="price">
                    {formatMoney(openProduct.price.amount, openProduct.price.currency)}
                  </div>
                  <button
                    className="btn btnPrimary"
                    type="button"
                    disabled={!openProduct.available}
                    onClick={() => {
                      setCart(addToCart(openProduct.id, 1))
                      setOpenId(null)
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
                {!openProduct.available ? <div className="error">Producto no disponible por ahora.</div> : null}
              </div>
            </div>
          </div>
          <button className="modalBackdropBtn" type="button" aria-label="Cerrar" onClick={() => setOpenId(null)} />
        </div>
      ) : null}

      {cartOpen ? (
        <div className="drawerOverlay" role="dialog" aria-label="Carrito">
          <button className="drawerBackdrop" type="button" aria-label="Cerrar" onClick={() => setCartOpen(false)} />
          <div className="drawer">
            <div className="drawerHeader">
              <div className="drawerTitle">Carrito</div>
              <button className="iconBtn" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="drawerBody">
              {cartDetails.lines.length === 0 ? (
                <div className="empty">Tu carrito está vacío.</div>
              ) : (
                <div className="cart">
                  {cartDetails.lines.map((l) => (
                    <div className="cartRow" key={l.productId}>
                      <div className="cartLeft">
                        <div className="productEmoji" aria-hidden="true">
                          <img className="productImgSm" src={l.product.imageSrc} alt="" loading="lazy" />
                        </div>
                        <div>
                          <div className="cardTitle">{l.product.name}</div>
                          <div className="muted">
                            Cantidad: <span className="mono">{l.qty}</span> • Unit: {formatMoney(l.unit, l.product.price.currency)}
                            {l.bestOff ? ` • -${l.bestOff}%` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="cartRight">
                        <div className="price">{formatMoney(l.total, l.product.price.currency)}</div>
                        <button className="iconBtn" type="button" aria-label="Eliminar" onClick={() => setCart(removeFromCart(l.productId))}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="cartTotal">
                    <div className="muted">Total</div>
                    <div className="price">COP ${cartDetails.subtotal.toLocaleString('es-CO')}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="drawerFooter">
              <button className="btn btnGhost" type="button" onClick={() => { clearCart(); setCart(readCart()) }}>
                Vaciar
              </button>
              <button className="btn btnPrimary" type="button" disabled={cartDetails.lines.length === 0}>
                Pagar (demo)
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

