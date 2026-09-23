/**
 * Single source of truth for the contact details and physical locations
 * shown across the site (navbar CTA, page CTAs, contact page, live map).
 */
export const SITE_CONTACT = {
  phoneDisplay: '+91 70159 19989',
  phoneHref: 'tel:+917015919989',
  whatsappHref: 'https://wa.me/917015919989',
  whatsappDealerHref:
    'https://wa.me/917015919989?text=Hello%20CARTRON%20PPF%2C%20I%20would%20like%20to%20inquire%20about%20Dealership%20and%20Distribution.',
  email: 'contact@cartron.in',
  instagram: 'https://instagram.com/cartronppf',
  facebook: 'https://facebook.com/cartronppf',
  linkedin: 'https://linkedin.com/company/cartronppf',
} as const;

export interface SiteLocation {
  id: 'plant' | 'studio';
  tabLabel: string;
  tag: string;
  name: string;
  addressLine: string;
  detail: string;
  /** Free-text query handed to Google Maps for the embed + directions. */
  mapQuery: string;
  hours: string;
}

export const SITE_LOCATIONS: SiteLocation[] = [
  {
    id: 'plant',
    tabLabel: 'Greater Noida Plant',
    tag: '// CARTRON EXTRUSION & DISPATCH PLANT //',
    name: 'Plot No. 26, Sector: Iteda',
    addressLine: 'Plot No. 26, Sector: Iteda, Greater Noida - 201318',
    detail: 'Greater Noida - 201318 • High-Tech Optical Roll Coater',
    mapQuery: 'Plot No. 26, Greater Noida, Uttar Pradesh 201318, India',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  },
  {
    id: 'studio',
    tabLabel: 'Delhi Flagship Studio',
    tag: '// CARTRON CLEANROOM INSTALLATION STUDIO //',
    name: '340 Sant Nagar, East of Kailash',
    addressLine: '340 Sant Nagar, East of Kailash, New Delhi - 110065',
    detail: 'New Delhi - 110065 • Class-100 Cleanroom Bay 01 & 02',
    mapQuery: '340 Sant Nagar, East of Kailash, New Delhi, Delhi 110065, India',
    hours: 'By Appointment',
  },
];
