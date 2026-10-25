import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource-variable/lora"
import "@fontsource-variable/raleway"
// Hindi and Punjabi scripts; each file is only downloaded when that script is on screen.
import "@fontsource-variable/noto-sans-devanagari"
import "@fontsource-variable/noto-sans-gurmukhi"
import "@fontsource-variable/noto-serif-devanagari"
import "@fontsource-variable/noto-serif-gurmukhi"
import "./index.css"
import App from "./App.tsx"
import { initialLang } from "./i18n/lang"
import { loadOverlay } from "./i18n/overlays"

// A visitor returning in Hindi or Punjabi gets that text before the first paint.
loadOverlay(initialLang()).finally(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
)
