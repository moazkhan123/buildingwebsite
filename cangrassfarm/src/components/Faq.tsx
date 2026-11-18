import { ChevronDown, MessageCircle, Phone } from "lucide-react"
import { useT } from "@/i18n/content"
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"
import { GelButton, Reveal, SectionHeading } from "./ui/gel"

// Questions and answers as native <details>, so every answer is in the prerendered HTML and
// opens without JavaScript. The same text feeds the FAQPage structured data in seo.ts.
export function FaqSection({ faq, id }: { faq: { eyebrow: string; title: string; items: [string, string][] }; id: string }) {
  return (
    <section className="px-4 pt-24 sm:px-6" aria-labelledby={id}>
      <SectionHeading eyebrow={faq.eyebrow} title={faq.title} id={id} />
      <Reveal className="mx-auto grid max-w-3xl gap-3">
        {faq.items.map(([q, a]) => (
          <details key={q} className="gel group rounded-[1.5rem] px-5 py-1">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
              <h3 className="font-sans text-base font-semibold sm:text-lg">{q}</h3>
              <ChevronDown className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180" aria-hidden />
            </summary>
            <p className="pb-4 text-muted-foreground">{a}</p>
          </details>
        ))}
      </Reveal>
    </section>
  )
}

// Who runs the nursery: the people behind a local business, stated plainly.
export function AboutMoaviz() {
  const t = useT()
  return (
    <section className="px-4 pt-24 sm:px-6" aria-labelledby="about-title">
      <Reveal className="gel mx-auto max-w-3xl rounded-[2rem] p-6 text-center sm:p-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">{t.about.eyebrow}</p>
        <h2 id="about-title" className="text-balance text-3xl font-semibold sm:text-4xl">
          {t.about.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t.about.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <GelButton href={PHONE_TEL} className="px-6 text-base">
            <Phone className="size-4" aria-hidden /> <span dir="ltr">{PHONE_DISPLAY}</span>
          </GelButton>
          <GelButton href={whatsappLink(t.about.msg)} target="_blank" rel="noopener" variant="glass" className="px-6 text-base">
            <MessageCircle className="size-4" aria-hidden /> {t.hire.whatsapp}
          </GelButton>
        </div>
      </Reveal>
    </section>
  )
}
