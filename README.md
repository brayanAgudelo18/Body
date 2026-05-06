# BodyHealthGym (React)

Sitio profesional e interactivo para gimnasio con:

- Tienda de suplementos (creatina, proteínas y más) con promos
- Login de miembros (usuario/contraseña)
- Dashboard con mensualidad (días restantes, costo) y “pago” demo (extiende vencimiento)
- Promociones exclusivas solo si eres usuario
- Google Maps embebido (ubicación)
- Botón flotante de WhatsApp
- Coach IA (modo demo) que conversa y responde sobre mensualidad/promos/suplementos

## Ejecutar

```bash
cd BodyHealthGym
npm install
npm run dev
```

## Cuentas demo

- `demo / demo`
- `ana / 1234`
- `brayan / 1234`

## Variables de entorno

Copia `.env.example` a `.env` y edita:

- `VITE_WHATSAPP_NUMBER` (tu número real)
- `VITE_GOOGLE_MAPS_EMBED_URL` (tu embed real de Maps)

## Nota de pagos (producción)

El pago de mensualidad está en modo **demo** (simula y extiende la fecha). Si quieres, lo conecto con **Stripe** o **MercadoPago** con backend.
