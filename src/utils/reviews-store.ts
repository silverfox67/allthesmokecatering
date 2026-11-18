"use client";

import { useEffect, useState, useCallback } from "react";
import { CustomerReview } from "@/types/reviews";

export const STORAGE_KEY_REVIEWS = "ats_customer_reviews_v1";
export const EVENT_REVIEWS_UPDATED = "ats-reviews-updated";
export const GOOGLE_REVIEW_URL = "https://g.page/r/CfFd-sBgX_THECE/review";

export const SEED_REVIEWS: CustomerReview[] = [
  {
    id: "gbp-pashian-hobson-2026-11-17",
    clientName: "Pashian Hobson",
    eventType: "Graduation Party Catering",
    displayDate: "Nov 17, 2026",
    rating: 5,
    reviewText:
      "We had All The Smoke BBQ & Catering cater my son’s graduation party, and everything was amazing! The food was fresh, delicious, and seasoned perfectly. The prices were very reasonable, and the service took so much pressure off me. I didn’t have to worry about a thing when it came to food. All we had to do was show up and enjoy! Highly recommend!",
    favoriteHighlights: ["🎓 Graduation Catering", "🔥 Fresh & Well Seasoned"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-17T20:00:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Pashian, taking that food pressure off you so your family could just show up and enjoy your son's graduation is exactly what we aim for. Glad the flavors and pricing hit the mark for everyone. Reach out anytime you're hosting again. – Chef Marion",
  },
  {
    id: "gbp-tatiana-johnson-2026-11-17",
    clientName: "Tatiana Johnson",
    eventType: "Google Review",
    displayDate: "Nov 17, 2026",
    rating: 5,
    reviewText:
      "Those smoke beef ribs were delicious and tender. I must say every plate I've ordered from All the Smoke has been a treat and a delight. It does not disappoint. I always wish I ordered more.",
    favoriteHighlights: ["🍖 Smoked Beef Ribs", "🔥 Tender & Delicious"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-17T19:30:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Those smoked beef ribs get plenty of love on the pit, Tatiana, so we're glad every plate has kept you coming back. Whenever you're ready for another round, we'll have the smoker rolling for you! – Marion, All The Smoke",
  },
  {
    id: "gbp-cordel-summers-2026-11-15",
    clientName: "Cordel Summers",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText:
      "Best catering food business in Chicago! It was great doing business with them 🙌🏾 Customer service and food quality is excellent and delicious! I would highly recommend them for your next party or anniversary!",
    favoriteHighlights: ["🔥 Event Catering", "🤝 Great Service"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-16T02:00:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Serving you and your guests in Chicago was a pleasure, Cordel. We put real care into keeping both the food hot and the setup smooth for parties and anniversaries. Anytime you have another celebration coming up, give us a call. – Marion, All The Smoke",
  },
  {
    id: "gbp-jeanette-allen-2026-11-15",
    clientName: "Jeanette Allen",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText:
      "I really enjoyed my food! Everything was seasoned to perfection. Hats off to the Chef , You never miss",
    favoriteHighlights: ["🔥 Seasoned to Perfection"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T23:00:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Jeanette, that plate photo looks right. Mac and cheese, candied yams, and gravy-covered chicken take real time to season properly, so hearing you noticed every bite means a lot. Appreciate you sharing the love. – Chef Marion",
  },
  {
    id: "gbp-d-robinson-2026-11-15",
    clientName: "D. Robinson",
    eventType: "Google Review",
    displayDate: "Nov 15, 2026",
    rating: 5,
    reviewText: "Delicious BBQ & great service!!!!!!",
    favoriteHighlights: ["🍖 Delicious BBQ", "🤝 Great Service"],
    permissionToFeature: true,
    isFeatured: true,
    submittedAt: "2026-11-15T22:55:00.000Z",
    source: "google",
    status: "published",
    adminResponse:
      "Glad the BBQ and the service both hit the spot. Everything comes off our Chicago pit smoked low over split wood, and we try to keep the hospitality just as steady. Hope we get to cook for you again soon!",
  },
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
        const seedById = new Map(SEED_REVIEWS.map((s) => [s.id, s]));
        const synced = parsed.map((r) => {
          const seed = seedById.get(r.id);
          return seed && !r.adminResponse && seed.adminResponse
            ? { ...r, adminResponse: seed.adminResponse }
            : r;
        });
        const existingIds = new Set(synced.map((r) => r.id));
        const missingSeeds = SEED_REVIEWS.filter((s) => !existingIds.has(s.id));
        return missingSeeds.length > 0 ? [...missingSeeds, ...synced] : synced;
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

