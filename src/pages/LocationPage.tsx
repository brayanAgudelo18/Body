import { MapPin } from 'lucide-react'
import { GYM_NAME } from '../lib/data'

const DEFAULT_MAP =
  'https://www.google.com/maps?q=BodyHealthGym&output=embed'

export function LocationPage() {
  const mapUrl = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || DEFAULT_MAP

  return (
    <div className="stack">
      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Ubicación</h2>
            <p className="muted">
              Encuentra {GYM_NAME} y llega fácil. Si me pasas tu dirección exacta, te lo dejo con “Place ID” y vista perfecta.
            </p>
          </div>
          <div className="chip">
            <MapPin size={16} /> Google Maps
          </div>
        </div>

        <div className="mapCard">
          <iframe
            title="Google Maps"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mapFrame"
          />
        </div>
      </section>

      <section className="section">
        <h2 className="h2">Horario y contacto</h2>
        <div className="grid2">
          <div className="card">
            <div className="cardTitle">Horario</div>
            <div className="muted">
              Lunes a Viernes: 6:00am – 10:00pm
              <br />
              Sábado: 8:00am – 2:00pm
              <br />
              Domingo: Cerrado
            </div>
          </div>
          <div className="card">
            <div className="cardTitle">Dirección</div>
            <div className="muted">
              (Editable) Calle / Colonia / Ciudad
              <br />
              Tel: (Editable) +52…
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

