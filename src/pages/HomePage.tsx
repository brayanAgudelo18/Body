import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, MapPin, ShieldCheck, Users } from 'lucide-react'
import { MEMBERSHIP_PLANS, PRODUCTS } from '../lib/data'
import { useAuth } from '../state/auth'
import { useEffect, useState } from 'react'

export function HomePage() {
  const { member } = useAuth()
  const plan = MEMBERSHIP_PLANS.mensual
  const highlight = PRODUCTS.filter((p) => p.available).slice(0, 3)
  const [slide, setSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const slides = [
    {
      src: '/img/img1.jpg',
      alt: 'Promoción mitad de año',
    },
    {
      src: '/img/img2.jpg',
      alt: 'Promoción Fit Friend',
    },
  ]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((current) => {
        const next = (current + 1) % slides.length
        setPrevSlide(current)
        setIsTransitioning(true)
        return next
      })
    }, 5800)
    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    if (!isTransitioning) return
    const transitionTimer = window.setTimeout(() => {
      setIsTransitioning(false)
      setPrevSlide(null)
    }, 650)
    return () => window.clearTimeout(transitionTimer)
  }, [isTransitioning])

  return (
    <div className="stack">
      <section className="sfHero">
        <div className="sfSlider">
          {prevSlide !== null ? (
            <img
              className={`sfSlideImg sfSlideImgPrev ${isTransitioning ? 'isLeaving' : ''}`}
              src={slides[prevSlide].src}
              alt={slides[prevSlide].alt}
            />
          ) : null}
          <img
            className={`sfSlideImg sfSlideImgCurrent ${isTransitioning ? 'isEntering' : ''}`}
            src={slides[slide].src}
            alt={slides[slide].alt}
          />
          <div className="sfDots" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className={i === slide ? 'sfDot isActive' : 'sfDot'} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Planes BodyHealthGym</h2>
            <p className="muted">Tres planes claros para que el usuario entienda rápido qué incluye cada uno.</p>
          </div>
        </div>
        <div className="grid3">
          <article className="card planCard">
            <div className="badge">Plan 1</div>
            <div className="cardTitle">Plan Base</div>
            <div className="price">COP ${plan.price.amount.toLocaleString('es-CO')}</div>
            <div className="muted">Solo mensualidad del gimnasio.</div>
            <div className="sfList">
              <div><Check size={14} /> Acceso a instalaciones</div>
              <div><Check size={14} /> Dashboard de membresía</div>
              <div><Check size={14} /> Pago mensual en línea</div>
            </div>
            <Link className="btn btnGhost" to="/login">Elegir plan</Link>
          </article>
          <article className="card planCard planCardMain">
            <div className="badge">Más vendido</div>
            <div className="cardTitle">Plan Pro Fuel</div>
            <div className="price">COP $189.000</div>
            <div className="muted">Mensualidad + 1 proteína mensual.</div>
            <div className="sfList">
              <div><Check size={14} /> Todo el Plan Base</div>
              <div><Check size={14} /> 1 proteína mensual incluida</div>
              <div><Check size={14} /> Promociones exclusivas para miembros</div>
            </div>
            <Link className="btn btnPrimary" to="/login">Elegir Pro Fuel</Link>
          </article>
          <article className="card planCard">
            <div className="badge">Plan 3</div>
            <div className="cardTitle">Plan Elite Stack</div>
            <div className="price">COP $249.000</div>
            <div className="muted">Mensualidad + proteína + pre entreno.</div>
            <div className="sfList">
              <div><Check size={14} /> Todo el Plan Pro Fuel</div>
              <div><Check size={14} /> 1 pre entreno mensual incluido</div>
              <div><Check size={14} /> Prioridad en promociones</div>
            </div>
            <Link className="btn btnGhost" to="/login">Elegir Elite Stack</Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Beneficios principales</h2>
            <p className="muted">Diseño y contenido más orientado a UX comercial.</p>
          </div>
        </div>
        <div className="grid3">
          <article className="card">
            <div className="cardTop">
              <div className="productEmoji"><ShieldCheck size={18} /></div>
              <div>
                <div className="cardTitle">Acceso y control seguro</div>
                <div className="muted">Usuario, contraseña y estado de mensualidad siempre visible.</div>
              </div>
            </div>
          </article>
          <article className="card">
            <div className="cardTop">
              <div className="productEmoji"><CalendarDays size={18} /></div>
              <div>
                <div className="cardTitle">Mensualidad simple</div>
                <div className="muted">Pago en línea, fecha de vencimiento y días restantes en tiempo real.</div>
              </div>
            </div>
          </article>
          <article className="card">
            <div className="cardTop">
              <div className="productEmoji"><MapPin size={18} /></div>
              <div>
                <div className="cardTitle">Ubicación fácil</div>
                <div className="muted">Google Maps integrado y contacto directo por WhatsApp.</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Suplementos destacados</h2>
            <p className="muted">Visual de catálogo más limpio y directo.</p>
          </div>
          <Link className="link" to="/tienda">Ver todos <ArrowRight size={16} /></Link>
        </div>
        <div className="grid3">
          {highlight.map((p) => (
            <div className="card" key={p.id}>
              <div className="cardTop">
                <div className="productEmoji" aria-hidden="true">
                  <img className="productImgSm" src={p.imageSrc} alt="" loading="lazy" />
                </div>
                <div>
                  <div className="cardTitle">{p.name}</div>
                  <div className="muted">{p.shortDescription}</div>
                </div>
              </div>
              <div className="cardBottom">
                <div className="price">
                  COP ${p.price.amount.toLocaleString('es-CO')} <span className="muted">{p.price.currency}</span>
                </div>
                <Link className="btn btnGhost" to="/tienda">
                  Comprar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Fit Friend</h2>
            <p className="muted">Invita amigos y obtén beneficios en tu membresía.</p>
          </div>
        </div>
        <article className="fitFriendCard">
          <img className="fitFriendBanner" src="/banners/fitfriend-card.svg" alt="Promoción Fit Friend 2026" />
          <div className="fitFriendBody">
            <h3 className="fitFriendTitle">Fit Friend 2026</h3>
            <div className="fitFriendDate">15 Ene 2026 - 31 Dic 2026</div>
            <p className="muted">
              Una mensualidad gratis por cada amigo que redima el código y se registre en plan Black o Fit.
            </p>
            <div className="fitFriendActions">
              <Link className="btn btnPrimary btnLg" to={member ? '/miembros' : '/login'}>
                Conoce más <ArrowRight size={17} />
              </Link>
              <Link className="btn btnGhost btnLg" to={member ? '/miembros' : '/login'}>
                <Users size={16} /> Comunidad
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

