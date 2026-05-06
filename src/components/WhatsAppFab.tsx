const DEFAULT_NUMBER = '5210000000000'

export function WhatsAppFab() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER
  const text =
    import.meta.env.VITE_WHATSAPP_TEXT ||
    'Hola BodyHealthGym, quiero info de membresías y suplementos.'

  const href = `https://wa.me/${encodeURIComponent(number)}?text=${encodeURIComponent(text)}`

  return (
    <a className="whatsFab" href={href} target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <img className="whatsIcon" src="/whatsapp.svg" alt="" aria-hidden="true" />
      <span className="whatsFabLabel">WhatsApp</span>
    </a>
  )
}

