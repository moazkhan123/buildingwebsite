// Every photo has a small copy (name-sm.webp) for phones; scripts/optimize-images.py makes them.
export const small = (src: string) => src.replace(/\.webp$/, "-sm.webp")

/** srcset offering the small copy and the full photo, so phones download only what they show. */
export const srcSet = (src: string, smallWidth: number, fullWidth: number) => `${small(src)} ${smallWidth}w, ${src} ${fullWidth}w`

export const flowerSrcSet = (src: string) => srcSet(src, 240, 400)
export const photoSrcSet = (src: string) => srcSet(src, 360, 612)
