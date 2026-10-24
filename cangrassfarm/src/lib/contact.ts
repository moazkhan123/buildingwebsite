export const PHONE_DISPLAY = "+91 90413 76098"
export const PHONE_TEL = "tel:+919041376098"

export function whatsappLink(message: string) {
  return `https://wa.me/919041376098?text=${encodeURIComponent(message)}`
}
