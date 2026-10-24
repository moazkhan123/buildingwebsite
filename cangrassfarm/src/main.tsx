import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource-variable/lora"
import "@fontsource-variable/raleway"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
