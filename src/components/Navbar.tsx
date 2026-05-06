import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Dumbbell, LayoutDashboard, LogIn, LogOut, MapPin, Menu, Settings, ShoppingBag, UserCircle2, Users, X } from 'lucide-react'
import clsx from 'clsx'
import { GYM_NAME } from '../lib/data'
import { useAuth } from '../state/auth'

function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${GYM_NAME} - Inicio`}>
      <div className="brandMark" aria-hidden="true">
        <Dumbbell size={18} />
      </div>
      <div className="brandText">
        <div className="brandName">{GYM_NAME}</div>
      </div>
    </Link>
  )
}

export function Navbar() {
  const { member, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="nav">
      <div className="container navInner">
        <Brand />

        {!member ? (
          <button className="smartCta" type="button" onClick={() => navigate('/login')}>
            ¡Inscríbete ya!
          </button>
        ) : null}

        <button
          className="navMenuBtnClean"
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="navMobile" role="dialog" aria-label="Menú">
          <div className="container navMobileInner">
            <NavLink to="/tienda" className={({ isActive }) => clsx('navMobileLink', isActive && 'isActive')}>
              <ShoppingBag size={18} />
              Tienda
            </NavLink>
            <NavLink to="/ubicacion" className={({ isActive }) => clsx('navMobileLink', isActive && 'isActive')}>
              <MapPin size={18} />
              Ubicación
            </NavLink>
            {member ? (
              <NavLink to="/miembros" className={({ isActive }) => clsx('navMobileLink', isActive && 'isActive')}>
                <Users size={18} />
                Miembros
              </NavLink>
            ) : null}

            <div className="navMobileDivider" />

            {member ? (
              <>
                <div className="chip">
                  <UserCircle2 size={16} />
                  {member.fullName}
                </div>
                <button className="btn btnGhost" type="button" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                {member.role === 'admin' ? (
                  <button className="btn btnGhost" type="button" onClick={() => navigate('/admin')}>
                    <Settings size={18} /> Admin
                  </button>
                ) : null}
                <button className="btn btnGhost" type="button" onClick={() => logout()}>
                  <LogOut size={18} /> Salir
                </button>
              </>
            ) : (
              <button className="btn btnPrimary" type="button" onClick={() => navigate('/login')}>
                <LogIn size={18} /> Ingresar
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}

