import { useEffect, useState } from "react"

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
  const [items, setItems] = useState<Record<string, number>>(load)
  useEffect(() => {
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
