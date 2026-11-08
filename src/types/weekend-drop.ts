export interface WeekendDropOption {
  id: string;
  title: string;
  price: number;
  description: string;
  badge?: string;
  includedSides?: string[];
}

export interface WeekendDrop {
  id: string;
  title: string;
  eventDate: string; // e.g. "2026-11-14"
  eventDateLabel: string; // e.g. "This Saturday, November 14th"
  orderCutoffDate: string; // e.g. "2026-11-11"
  orderCutoffLabel: string; // e.g. "Wednesday, Nov 11 by 11:59 PM"
  pickupTime: string; // e.g. "4:00 PM"
  pickupLocation: string; // e.g. "Mason Ave Hub (Exact address texted upon reservation)"
  deliveryAvailable: boolean;
  deliveryStartTime: string; // e.g. "5:00 PM"
  deliveryNotes: string;
  zellePhone: string;
  zelleEmail: string;
  isActive: boolean;
  options: WeekendDropOption[];
  notice: string;
  updatedAt?: string;
}

export interface WeekendDropOrder {
  id: string;
  ticketNumber: string;
  dropId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: "pickup" | "delivery";
  deliveryAddress?: string;
  deliveryFee: number;
  items: {
    optionId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  total: number;
  paymentMethod: "zelle" | "stripe" | "pending";
  paymentStatus: "awaiting_zelle" | "zelle_verified" | "paid_stripe";
  orderNotes?: string;
  createdAt: string;
}

