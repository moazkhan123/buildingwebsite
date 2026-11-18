import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import "@fontsource-variable/lora"
import "@fontsource-variable/raleway"
// Hindi and Punjabi headings; each file is only downloaded when that script is on screen.
import "@fontsource-variable/noto-serif-devanagari"
import "@fontsource-variable/noto-serif-gurmukhi"
import "./index.css"
import App from "./App.tsx"
import { initialLang } from "./i18n/lang"
import { parsePath } from "./lib/router"
import { loadOverlay } from "./i18n/overlays"

// A visitor returning in Hindi or Punjabi gets that text before the first paint.
const lang = initialLang()
const root = document.getElementById("root")!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
loadOverlay(lang).finally(() => {
  // The page is prerendered: attach to that HTML when it is in the language being shown;
  // otherwise (e.g. a saved Hindi choice on an English URL) draw it afresh.
  if (root.firstElementChild && lang === parsePath(window.location.pathname).lang) hydrateRoot(root, app)
  else createRoot(root).render(app)
})
