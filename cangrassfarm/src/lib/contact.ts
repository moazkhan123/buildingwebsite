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

// The nursery's exact pin (dropped beside Mehal Point).
export const GEO = { lat: 30.5455439, lng: 75.8806352 }

// Opens Google Maps directions straight to the pin.
export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${GEO.lat},${GEO.lng}`
