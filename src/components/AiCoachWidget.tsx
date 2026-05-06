import { useMemo, useState } from 'react'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import { MEMBERSHIP_PLANS } from '../lib/data'
import type { ChatMessage } from '../lib/types'
import { daysLeft, nowIso, uid } from '../lib/storage'
import { useAuth } from '../state/auth'
import { readProducts } from '../state/products'

function formatCop(n: number) {
  return `COP $${n.toLocaleString('es-CO')}`
}

function findProductFromText(text: string) {
  const products = readProducts()
  const t = text.toLowerCase()
  // match by id fragments or key words
  const hit =
    products.find((p) => t.includes(p.id.split('-')[0])) ??
    products.find((p) => t.includes(p.name.toLowerCase())) ??
    products.find((p) => t.includes('creatina') && p.category === 'Creatina') ??
    products.find((p) => (t.includes('whey') || t.includes('prote')) && p.category === 'Proteína') ??
    products.find((p) => (t.includes('pre') || t.includes('pre-entreno')) && p.category === 'Pre-entreno') ??
    products.find((p) => t.includes('omega') && p.name.toLowerCase().includes('omega')) ??
    products.find((p) => t.includes('bcaa') && p.name.toLowerCase().includes('bcaa')) ??
    products.find((p) => t.includes('shaker') && p.category === 'Accesorios')
  return hit ?? null
}

function buildAssistantReply(userText: string, opts: { isMember: boolean; daysLeft: number; monthlyCop: number }) {
  const t = userText.trim().toLowerCase()
  const product = findProductFromText(t)

  if (t.includes('precio') || t.includes('cuanto cuesta') || t.includes('mensualidad')) {
    return `La mensualidad cuesta ${formatCop(opts.monthlyCop)}. Te quedan ${opts.daysLeft} día(s) de membresía activa.`
  }

  if (t.includes('dias') || t.includes('días') || t.includes('resta') || t.includes('quedan')) {
    return `Te quedan ${opts.daysLeft} día(s) de tu plan mensual. Si quieres, puedes pagar desde el Dashboard para extenderla.`
  }

  if (product) {
    const availableTxt = product.available ? 'Sí, está disponible.' : 'No, por ahora no está disponible.'
    const base = `${product.name}\n- Precio: ${formatCop(product.price.amount)}\n- Disponible: ${availableTxt}\n- Descripción: ${product.shortDescription}\n\n${product.longDescription}`

    if (t.includes('dispon') || t.includes('hay') || t.includes('stock')) {
      return `${product.name}: ${availableTxt}`
    }
    if (t.includes('descr') || t.includes('que es') || t.includes('para que') || t.includes('sirve')) {
      return base
    }
    if (t.includes('precio') || t.includes('cuanto cuesta')) {
      return `${product.name}: ${formatCop(product.price.amount)} • ${availableTxt}`
    }
    return base
  }

  if (t.includes('promoc') || t.includes('promo')) {
    const products = readProducts()
    const promos = products.filter((p) => p.promo || (opts.isMember && p.memberOnlyPromo))
      .slice(0, 4)
      .map((p) => {
        const labels = [
          p.promo ? `${p.promo.label}` : null,
          opts.isMember && p.memberOnlyPromo ? `${p.memberOnlyPromo.label}` : null,
        ].filter(Boolean)
        return `- ${p.name}: ${labels.join(' + ')}`
      })
      .join('\n')

    return opts.isMember
      ? `Promos activas (incluye beneficios de miembro):\n${promos}`
      : `Promos activas:\n${promos}\n\nTip: inicia sesión para ver promociones exclusivas de miembros.`
  }

  if (t.includes('creatina') || t.includes('prote') || t.includes('whey') || t.includes('pre')) {
    return `Recomendación rápida:\n- Creatina: constancia diaria y buena hidratación.\n- Proteína: útil si no llegas a tu objetivo con comida.\n\nDime tu objetivo (volumen / definición / recomposición) y tu experiencia (principiante / intermedio / avanzado).`
  }

  return `Soy tu asistente de ${import.meta.env.VITE_GYM_NAME || 'BodyHealthGym'}. Puedo ayudarte con:\n- Tu mensualidad (precio, días restantes)\n- Promociones en suplementos\n- Recomendaciones básicas según tu objetivo\n\n¿Qué necesitas hoy?`
}

export function AiCoachWidget() {
  const { member } = useAuth()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid('m'),
      role: 'assistant',
      text: 'Hola, soy tu coach IA. Pregúntame por tu mensualidad, promociones o suplementos.',
      createdAtIso: nowIso(),
    },
  ])

  const plan = MEMBERSHIP_PLANS.mensual
  const computed = useMemo(() => {
    const d = member ? daysLeft(nowIso(), member.membership.expiresAtIso) : 0
    return { isMember: !!member, daysLeft: d, monthlyCop: plan.price.amount }
  }, [member, plan.price.amount])

  function send() {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: ChatMessage = {
      id: uid('m'),
      role: 'user',
      text: trimmed,
      createdAtIso: nowIso(),
    }

    const assistantMsg: ChatMessage = {
      id: uid('m'),
      role: 'assistant',
      text: buildAssistantReply(trimmed, computed),
      createdAtIso: nowIso(),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setText('')
  }

  if (!open) {
    return (
      <button className="aiFab" type="button" onClick={() => setOpen(true)} aria-label="Abrir coach IA">
        <Bot size={20} />
        <span className="aiFabLabel">Coach IA</span>
        <Sparkles size={16} className="aiFabSpark" />
      </button>
    )
  }

  return (
    <div className="aiPanel" role="dialog" aria-label="Coach IA">
      <div className="aiHeader">
        <div className="aiTitle">
          <Bot size={18} />
          Coach IA
          {member ? <span className="badge">Miembro</span> : <span className="badge badgeGhost">Invitado</span>}
        </div>
        <button className="iconBtn" type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>

      <div className="aiMeta">
        <div className="aiMetaRow">
          <span className="muted">Días restantes</span>
          <span className="mono">{computed.daysLeft}</span>
        </div>
        <div className="aiMetaRow">
          <span className="muted">Mensualidad</span>
          <span className="mono">{formatCop(computed.monthlyCop)}</span>
        </div>
      </div>

      <div className="aiBody">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'assistant' ? 'aiMsg aiMsgA' : 'aiMsg aiMsgU'}>
            <div className="aiBubble">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="aiComposer">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
        />
        <button className="btn btnPrimary" type="button" onClick={send} aria-label="Enviar">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

