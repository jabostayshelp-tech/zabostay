// ============ DATABASE TYPES ============

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'superadmin';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  image: string;
  province: string;
  isActive: boolean;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  type: 'hotel' | 'homestay' | 'apartment';
  cityId: string;
  city: City;
  address: string;
  description: string;
  shortDescription: string;
  latitude: number;
  longitude: number;
  stars?: number;
  rating: number;
  totalReviews: number;
  pricePerNight: number;
  pricePerHour?: number;
  originalPrice?: number;
  discount?: number;
  images: PropertyImage[];
  videos?: PropertyVideo[];
  facilities: Facility[];
  rooms: Room[];
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  instantBooking: boolean;
  freeBreakfast: boolean;
  refundable: boolean;
  availableRooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface PropertyVideo {
  id: string;
  propertyId: string;
  url: string;
  title: string;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  pricePerHour?: number;
  originalPrice?: number;
  images: string[];
  facilities: Facility[];
  isAvailable: boolean;
  quantity: number;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  propertyId: string;
  property: Property;
  roomId: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  checkInTime?: string;
  checkOutTime?: string;
  bookingType: 'per_day' | 'per_hour';
  totalNights?: number;
  totalHours?: number;
  guests: Guest[];
  totalGuests: number;
  specialRequests?: SpecialRequest;
  subtotal: number;
  discount: number;
  tax: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'check_in'
  | 'check_out'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface Guest {
  id: string;
  bookingId: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface SpecialRequest {
  smoking: boolean;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  notes?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  expiredAt?: string;
  qrisUrl?: string;
  vaNumber?: string;
  createdAt: string;
}

export type PaymentMethod = 
  | 'qris'
  | 'gopay'
  | 'va_bca'
  | 'va_mandiri'
  | 'va_bni'
  | 'va_bri'
  | 'va_permata'
  | 'credit_card'
  | 'ewallet';

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'refund' | 'failed';

export interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'cashback';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  image?: string;
}

export interface Voucher {
  id: string;
  userId: string;
  promoId: string;
  promo: Promo;
  isUsed: boolean;
  usedAt?: string;
  expiresAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  propertyId: string;
  bookingId: string;
  rating: number;
  comment: string;
  images?: string[];
  videos?: string[];
  adminReply?: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'promo' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

// ============ SEARCH & FILTER TYPES ============

export interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  type?: 'hotel' | 'homestay' | 'apartment';
}

export interface FilterParams {
  priceMin?: number;
  priceMax?: number;
  stars?: number[];
  rating?: number;
  facilities?: string[];
  area?: string;
  type?: string;
  hasPromo?: boolean;
  freeBreakfast?: boolean;
  refundable?: boolean;
  instantBooking?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'newest';
}

// ============ FORM TYPES ============

export interface BookingFormData {
  // Booker info
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  bookerAddress: string;
  bookerCountry: string;
  bookerCity: string;
  bookerPostalCode: string;
  // Guests
  guests: { name: string }[];
  // Special requests
  smoking: boolean;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  notes: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// ============ DASHBOARD STATS ============

export interface CustomerStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  activeVouchers: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  totalProperties: number;
  revenueGrowth: number;
  bookingGrowth: number;
  monthlyRevenue: { month: string; revenue: number }[];
  bookingsByType: { type: string; count: number }[];
  topProperties: { name: string; bookings: number; revenue: number }[];
}
