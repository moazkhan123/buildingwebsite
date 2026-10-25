import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { BasketDrawer, FloatingCall, Footer, Nav } from "@/components/Chrome"
import { GelBackdrop } from "@/components/Ambient"
import { useT } from "@/i18n/content"
import { LangProvider, useLang } from "@/i18n/lang"
import { useBasket } from "@/lib/basket"
import { useRoute } from "@/lib/router"
import FlowersPage from "@/pages/Flowers"
import { pageMeta } from "@/seo"

// Loaded on demand so the Flowers page ships less JavaScript.
const LandscapingPage = lazy(() => import("@/pages/Landscaping"))

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  )
}

function Site() {
  const t = useT()
  const { lang } = useLang()
  const route = useRoute()
  const basket = useBasket()
  const [basketOpen, setBasketOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const first = useRef(true)

  // Keep the head in step when the visitor changes page or language without a reload.
  useEffect(() => {
    const { title, description, url } = pageMeta(route, lang)
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute("content", description)
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url)
  }, [lang, route])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [route])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">
        {t.skip}
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
            ) : import.meta.env.SSR ? (
              // Build-time prerender: no Suspense boundary, so React waits for the page instead of
              // emitting inline swap scripts (which the CSP would block).
              <LandscapingPage />
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
