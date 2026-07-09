// Client-side storage helpers for wishlist, applied vouchers, and bookings.
// Demo-only; replace with backend APIs in production.

import { promos } from "@/data/mock";
import { Promo } from "@/types";

const WISHLIST_KEY = "staybook_wishlist";

function isBrowser() {
  return typeof window !== "undefined";
}

/* ---------------- Wishlist ---------------- */

export function getWishlist(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(propertyId: string): boolean {
  return getWishlist().includes(propertyId);
}

export function toggleWishlist(propertyId: string): boolean {
  if (!isBrowser()) return false;
  const list = getWishlist();
  let added: boolean;
  let next: string[];
  if (list.includes(propertyId)) {
    next = list.filter((id) => id !== propertyId);
    added = false;
  } else {
    next = [...list, propertyId];
    added = true;
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("staybook-wishlist-changed"));
  return added;
}

/* ---------------- Voucher ---------------- */

export interface VoucherResult {
  ok: boolean;
  error?: string;
  promo?: Promo;
  discount?: number;
}

/**
 * Validates a voucher code against a subtotal and returns the discount amount.
 */
export function applyVoucher(code: string, subtotal: number): VoucherResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { ok: false, error: "Masukkan kode voucher." };
  }

  const promo = promos.find((p) => p.code.toUpperCase() === normalized);
  if (!promo) {
    return { ok: false, error: "Kode voucher tidak ditemukan." };
  }
  if (!promo.isActive) {
    return { ok: false, error: "Voucher sudah tidak aktif." };
  }

  const now = new Date();
  if (new Date(promo.endDate) < now) {
    return { ok: false, error: "Voucher sudah kedaluwarsa." };
  }
  if (promo.usageCount >= promo.usageLimit) {
    return { ok: false, error: "Kuota voucher sudah habis." };
  }
  if (subtotal < promo.minPurchase) {
    return {
      ok: false,
      error: `Minimal transaksi ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(promo.minPurchase)}.`,
    };
  }

  let discount = 0;
  if (promo.type === "percentage" || promo.type === "cashback") {
    discount = Math.round((subtotal * promo.value) / 100);
    if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
  } else {
    discount = promo.value;
  }
  discount = Math.min(discount, subtotal);

  return { ok: true, promo, discount };
}
