import { useEffect, useState } from "react"

export type Route = "/" | "/landscaping"

function current(): Route {
  return window.location.pathname.replace(/\/+$/, "") === "/landscaping" ? "/landscaping" : "/"
}

export function navigate(to: string) {
  const [path, hash] = to.split("#")
  if (path && path !== window.location.pathname) {
    window.history.pushState({}, "", to)
    window.dispatchEvent(new PopStateEvent("popstate"))
    window.scrollTo({ top: 0 })
  }
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }))
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(current)
  useEffect(() => {
    const onPop = () => setRoute(current())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])
  return route
}
