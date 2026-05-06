import { GYM_NAME } from '../lib/data'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <div className="footerBrand">
          <div className="footerTitle">{GYM_NAME}</div>
        </div>
        <div className="footerSocials" aria-label="Redes sociales">
          <a className="footerSocial" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <img src="/social/instagram.svg" alt="" aria-hidden="true" />
          </a>
          <a className="footerSocial" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <img src="/social/facebook.svg" alt="" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}

