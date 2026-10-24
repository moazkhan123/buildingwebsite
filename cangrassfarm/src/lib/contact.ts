export const PHONE_DISPLAY = "+91 90413 76098"
export const PHONE_TEL = "tel:+919041376098"

export function whatsappLink(message: string) {
  return `https://wa.me/919041376098?text=${encodeURIComponent(message)}`
}

export const ADDRESS = {
  street: "Dhuri – Malerkotla – Ahmedgarh Rd",
  landmarks: ["Beside Mehal Point", "Opposite Sham Filling Station"],
  area: "Haji Abdullah Colony",
  city: "Malerkotla",
  region: "Punjab",
  postcode: "148023",
}

export const ADDRESS_ONE_LINE = `${ADDRESS.street}, ${ADDRESS.landmarks.map((l) => l[0].toLowerCase() + l.slice(1)).join(", ")}, ${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postcode}`

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `Canadian Grass Farm, ${ADDRESS.street}, opposite Sham Filling Station, ${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postcode}`,
)}`
