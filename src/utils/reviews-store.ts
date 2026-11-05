"use client";

import { useEffect, useState, useCallback } from "react";
import { CustomerReview } from "@/types/reviews";

export const STORAGE_KEY_REVIEWS = "ats_customer_reviews_v1";
export const EVENT_REVIEWS_UPDATED = "ats-reviews-updated";
export const GOOGLE_REVIEW_URL = "https://g.page/r/allthesmokecatering/review";

export const SEED_REVIEWS: CustomerReview[] = [
  {
    id: "rev-101",
    clientName: "Marcus Vance",
    clientEmail: "marcus.vance@chicagoevents.org",
    clientPhone: "(312) 555-0192",
    eventType: "Corporate Luncheon",
    eventDate: "2026-10-18",
    rating: 5,
    reviewText:
      "Marion and the All The Smoke crew blew our entire executive summit away. The Texas brisket had the deepest mahogany smoke ring I have ever tasted outside of Austin, and the meat pulled apart effortlessly. Hot-boxes arrived 45 minutes ahead of schedule and food was piping hot. Will only use Marion for all our future Chicago company events!",
    favoriteHighlights: [
      "🔥 14-Hour Texas Brisket Bark",
      "🚚 Punctual & Piping Hot Delivery",
      "🧀 4-Cheese Pitmaster Mac & Cheese",
    ],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-10-19T14:22:00.000Z",
    source: "sms-link",
    status: "published",
    copiedToGoogle: true,
  },
  {
    id: "rev-102",
    clientName: "Elena Rostova",
    clientEmail: "elena@fultonmarketsummit.com",
    clientPhone: "(773) 555-8321",
    eventType: "Wedding Reception",
    eventDate: "2026-09-28",
    rating: 5,
    reviewText:
      "We had Marion bring his offset pit rig to our Fulton Market wedding celebration. Our 120 guests are STILL talking about the ribs, smoked turkey chops, and burnt-end baked beans weeks later. Marion was genuine, warm, and professional from the first phone consultation to the final bite. 10/10 experience!",
    favoriteHighlights: [
      "🍖 Fall-Off-The-Bone Ribs & Tips",
      "🪵 Live-Fire Smoker Trailer Atmosphere",
      "👨‍🍳 Marion's Southern Hospitality",
    ],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-09-30T10:15:00.000Z",
    source: "email-link",
    status: "published",
    copiedToGoogle: true,
  },
  {
    id: "rev-103",
    clientName: "Todd Davis",
    clientEmail: "todddavis923@gmail.com",
    clientPhone: "(773) 707-9988",
    eventType: "Bears Game-Day Tailgate",
    eventDate: "2026-10-06",
    rating: 5,
    reviewText:
      "The burnt-end chili and peach habanero pit wings are unbeatable. Feeds a hungry football crowd with zero stress. Best live-fire BBQ operation in Illinois by a mile.",
    favoriteHighlights: [
      "🌶️ Peach Habanero Pit Glaze",
      "🔥 14-Hour Texas Brisket Bark",
      "🍗 Hardwood Smoked Turkey & Wings",
    ],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-10-07T16:40:00.000Z",
    source: "web-direct",
    status: "published",
    copiedToGoogle: true,
  },
  {
    id: "rev-104",
    clientName: "Derrick & Samantha Washington",
    clientEmail: "derrick.w@chicagomutual.com",
    clientPhone: "(312) 555-7734",
    eventType: "Family Reunion",
    eventDate: "2026-08-15",
    rating: 5,
    reviewText:
      "Ordered party pans of brisket, smoked rib tips, and the 4-cheese mac and cheese for 80 family members in Oak Park. Everyone went back for thirds. Marion provided all serving utensils, reheat instructions, and extra pit barbecue sauce. Pure perfection.",
    favoriteHighlights: [
      "🧀 4-Cheese Pitmaster Mac & Cheese",
      "🍖 Fall-Off-The-Bone Ribs & Tips",
      "🚚 Punctual & Piping Hot Delivery",
    ],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-08-17T11:05:00.000Z",
    source: "qr-card",
    status: "published",
    copiedToGoogle: true,
  },
];

// Load all stored reviews safely from localStorage
export function getStoredReviews(): CustomerReview[] {
  if (typeof window === "undefined") return SEED_REVIEWS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (raw) {
      const parsed: CustomerReview[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load stored reviews, using seed:", err);
  }

  return SEED_REVIEWS;
}

// Save reviews and broadcast to components
export function saveStoredReviews(reviews: CustomerReview[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(
      new CustomEvent(EVENT_REVIEWS_UPDATED, { detail: reviews })
    );
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Could not save reviews to localStorage:", err);
  }
}

// Add a single review (e.g. from intake form)
export function addCustomerReview(review: Omit<CustomerReview, "id" | "submittedAt">): CustomerReview {
  const newReview: CustomerReview = {
    ...review,
    id: "rev-" + Date.now(),
    submittedAt: new Date().toISOString(),
  };

  const existing = getStoredReviews();
  const nextList = [newReview, ...existing];
  saveStoredReviews(nextList);
  return newReview;
}

// Toggle featured status
export function toggleFeaturedReview(reviewId: string): CustomerReview[] {
  const existing = getStoredReviews();
  const updated = existing.map((r) =>
    r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r
  );
  saveStoredReviews(updated);
  return updated;
}

// React Hook to consume live reviews reactively
export function useCustomerReviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>(SEED_REVIEWS);

  useEffect(() => {
    setReviews(getStoredReviews());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CustomerReview[]>;
      if (customEvent.detail) {
        setReviews(customEvent.detail);
      } else {
        setReviews(getStoredReviews());
      }
    };

    window.addEventListener(EVENT_REVIEWS_UPDATED, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_REVIEWS_UPDATED, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addReview = useCallback((reviewData: Omit<CustomerReview, "id" | "submittedAt">) => {
    return addCustomerReview(reviewData);
  }, []);

  const toggleFeatured = useCallback((reviewId: string) => {
    const updated = toggleFeaturedReview(reviewId);
    setReviews(updated);
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    const existing = getStoredReviews();
    const updated = existing.filter((r) => r.id !== reviewId);
    saveStoredReviews(updated);
    setReviews(updated);
  }, []);

  return {
    reviews,
    addReview,
    toggleFeatured,
    deleteReview,
  };
}

