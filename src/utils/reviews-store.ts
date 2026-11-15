"use client";

import { useEffect, useState, useCallback } from "react";
import { CustomerReview } from "@/types/reviews";

export const STORAGE_KEY_REVIEWS = "ats_customer_reviews_v1";
export const EVENT_REVIEWS_UPDATED = "ats-reviews-updated";
export const GOOGLE_REVIEW_URL = "https://g.page/r/CfFd-sBgX_THECE/review";

export const SEED_REVIEWS: CustomerReview[] = [
  {
    id: "gbp-marcus-fuller-2026-11-15",
    clientName: "Marcus Fuller",
    eventType: "Google Review",
    reviewerBadge: "Local Guide",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText: "Food was delicious well seasoned and fresh",
    favoriteHighlights: ["🔥 Fresh & Well Seasoned"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T21:14:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Appreciate the 5 stars, Marcus! Keeping everything fresh off the pit and seasoned right is what we care about most. Glad you enjoyed it. — Marion",
  },
  {
    id: "gbp-chris-hackett-2026-11-15",
    clientName: "Chris Hackett",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText:
      "All The Smoke is all the rage baby! Everything that I've tried has been tender, juicy, well seasoned and delicious!",
    favoriteHighlights: ["🍖 Tender & Juicy"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T21:11:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Love that energy, Chris! Making sure every cut comes off tender and juicy is the whole goal around here. Good looking out on the support! – Marion",
  },
  {
    id: "gbp-nel-c-2026-11-15",
    clientName: "Nel C",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText:
      "Always flavorful, mouth-watering options each week. You can taste the tender loving care the chef puts in these meals!",
    favoriteHighlights: ["👨‍🍳 Weekly Favorites"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T21:04:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Nel, hearing that you notice the care in every weekly menu really makes my day. Thanks for rocking with us week after week! – Chef Marion",
  },
  {
    id: "gbp-justin-raglin-2026-11-15",
    clientName: "Justin Raglin",
    eventType: "Google Review",
    reviewerBadge: "Local Guide",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText: "Great service and great food",
    favoriteHighlights: [],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T20:20:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Thank you so much for the 5 stars, Justin! We appreciate you supporting All The Smoke BBQ & Catering and are glad both the food and service hit the mark. Hope to smoke for you again soon! — Marion, All The Smoke BBQ & Catering",
  },
  {
    id: "gbp-adrienne-bolden-2026-11-15",
    clientName: "Adrienne Bolden",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText:
      "Some of the most amazing and consistent cuisine around. The brisket was to die for. Anyone looking for GOOD BBQ.... Give him a try. You won’t be disappointed 😊",
    favoriteHighlights: ["🔥 Slow-Smoked Brisket"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T19:40:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Thank you for the kind words, Adrienne! That brisket gets a lot of love on the post-oak pit, so hearing it hit the spot every time means a lot to our team. We appreciate your support and look forward to serving you again in Chicago! — Marion, All The Smoke BBQ & Catering",
  },
  {
    id: "gbp-latrina-harrington-2026-11-15",
    clientName: "Latrina Harrington",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText: "Good Food with Generous portions.",
    favoriteHighlights: ["🍖 Generous Portions"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T17:40:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Thank you, Latrina! We always want everyone leaving full and happy, so we’re glad you enjoyed the food and portions. Appreciate you choosing All The Smoke BBQ & Catering! — Marion, All The Smoke BBQ & Catering",
  },
];

// Load all stored reviews safely from localStorage, merging verified seed reviews
export function getStoredReviews(): CustomerReview[] {
  if (typeof window === "undefined") return SEED_REVIEWS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (raw) {
      const parsed: CustomerReview[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((r) => r.id));
        const missingSeeds = SEED_REVIEWS.filter((s) => !existingIds.has(s.id));
        return missingSeeds.length > 0 ? [...missingSeeds, ...parsed] : parsed;
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

