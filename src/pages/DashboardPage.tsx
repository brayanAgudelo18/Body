import { useEffect, useMemo, useState } from 'react'
import { BadgePercent, CalendarDays, CreditCard, Dumbbell, Sparkles, Timer, Trophy } from 'lucide-react'
import { MEMBERSHIP_PLANS } from '../lib/data'
import { daysLeft, nowIso } from '../lib/storage'
import { useAuth } from '../state/auth'
import { readProducts } from '../state/products'

export function DashboardPage() {
  const base = import.meta.env.BASE_URL
  const { member, payMonthly, updateCommunityProfile } = useAuth()
  const [toast, setToast] = useState<string | null>(null)
  const [about, setAbout] = useState(member?.profile?.about ?? '')
  const [goal, setGoal] = useState(member?.profile?.goal ?? '')
  const [showInCommunity, setShowInCommunity] = useState(member?.profile?.showInCommunity ?? false)
  const [photoDataUrl, setPhotoDataUrl] = useState(member?.profile?.photoDataUrl ?? '')
  const [phone, setPhone] = useState(member?.profile?.phone ?? '')
  const [social, setSocial] = useState(member?.profile?.social ?? '')
  const [optionalInfo, setOptionalInfo] = useState(member?.profile?.optionalInfo ?? '')
  const [showPhoto, setShowPhoto] = useState(member?.profile?.visibility?.photo ?? true)
  const [showPhone, setShowPhone] = useState(member?.profile?.visibility?.phone ?? false)
  const [showSocial, setShowSocial] = useState(member?.profile?.visibility?.social ?? false)
  const [showOptionalInfo, setShowOptionalInfo] = useState(member?.profile?.visibility?.optionalInfo ?? false)

  useEffect(() => {
    if (!member) return
    setAbout(member.profile?.about ?? '')
    setGoal(member.profile?.goal ?? '')
    setShowInCommunity(member.profile?.showInCommunity ?? false)
    setPhotoDataUrl(member.profile?.photoDataUrl ?? '')
    setPhone(member.profile?.phone ?? '')
    setSocial(member.profile?.social ?? '')
    setOptionalInfo(member.profile?.optionalInfo ?? '')
    setShowPhoto(member.profile?.visibility?.photo ?? true)
    setShowPhone(member.profile?.visibility?.phone ?? false)
    setShowSocial(member.profile?.visibility?.social ?? false)
    setShowOptionalInfo(member.profile?.visibility?.optionalInfo ?? false)
  }, [member])

  const plan = MEMBERSHIP_PLANS.mensual

  const stats = useMemo(() => {
    if (!member) return null
    const d = daysLeft(nowIso(), member.membership.expiresAtIso)
    return {
      daysLeft: d,
      expiresAt: new Date(member.membership.expiresAtIso),
      lastPaymentAt: member.membership.lastPaymentAtIso ? new Date(member.membership.lastPaymentAtIso) : null,
    }
  }, [member])

  if (!member || !stats) return null
  if ((member.role ?? 'member') === 'admin') {
    return (
      <div className="stack">
        <section className="section">
          <div className="sectionHeader">
            <div>
              <h2 className="h2">Dashboard</h2>
              <p className="muted">
                Sesión de <b>Administrador</b>. Ve a Admin para gestionar productos.
              </p>
            </div>
            <a className="btn btnPrimary" href="/admin">
              Admin
            </a>
          </div>
        </section>
      </div>
    )
  }

  const memberPromos = readProducts().filter((p) => p.memberOnlyPromo).slice(0, 5)

  const heroImages = ['banners/gym-main.svg', 'banners/gym-weights.svg', 'banners/gym-cardio.svg']

  return (
    <div className="stack">
      <section className="section">
        <div className="memberHero">
          <div className="memberHeroCopy">
            <div className="memberHeroTag">
              <Sparkles size={16} /> Miembro activo
            </div>
            <h2 className="h2 memberHeroTitle">Hola, {member.fullName.split(' ')[0]}.</h2>
            <p className="muted memberHeroText">
              Este es tu espacio personal en BodyHealthGym: revisa tu plan, mantén tu racha y aprovecha tus beneficios.
            </p>
            <div className="memberQuickStats">
              <div className="memberQuickStat">
                <Timer size={16} />
                <span>{stats.daysLeft} días para renovar</span>
              </div>
              <div className="memberQuickStat">
                <Trophy size={16} />
                <span>Plan {plan.name}</span>
              </div>
              <div className="memberQuickStat">
                <Dumbbell size={16} />
                <span>Zona miembro premium</span>
              </div>
            </div>
          </div>
          <div className="memberHeroGallery">
            {heroImages.map((src, idx) => (
              <img
                key={src}
                className={`memberHeroImg ${idx === 0 ? 'memberHeroImgMain' : ''}`}
                src={`${base}${src}`}
                alt="Entrenamiento en BodyHealthGym"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <div className="grid3 memberCardsGrid">
          <div className="card memberStatCard">
            <div className="cardTitle memberCardTitle">Días restantes</div>
            <div className="bigNumber">{stats.daysLeft}</div>
            <div className="muted">Tu plan vence el {stats.expiresAt.toLocaleDateString('es-MX')}</div>
          </div>

          <div className="card memberStatCard">
            <div className="cardTitle memberCardTitle">Mensualidad</div>
            <div className="bigNumber">${plan.price.amount}</div>
            <div className="muted">{plan.price.currency} • Plan {plan.name}</div>
          </div>

          <div className="card memberStatCard memberPayCard">
            <div className="cardTitle memberCardTitle">Pago y renovación</div>
            <div className="muted">
              Último pago:{' '}
              <span className="mono">
                {stats.lastPaymentAt ? stats.lastPaymentAt.toLocaleDateString('es-MX') : '—'}
              </span>
            </div>
            <div className="divider" />
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => {
                const res = payMonthly()
                if (res.ok) setToast(`Pago registrado. Nueva fecha: ${new Date(res.newExpiresAtIso).toLocaleDateString('es-MX')}`)
                else setToast(res.error)
                setTimeout(() => setToast(null), 3500)
              }}
            >
              <CreditCard size={16} /> Pagar mensualidad
            </button>
            <div className="muted" style={{ marginTop: 8 }}>
              Registra tu pago y extiende tu membresía en segundos.
            </div>
          </div>
        </div>

        {toast ? <div className="toast">{toast}</div> : null}
      </section>

      <section className="section">
        <div className="sectionHeader memberPromoHeader">
          <div>
            <h2 className="h2">Ofertas para tu progreso</h2>
            <p className="muted">Selección especial para miembros activos esta semana.</p>
          </div>
          <div className="chip">
            <BadgePercent size={16} /> Miembro
          </div>
        </div>

        <div className="grid3">
          {memberPromos.map((p) => (
            <div className="card memberPromoCard" key={p.id}>
              <div className="cardTop">
                <div className="productEmoji" aria-hidden="true">
                  <img className="productImgSm" src={p.imageSrc} alt="" loading="lazy" />
                </div>
                <div>
                  <div className="cardTitle">{p.name}</div>
                  <div className="muted">
                    {p.memberOnlyPromo?.label} • -{p.memberOnlyPromo?.percentOff}% • {p.category}
                  </div>
                </div>
              </div>
              <div className="cardBottom">
                <div className="muted">
                  Recomendado para tu rutina actual y metas de entrenamiento.
                </div>
                <div className="pill">
                  <CalendarDays size={16} /> Activo mientras seas miembro
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Perfil en comunidad</h2>
            <p className="muted">
              Aquí decides si quieres mostrar tu información en la sección de miembros.
            </p>
          </div>
        </div>

        <div className="card">
          <label className="row muted">
            <input
              type="checkbox"
              checked={showInCommunity}
              onChange={(e) => setShowInCommunity(e.target.checked)}
            />
            Mostrar mi perfil en "Miembros"
          </label>

          <label className="field">
            <div className="fieldLabel">Objetivo</div>
            <input
              className="input"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej: Aumentar masa muscular"
            />
          </label>

          <label className="field">
            <div className="fieldLabel">Foto de perfil</div>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const res = typeof reader.result === 'string' ? reader.result : ''
                  setPhotoDataUrl(res)
                }
                reader.readAsDataURL(file)
              }}
            />
            {photoDataUrl ? <img className="profilePreview" src={photoDataUrl} alt="Foto de perfil" /> : null}
            <label className="row muted">
              <input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} />
              Mostrar foto a otros miembros
            </label>
          </label>

          <label className="field">
            <div className="fieldLabel">Teléfono</div>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: +57 300 000 0000"
            />
            <label className="row muted">
              <input type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)} />
              Mostrar teléfono a otros miembros
            </label>
          </label>

          <label className="field">
            <div className="fieldLabel">Redes sociales</div>
            <input
              className="input"
              value={social}
              onChange={(e) => setSocial(e.target.value)}
              placeholder="Instagram, TikTok o enlace"
            />
            <label className="row muted">
              <input type="checkbox" checked={showSocial} onChange={(e) => setShowSocial(e.target.checked)} />
              Mostrar redes sociales a otros miembros
            </label>
          </label>

          <label className="field">
            <div className="fieldLabel">Información opcional</div>
            <textarea
              className="input"
              style={{ minHeight: 80, resize: 'vertical' }}
              value={optionalInfo}
              onChange={(e) => setOptionalInfo(e.target.value)}
              placeholder="Algo opcional que quieras compartir"
            />
            <label className="row muted">
              <input
                type="checkbox"
                checked={showOptionalInfo}
                onChange={(e) => setShowOptionalInfo(e.target.checked)}
              />
              Mostrar información opcional a otros miembros
            </label>
          </label>

          <label className="field">
            <div className="fieldLabel">Información corta</div>
            <textarea
              className="input"
              style={{ minHeight: 90, resize: 'vertical' }}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Entreno 4 días por semana..."
            />
          </label>

          <div className="row">
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => {
                const res = updateCommunityProfile({
                  showInCommunity,
                  about,
                  goal,
                  photoDataUrl,
                  phone,
                  social,
                  optionalInfo,
                  visibility: {
                    photo: showPhoto,
                    phone: showPhone,
                    social: showSocial,
                    optionalInfo: showOptionalInfo,
                  },
                })
                setToast(res.ok ? 'Perfil de comunidad actualizado.' : res.error)
                setTimeout(() => setToast(null), 3000)
              }}
            >
              Guardar perfil público
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

