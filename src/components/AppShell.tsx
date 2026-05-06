import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppFab } from './WhatsAppFab'
import { AiCoachWidget } from './AiCoachWidget'

export function AppShell() {
  const location = useLocation()
  const hideAi = location.pathname === '/login'

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      {!hideAi && <AiCoachWidget />}
    </div>
  )
}

