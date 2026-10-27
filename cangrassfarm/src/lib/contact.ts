export const PHONE_DISPLAY = "+91 90413 76098"
export const PHONE_TEL = "tel:+919041376098"
export const EMAIL = "moaviz@cangrassfarm.com"
export const INFO_EMAIL = "info@cangrassfarm.com"

export function whatsappLink(message: string) {
  return `https://wa.me/919041376098?text=${encodeURIComponent(message)}`
}

export const ADDRESS = {
  street: "Ludhiana Bypass Rd",
  landmarks: ["Beside Mehal Point", "Opposite Sham Filling Station"],
  area: "Haji Abdullah Colony",
  city: "Malerkotla",
  region: "Punjab",
  postcode: "148023",
}

export const ADDRESS_ONE_LINE = `${ADDRESS.street}, ${ADDRESS.landmarks.map((l) => l[0].toLowerCase() + l.slice(1)).join(", ")}, ${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postcode}`

// The nursery's pin on its Google Maps listing (beside Mehal Point).
export const GEO = { lat: 30.545545, lng: 75.8805946 }

// The nursery's name as listed on Google Maps; links search by name so they open the listing
// (with its photos, hours and reviews) rather than a bare pin.
const MAPS_PLACE = encodeURIComponent("Canadian Grass Farm and Flower Nursery, Malerkotla")

// Opens Google Maps directions to the listing.
export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_PLACE}`

// Opens the listing itself.
export const MAPS_PLACE_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_PLACE}`
