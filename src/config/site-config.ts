export interface DeliveryZone {
  zone: 1 | 2 | 3;
  name: string;
  minMiles: number;
  maxMiles: number;
  fee: number;
  minOrder: number;
  description: string;
  coverageAreas: string[];
}

export interface BusinessHours {
  days: string;
  orderWindow: string;
  leadTimeHours: number;
  pickupWindow: string;
}

export interface SiteConfig {
  brandName: string;
  legalName: string;
  tagline: string;
  primaryDomain: string;
  secondaryDomain: string;
  phone: string;
  phoneFormatted: string;
  brandEmail: string;
  primaryAdminEmail: string;
  secondaryAdminEmail: string;
  hubAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    formatted: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  serviceArea: string;
  socials: {
    tiktok: string;
  };
  meta: {
    title: string;
    description: string;
    ogImage: string;
    favicon: string;
    appleTouchIcon: string;
  };
  hours: BusinessHours;
  deliveryZones: DeliveryZone[];
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'All The Smoke BBQ & Catering',
  legalName: 'Marion Bolden',
  tagline: 'Chicagoland Premier Live-Fire Smoker & Artisan Smokehouse Catering',
  primaryDomain: 'allthesmokecatering.com',
  secondaryDomain: 'allthesmokebbqcatering.com',
  phone: '(773) 707-9988',
  phoneFormatted: '+17737079988',
  brandEmail: 'marion@allthesmokecatering.com',
  primaryAdminEmail: 'boldenmarion83@gmail.com',
  secondaryAdminEmail: 'bbqcateringking83@gmail.com',
  hubAddress: {
    street: '3401 N Orange Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60634',
    formatted: '3401 N Orange Ave, Chicago, IL 60634',
    coordinates: {
      latitude: 41.9427,
      longitude: -87.8286
    }
  },
  serviceArea: 'Chicagoland, Cook County & Northwest Suburbs',
  socials: {
    tiktok: 'https://www.tiktok.com/@allthesmokebbq_catering'
  },
  meta: {
    title: 'All The Smoke BBQ & Catering | Chicagoland Premier Live-Fire Smoker',
    description: 'Slow-smoked Texas brisket, artisan ribs, and mobile on-site pitmaster rigs for Chicago weddings, corporate galas, and private celebrations.',
    ogImage: '/allthesmoke-og-card.png',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png'
  },
  hours: {
    days: 'Tuesday - Sunday',
    orderWindow: '48-72 hours advance notice required for live-fire catering & whole meats',
    leadTimeHours: 48,
    pickupWindow: 'Friday - Sunday 12:00 PM - 6:00 PM (By Pre-Arranged Window Only)'
  },
  deliveryZones: [
    {
      zone: 1,
      name: 'Local Northwest Side & O\'Hare Corridor',
      minMiles: 0,
      maxMiles: 10,
      fee: 35.00,
      minOrder: 150.00,
      description: 'Dunning, Portage Park, Rosemont, Elmwood Park, Norridge, Park Ridge',
      coverageAreas: ['Dunning', 'Portage Park', 'Rosemont', 'Elmwood Park', 'Norridge', 'Park Ridge', 'Harwood Heights', 'Schorsch Forest View']
    },
    {
      zone: 2,
      name: 'Downtown Core, North Shore & West Suburbs',
      minMiles: 10.1,
      maxMiles: 20,
      fee: 65.00,
      minOrder: 300.00,
      description: 'The Loop, West Loop, Evanston, Skokie, Schaumburg, Lombard, Oak Park',
      coverageAreas: ['The Loop', 'West Loop', 'River North', 'Lincoln Park', 'Evanston', 'Skokie', 'Oak Park', 'Schaumburg', 'Lombard', 'Des Plaines']
    },
    {
      zone: 3,
      name: 'South Side & Outer Chicagoland Ring',
      minMiles: 20.1,
      maxMiles: 35,
      fee: 95.00,
      minOrder: 500.00,
      description: 'Bronzeville, Beverly, Naperville, Aurora, Highland Park, Orland Park',
      coverageAreas: ['Bronzeville', 'Hyde Park', 'Beverly', 'Naperville', 'Aurora', 'Highland Park', 'Orland Park', 'Tinley Park', 'Bolingbrook']
    }
  ]
};
