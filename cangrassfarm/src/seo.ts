import { flowers } from "@/data/flowers"
import { grasses } from "@/data/landscaping"
import { LANGS, type Lang } from "@/i18n/lang"
import { ui } from "@/i18n/ui"
import { ADDRESS_ONE_LINE, ADDRESS, EMAIL, GEO, INFO_EMAIL, MAPS_PLACE_URL, PHONE_TEL } from "@/lib/contact"
import { pathFor, routes, type Route } from "@/lib/router"

export const SITE = "https://cangrassfarm.com"
const NAME = "Canadian Grass Farm & Flower Nursery"
const PHONE = PHONE_TEL.replace("tel:", "")

const descriptions: Record<Lang, Record<Route, string>> = {
  en: {
    "/": "Flowers, indoor plants and lawn grass slabs from our nursery on Ludhiana Bypass Rd, Malerkotla. Delivery within 50 km and wholesale orders. Call +91 90413 76098.",
    "/landscaping":
      "Lawn and garden landscaping in Malerkotla for homes, farmhouses, schools and hotels, with Canadian, Bermuda, Golf, All Season and Winter grass slabs. Call Moaviz.",
  },
  hi: {
    "/": "लुधियाना बाईपास रोड, मलेरकोटला की हमारी नर्सरी से फूल, इनडोर पौधे और लॉन घास की स्लैब। 50 किमी तक डिलीवरी और थोक ऑर्डर। कॉल करें: +91 90413 76098।",
    "/landscaping":
      "मलेरकोटला में घर, फार्महाउस, स्कूल और होटल के लिए लॉन और बगीचे की लैंडस्केपिंग, कैनेडियन, बरमूडा, गोल्फ़, ऑल सीज़न और विंटर घास की स्लैब के साथ। मोआविज़ को कॉल करें।",
  },
  pa: {
    "/": "ਲੁਧਿਆਣਾ ਬਾਈਪਾਸ ਰੋਡ, ਮਲੇਰਕੋਟਲਾ ਦੀ ਸਾਡੀ ਨਰਸਰੀ ਤੋਂ ਫੁੱਲ, ਇਨਡੋਰ ਪੌਦੇ ਅਤੇ ਲਾਅਨ ਘਾਹ ਦੀਆਂ ਸਲੈਬਾਂ। 50 ਕਿਲੋਮੀਟਰ ਤੱਕ ਡਿਲੀਵਰੀ ਅਤੇ ਥੋਕ ਆਰਡਰ। ਕਾਲ ਕਰੋ: +91 90413 76098।",
    "/landscaping":
      "ਮਲੇਰਕੋਟਲਾ ਵਿੱਚ ਘਰ, ਫਾਰਮਹਾਊਸ, ਸਕੂਲ ਅਤੇ ਹੋਟਲ ਲਈ ਲਾਅਨ ਅਤੇ ਬਾਗ਼ ਦੀ ਲੈਂਡਸਕੇਪਿੰਗ, ਕੈਨੇਡੀਅਨ, ਬਰਮੂਡਾ, ਗੋਲਫ਼, ਆਲ ਸੀਜ਼ਨ ਅਤੇ ਵਿੰਟਰ ਘਾਹ ਦੀਆਂ ਸਲੈਬਾਂ ਨਾਲ। ਮੋਆਵਿਜ਼ ਨੂੰ ਕਾਲ ਕਰੋ।",
  },
}

const locale: Record<Lang, string> = { en: "en_IN", hi: "hi_IN", pa: "pa_IN" }
const altNames = ["कैनेडियन ग्रास फार्म एंड फ्लावर नर्सरी", "ਕੈਨੇਡੀਅਨ ਗ੍ਰਾਸ ਫਾਰਮ ਐਂਡ ਫਲਾਵਰ ਨਰਸਰੀ", "Canadian Grass Farm"]

export const urlFor = (route: Route, lang: Lang) => SITE + pathFor(route, lang)

export function pageMeta(route: Route, lang: Lang) {
  return { title: ui[lang].titles[route], description: descriptions[lang][route], url: urlFor(route, lang) }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** Structured data for Google: the business, the site, this page, and on /landscaping the service. */
function jsonLd(route: Route, lang: Lang) {
  const { title, description, url } = pageMeta(route, lang)
  const business = {
    "@type": ["GardenStore", "LocalBusiness"],
    "@id": `${SITE}/#business`,
    name: NAME,
    alternateName: altNames,
    url: `${SITE}/`,
    logo: `${SITE}/icon-512.png`,
    image: [`${SITE}/og-image.jpg`, `${SITE}/img/projects/curved-lawn-borders.webp`],
    telephone: PHONE,
    email: INFO_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_ONE_LINE.split(`, ${ADDRESS.city}`)[0],
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postcode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    hasMap: MAPS_PLACE_URL,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "19:00",
      },
    ],
    // Delivery area: within 50 km of the nursery.
    areaServed: [
      { "@type": "City", name: "Malerkotla" },
      {
        "@type": "GeoCircle",
        geoMidpoint: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
        geoRadius: 50000,
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      email: EMAIL,
      contactType: "sales",
      name: "Moaviz",
      availableLanguage: ["English", "Hindi", "Punjabi"],
    },
    slogan: "Green Today, Beautiful Tomorrow",
    // Plants and grasses are listed as things the nursery knows about, not as Products: Google
    // flags Products without a price as invalid "Product snippets".
    knowsAbout: [
      "Flower nursery",
      "Lawn grass",
      "Landscaping",
      "Garden design",
      "Indoor plants",
      ...grasses.map((g) => g.name),
      ...flowers.map((f) => (f.local ? `${f.name} (${f.local})` : f.name)),
    ],
  }
  const graph: object[] = [
    business,
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: NAME,
      inLanguage: ["en", "hi", "pa"],
      publisher: { "@id": `${SITE}/#business` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#business` },
      primaryImageOfPage: `${SITE}/og-image.jpg`,
      ...(route === "/landscaping" && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    },
  ]
  if (route === "/landscaping") {
    graph.push(
      {
        "@type": "Service",
        "@id": `${url}#service`,
        serviceType: "Landscaping and lawn installation",
        name: ui[lang].nav.landscaping,
        description,
        provider: { "@id": `${SITE}/#business` },
        areaServed: { "@type": "City", name: "Malerkotla" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui[lang].nav.flowers, item: urlFor("/", lang) },
          { "@type": "ListItem", position: 2, name: ui[lang].nav.landscaping, item: url },
        ],
      },
    )
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
}

/** Everything in <head> that changes per page and language. */
export function headTags(route: Route, lang: Lang) {
  const { title, description, url } = pageMeta(route, lang)
  const alternates = [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l.id}" href="${urlFor(route, l.id)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(route, "en")}" />`,
  ]
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(NAME)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:locale" content="${locale[lang]}" />`,
    ...LANGS.filter((l) => l.id !== lang).map((l) => `<meta property="og:locale:alternate" content="${locale[l.id]}" />`),
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<script type="application/ld+json">${jsonLd(route, lang).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ")
}

/** Sitemap listing every page in every language, with each page's translations linked. */
export function sitemap(lastmod: string) {
  const urls = routes.flatMap((route) =>
    LANGS.map(
      (l) => `  <url>
    <loc>${urlFor(route, l.id)}</loc>
    <lastmod>${lastmod}</lastmod>
${LANGS.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.id}" href="${urlFor(route, a.id)}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(route, "en")}" />
  </url>`,
    ),
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`
}
