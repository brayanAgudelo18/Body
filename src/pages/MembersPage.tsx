import { Users } from 'lucide-react'
import { readPublicMembers } from '../state/members'

export function MembersPage() {
  const members = readPublicMembers()
  return (
    <div className="stack">
      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="h2">Personas del gimnasio</h2>
            <p className="muted">
              Solo se muestran miembros que activaron compartir su perfil.
            </p>
          </div>
          <div className="chip">
            <Users size={16} /> {members.length} visibles
          </div>
        </div>

        {members.length === 0 ? (
          <div className="empty">Aún no hay miembros con perfil público.</div>
        ) : (
          <div className="grid3">
            {members.map((m) => (
              <article className="card" key={m.id}>
                {m.photoDataUrl ? <img className="memberPhoto" src={m.photoDataUrl} alt={`Foto de ${m.fullName}`} /> : null}
                <div className="cardTitle">{m.fullName}</div>
                <div className="muted">
                  <b>Objetivo:</b> {m.goal || 'No especificado'}
                </div>
                <div className="muted">
                  <b>Info:</b> {m.about || 'Sin descripción'}
                </div>
                {m.phone ? (
                  <div className="muted">
                    <b>Teléfono:</b> {m.phone}
                  </div>
                ) : null}
                {m.social ? (
                  <div className="muted">
                    <b>Redes:</b> {m.social}
                  </div>
                ) : null}
                {m.optionalInfo ? (
                  <div className="muted">
                    <b>Opcional:</b> {m.optionalInfo}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

