import { AnimatePresence, motion } from "motion/react"
import { CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react"
import { useState, type FormEvent } from "react"
import { DewDrops } from "@/components/Ambient"
import { GelButton, Reveal, SectionHeading, spring } from "@/components/ui/gel"
import { useT } from "@/i18n/content"
import { useLang } from "@/i18n/lang"
import { cn } from "@/lib/cn"
import { EMAIL, INFO_EMAIL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"

const MAX_WORDS = 500
const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

// Netlify Forms picks this form up from the prerendered HTML (data-netlify) and emails each
// submission to info@cangrassfarm.com (set under Forms → Notifications in the Netlify dashboard).
const FORM_NAME = "inquiry"

const field =
  "gel w-full rounded-2xl px-4 py-3 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--maple)_35%,transparent)]"

export default function ContactPage() {
  const t = useT()
  const { lang } = useLang()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const words = countWords(query)
  const tooLong = words > MAX_WORDS

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (tooLong || status === "sending") return
    const data = new FormData(e.currentTarget)
    data.set("subject", t.contact.subject(name.trim()))
    data.set("language", lang)
    setStatus("sending")
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus("sent")
      setName("")
      setEmail("")
      setQuery("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="relative isolate overflow-hidden px-4 pb-8 pt-12 sm:px-6 sm:pt-16" aria-labelledby="contact-title">
      <DewDrops count={10} />
      <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} id="contact-title">
        {t.contact.intro}
      </SectionHeading>

      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="gel relative rounded-[2rem] p-5 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={spring}
                className="flex min-h-80 flex-col items-center justify-center text-center"
                role="status"
              >
                <CheckCircle2 className="size-14 text-primary" aria-hidden />
                <h2 className="mt-4 text-2xl font-semibold">{t.contact.sentTitle}</h2>
                <p className="mt-2 max-w-sm text-muted-foreground">{t.contact.sentText}</p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-6 min-h-11 cursor-pointer font-semibold text-primary underline underline-offset-4">
                  {t.contact.another}
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <form name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} className="space-y-5">
                  <input type="hidden" name="form-name" defaultValue={FORM_NAME} />
                  <input type="hidden" name="subject" defaultValue="" />
                  <input type="hidden" name="language" defaultValue={lang} />
                  {/* Spam trap: hidden from people, filled in by bots. */}
                  <p className="hidden">
                    <label>
                      Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold">{t.contact.name}</span>
                    <input name="name" required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold">{t.contact.email}</span>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={field}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-bold">
                      {t.contact.query}
                      <span className="text-xs font-semibold text-muted-foreground">{t.contact.queryHint}</span>
                    </span>
                    <textarea
                      name="query"
                      required
                      rows={8}
                      maxLength={5000}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-describedby="query-count"
                      aria-invalid={tooLong}
                      className={cn(field, "min-h-48 resize-y", tooLong && "shadow-[0_0_0_2px_#b91c1c]")}
                    />
                    <span id="query-count" className={cn("mt-1.5 block text-right text-xs font-semibold tabular-nums", tooLong ? "text-[#b91c1c]" : "text-muted-foreground")} aria-live="polite">
                      {tooLong ? t.contact.tooLong(MAX_WORDS) : t.contact.words(words, MAX_WORDS)}
                    </span>
                  </label>

                  {status === "error" && (
                    <p role="alert" className="rounded-2xl border border-red-700/30 bg-red-700/10 p-3 text-sm font-semibold text-[#b91c1c]">
                      {t.contact.error}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={tooLong || status === "sending"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="gel-btn inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <Send className="size-4" aria-hidden /> {status === "sending" ? t.contact.sending : t.contact.send}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal delay={0.1} className="gel flex flex-col gap-2 self-start rounded-[2rem] p-5 sm:p-6">
          <p className="mb-1 text-sm font-bold">{t.contact.orReach}</p>
          {[INFO_EMAIL, EMAIL].map((e) => (
            <a key={e} href={`mailto:${e}`} className="flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline">
              <Mail className="size-4 shrink-0 text-primary" aria-hidden /> <span dir="ltr">{e}</span>
            </a>
          ))}
          <GelButton href={PHONE_TEL} className="mt-2 w-full">
            <Phone className="size-4" aria-hidden /> {t.call} · <span dir="ltr">{PHONE_DISPLAY}</span>
          </GelButton>
          <GelButton href={whatsappLink(t.hire.msg)} target="_blank" rel="noopener" variant="glass" className="w-full">
            <MessageCircle className="size-4" aria-hidden /> {t.hire.whatsapp}
          </GelButton>
          <p className="mt-2 text-xs text-muted-foreground">{t.hours}</p>
        </Reveal>
      </div>
    </section>
  )
}
