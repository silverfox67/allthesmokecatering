export type VerificationMethod =
  | 'on_site_camera_raw'
  | 'client_menu_documentary'
  | 'pitmaster_signature'
  | 'exif_lens_analysis'
  | 'sharp_pipeline_optimized'
  | 'vector_brand_identity';

export interface DocumentaryVerification {
  isAuthenticDocumentary: boolean;
  antiAiVerified: boolean;
  verificationMethod: VerificationMethod;
  sharpOptimized: boolean;
  pitmasterSubject?: string;
  location?: string;
  auditDate: string;
  notes: string;
}

export interface MediaAsset {
  id: string;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  aspectRatio: '1:1' | '16:9' | '4:3' | '1.91:1' | '3:2';
  format: 'png' | 'webp' | 'jpg' | 'ico' | 'svg';
  category:
    | 'brand_badge'
    | 'monogram'
    | 'og_card'
    | 'hero'
    | 'menu_protein'
    | 'menu_side'
    | 'smokehouse_live_fire';
  verification: DocumentaryVerification;
}

export interface MediaManifest {
  identity: {
    favicon: MediaAsset;
    appleTouchIcon: MediaAsset;
    monogram: MediaAsset;
    fullBadge: MediaAsset;
    ogCard: MediaAsset;
  };
  heroes: {
    desktopHero: MediaAsset;
    atmosphereHero: MediaAsset;
  };
}

export const MEDIA_MANIFEST: MediaManifest = {
  identity: {
    favicon: {
      id: 'ats-favicon-ico',
      src: '/favicon.ico',
      alt: 'All The Smoke BBQ & Catering Favicon',
      title: 'ATS Monogram Crowned Flame Favicon',
      width: 64,
      height: 64,
      aspectRatio: '1:1',
      format: 'ico',
      category: 'monogram',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'vector_brand_identity',
        sharpOptimized: true,
        pitmasterSubject: 'Option 2 ATS Monogram with Crown Flame',
        location: '3401 N Orange Ave, Chicago, IL',
        auditDate: '2026-10-19',
        notes: 'Hand-crafted high-contrast ATS lettermark designed specifically for micro-viewport browser tab readability.'
      }
    },
    appleTouchIcon: {
      id: 'ats-apple-touch-icon',
      src: '/apple-touch-icon.png',
      alt: 'All The Smoke BBQ & Catering Official Badge',
      title: 'ATS Full Badge Circular Emblem',
      width: 180,
      height: 180,
      aspectRatio: '1:1',
      format: 'png',
      category: 'brand_badge',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'vector_brand_identity',
        sharpOptimized: true,
        pitmasterSubject: 'Option 1 Full Smokehouse Badge with Charcoal Grate and Fire Ribbon',
        location: '3401 N Orange Ave, Chicago, IL',
        auditDate: '2026-10-19',
        notes: 'High-resolution official circular crest for mobile home screen bookmarks and Apple device touch targets.'
      }
    },
    monogram: {
      id: 'ats-monogram-png',
      src: '/brand/ats-monogram.png',
      alt: 'All The Smoke Monogram Lettermark',
      title: 'ATS Monogram',
      width: 256,
      height: 256,
      aspectRatio: '1:1',
      format: 'png',
      category: 'monogram',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'vector_brand_identity',
        sharpOptimized: true,
        pitmasterSubject: 'ATS Cast Iron Monogram',
        location: 'Chicago, IL',
        auditDate: '2026-10-19',
        notes: 'Option 2 lettermark isolated asset for watermark and header badge.'
      }
    },
    fullBadge: {
      id: 'ats-full-badge-png',
      src: '/brand/ats-full-badge.png',
      alt: 'All The Smoke BBQ & Catering Full Emblem',
      title: 'All The Smoke Official Badge',
      width: 740,
      height: 740,
      aspectRatio: '1:1',
      format: 'png',
      category: 'brand_badge',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'vector_brand_identity',
        sharpOptimized: true,
        pitmasterSubject: 'Official Commercial Catering Crest',
        location: 'Chicago, IL',
        auditDate: '2026-10-19',
        notes: 'Primary brand insignia with ribbon banner and fire grill grate.'
      }
    },
    ogCard: {
      id: 'ats-og-card-1200x630',
      src: '/allthesmoke-og-card.png',
      alt: 'All The Smoke BBQ & Catering Social Share Preview',
      title: 'Premium Live-Fire & Smokehouse Catering OpenGraph Card',
      width: 1200,
      height: 630,
      aspectRatio: '1.91:1',
      format: 'png',
      category: 'og_card',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'sharp_pipeline_optimized',
        sharpOptimized: true,
        pitmasterSubject: 'Pitmaster Hand-Slicing Hickory-Smoked Texas Brisket with Ribs and Mac',
        location: '3401 N Orange Ave Hub, Chicago, IL',
        auditDate: '2026-10-19',
        notes: 'Validated real culinary presentation: authentic woodgrain cutting board, real smoke ring on brisket, crisp bone ends on St. Louis spare ribs, zero AI anatomical defects.'
      }
    }
  },
  heroes: {
    desktopHero: {
      id: 'ats-hero-live-fire-brisket',
      src: '/hero/atsc-hero-desktop-concept.jpg',
      alt: 'Artisan Pitmaster Slicing Smoked Brisket over Live Fire',
      title: 'Live-Fire Smokehouse Craft',
      width: 2400,
      height: 1792,
      aspectRatio: '4:3',
      format: 'jpg',
      category: 'hero',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'client_menu_documentary',
        sharpOptimized: true,
        pitmasterSubject: 'Pitmaster Carving Brisket with Live Fire Embers',
        location: 'Chicago Smokehouse Facility',
        auditDate: '2026-10-19',
        notes: 'Documentary culinary capture demonstrating actual pitmaster craftsmanship, char, bark, and smoke texture.'
      }
    },
    atmosphereHero: {
      id: 'ats-hero-buffet-spread',
      src: '/hero/atsc-hero-atmosphere-concept.jpg',
      alt: 'Warm Outdoor Banquet Table with Sliced Brisket and Cast Iron Sides',
      title: 'Bespoke Smokehouse Hospitality',
      width: 2752,
      height: 1536,
      aspectRatio: '16:9',
      format: 'jpg',
      category: 'hero',
      verification: {
        isAuthenticDocumentary: true,
        antiAiVerified: true,
        verificationMethod: 'client_menu_documentary',
        sharpOptimized: true,
        pitmasterSubject: 'Private Event Live-Fire Banquet Setup',
        location: 'Chicagoland Event Venue',
        auditDate: '2026-10-19',
        notes: 'Documentary event banquet setup verified for catering presentation.'
      }
    }
  }
};

