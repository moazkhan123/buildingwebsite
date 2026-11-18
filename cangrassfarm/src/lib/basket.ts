import { useEffect, useRef, useState } from "react"

const KEY = "cgf-basket"

function load(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}")
  } catch {
    return {}
  }
}

// Order list kept in the visitor's browser; it's sent to Moaviz over WhatsApp.
export function useBasket() {
  // Starts empty, as on the prerendered page, and loads the saved list once the page is running.
  const [items, setItems] = useState<Record<string, number>>({})
  const loaded = useRef(false)
  useEffect(() => setItems(load()), [])
  useEffect(() => {
    // Skip the first run, which would overwrite the saved list with the empty starting one.
    if (!loaded.current) {
      loaded.current = true
      return
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable */
    }
  }, [items])

  const set = (slug: string, qty: number) =>
    setItems((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[slug]
      else next[slug] = qty
      return next
    })

  return {
    items,
    count: Object.values(items).reduce((a, b) => a + b, 0),
    add: (slug: string) => set(slug, (items[slug] ?? 0) + 1),
    set,
    clear: () => setItems({}),
  }
}

export type Basket = ReturnType<typeof useBasket>
