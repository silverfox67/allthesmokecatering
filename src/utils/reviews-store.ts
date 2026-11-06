"use client";

import { useEffect, useState, useCallback } from "react";
import { CustomerReview } from "@/types/reviews";

export const STORAGE_KEY_REVIEWS = "ats_customer_reviews_v1";
export const EVENT_REVIEWS_UPDATED = "ats-reviews-updated";
export const GOOGLE_REVIEW_URL = "https://g.page/r/allthesmokecatering/review";

export const SEED_REVIEWS: CustomerReview[] = [];

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

