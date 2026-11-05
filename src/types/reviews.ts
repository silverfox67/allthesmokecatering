export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface CustomerReview {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  eventType: string; // e.g. "Wedding", "Corporate Event", "Private Party", "Game Day", "Birthday"
  eventDate?: string;
  rating: ReviewRating;
  reviewText: string;
  favoriteHighlights: string[]; // e.g. ["14-Hour Smoked Brisket", "Fall-Off-The-Bone Ribs", "4-Cheese Mac"]
  permissionToFeature: boolean;
  isFeatured: boolean;
  submittedAt: string;
  source: "web-direct" | "sms-link" | "email-link" | "qr-card";
  status: "published" | "pending" | "private-feedback";
  copiedToGoogle?: boolean;
  adminResponse?: string;
}

export const CATERING_HIGHLIGHT_TAGS = [
  "🔥 14-Hour Texas Brisket Bark",
  "🍖 Fall-Off-The-Bone Ribs & Tips",
  "🧀 4-Cheese Pitmaster Mac & Cheese",
  "🍗 Hardwood Smoked Turkey & Wings",
  "🚚 Punctual & Piping Hot Delivery",
  "👨‍🍳 Marion's Southern Hospitality",
  "🌶️ Peach Habanero Pit Glaze",
  "🪵 Live-Fire Smoker Trailer Atmosphere",
];

