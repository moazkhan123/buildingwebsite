// Static hosts serve /landscaping and unknown paths from these copies of the SPA shell.
import { copyFileSync, mkdirSync } from "node:fs"

mkdirSync("dist/landscaping", { recursive: true })
copyFileSync("dist/index.html", "dist/landscaping/index.html")
copyFileSync("dist/index.html", "dist/404.html")
