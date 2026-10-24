import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { BasketDrawer, FloatingCall, Footer, Nav } from "@/components/Chrome"
import { GelBackdrop } from "@/components/Ambient"
import { useBasket } from "@/lib/basket"
import { useRoute } from "@/lib/router"
import FlowersPage from "@/pages/Flowers"

// Loaded on demand so the Flowers page ships less JavaScript.
const LandscapingPage = lazy(() => import("@/pages/Landscaping"))

const titles = {
  "/": "Canadian Grass Farm & Flower Nursery — Flowers, Plants & Lawn Grass in Malerkotla",
  "/landscaping": "Landscaping & Lawn Grass — Canadian Grass Farm, Malerkotla",
}

export default function App() {
  const route = useRoute()
  const basket = useBasket()
  const [basketOpen, setBasketOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const first = useRef(true)

  useEffect(() => {
    document.title = titles[route]
    if (first.current) {
      first.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [route])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">
        Skip to content
      </a>
      <GelBackdrop />
      <Nav route={route} basket={basket} onBasket={() => setBasketOpen(true)} />
      <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {route === "/" ? (
              <FlowersPage basket={basket} />
            ) : (
              <Suspense fallback={<div className="min-h-dvh" />}>
                <LandscapingPage />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingCall />
      <BasketDrawer open={basketOpen} onClose={() => setBasketOpen(false)} basket={basket} />
    </MotionConfig>
  )
}
