"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Wifi,
  Wind,
  Tv,
  Waves,
  Car,
  Dumbbell,
  Coffee,
  ChefHat,
  TreePine,
  Users,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPropertyById, properties } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { PropertyCard } from "@/components/shared/property-card";
import { isInWishlist, toggleWishlist } from "@/lib/storage";

const facilityIcons: Record<string, React.ElementType> = {
  Wifi,
  Wind,
  Tv,
  Waves,
  Car,
  Dumbbell,
  Coffee,
  ChefHat,
  TreePine,
  WashingMachine: Wind,
  Cigarette: Coffee,
  UtensilsCrossed: ChefHat,
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const property = getPropertyById(propertyId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingType, setBookingType] = useState<"per_day" | "per_hour">("per_day");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(isInWishlist(propertyId));
    const handler = () => setWishlisted(isInWishlist(propertyId));
    window.addEventListener("staybook-wishlist-changed", handler);
    return () => window.removeEventListener("staybook-wishlist-changed", handler);
  }, [propertyId]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Properti tidak ditemukan</p>
      </div>
    );
  }

  const similarProperties = properties
    .filter((p) => p.type === property.type && p.id !== property.id)
    .slice(0, 4);

  const handleWishlist = () => {
    const added = toggleWishlist(property.id);
    setWishlisted(added);
    toast[added ? "success" : "info"](
      added
        ? `${property.name} ditambahkan ke wishlist`
        : `${property.name} dihapus dari wishlist`
    );
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: property.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link properti disalin ke clipboard");
      }
    } catch {
      // user cancelled share dialog; ignore
    }
  };

  const goToBooking = () => {
    const params = new URLSearchParams();
    params.set("type", bookingType);
    if (bookingType === "per_day") {
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
    } else {
      if (checkInTime) params.set("checkInTime", checkInTime);
      if (checkOutTime) params.set("checkOutTime", checkOutTime);
    }
    params.set("guests", guests);
    router.push(`/booking/${property.id}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery */}
      <section className="relative">
        <div className="relative h-[300px] md:h-[450px] lg:h-[500px] overflow-hidden">
          <Image
            src={property.images[currentImageIndex]?.url || ""}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev - 1 + property.images.length) % property.images.length
                  )
                }
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
                }
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/80 hover:bg-white rounded-full"
              onClick={handleWishlist}
              aria-label="Wishlist"
            >
              <Heart
                className={`h-4 w-4 ${
                  wishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/80 hover:bg-white rounded-full"
              onClick={handleShare}
              aria-label="Bagikan"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {property.images.length > 1 && (
          <div className="hidden md:flex gap-2 p-4 container mx-auto max-w-7xl overflow-x-auto">
            {property.images.map((img, idx) => (
              <button
                key={img.id}
                className={`relative h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === currentImageIndex ? "border-blue-600" : "border-transparent"
                }`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <Image src={img.url} alt={img.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                      {property.type === "apartment" ? "Apartemen" : property.type}
                    </Badge>
                    {property.stars && (
                      <div className="flex items-center">
                        {[...Array(property.stars)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.address}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                    <Star className="h-4 w-4 fill-white" />
                    <span className="font-bold">{property.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {property.totalReviews} review
                  </span>
                </div>
              </div>
            </motion.div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                <TabsTrigger value="rooms">Kamar</TabsTrigger>
                <TabsTrigger value="reviews">Review</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Deskripsi</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Map Placeholder */}
                <div>
                  <h3 className="font-semibold mb-2">Lokasi</h3>
                  <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Google Maps</p>
                      <p className="text-xs">{property.address}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="facilities" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.facilities.map((facility) => {
                    const Icon = facilityIcons[facility.icon] || Wifi;
                    return (
                      <div
                        key={facility.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{facility.name}</span>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="mt-6 space-y-4">
                {property.rooms.map((room) => (
                  <Card key={room.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {room.description}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {room.capacity} tamu
                            </span>
                            <span className="flex items-center gap-1">
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              {room.quantity} kamar tersedia
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {room.facilities.map((f) => (
                              <Badge key={f.id} variant="secondary" className="text-xs">
                                {f.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {room.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(room.originalPrice)}
                            </span>
                          )}
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(room.pricePerNight)}
                          </div>
                          <span className="text-xs text-muted-foreground">/malam</span>
                          {room.pricePerHour && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(room.pricePerHour)}/jam
                            </div>
                          )}
                          <Link href={`/booking/${property.id}?room=${room.id}`}>
                            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                              Pilih Kamar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-10 w-10 mx-auto mb-2 text-amber-400" />
                  <p className="font-semibold text-lg">{property.rating}/5</p>
                  <p className="text-sm">{property.totalReviews} review dari tamu</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Booking Sekarang</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div>
                    {property.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(property.originalPrice)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(property.pricePerNight)}
                      </span>
                      <span className="text-sm text-muted-foreground">/malam</span>
                    </div>
                    {property.pricePerHour && (
                      <p className="text-sm text-muted-foreground">
                        atau {formatCurrency(property.pricePerHour)}/jam
                      </p>
                    )}
                  </div>

                  {/* Booking Type (for apartments) */}
                  {property.type === "apartment" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipe Booking</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={bookingType === "per_day" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBookingType("per_day")}
                          className={bookingType === "per_day" ? "bg-blue-600" : ""}
                        >
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Per Hari
                        </Button>
                        <Button
                          variant={bookingType === "per_hour" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBookingType("per_hour")}
                          className={bookingType === "per_hour" ? "bg-blue-600" : ""}
                        >
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Per Jam
                        </Button>
                      </div>
                    </div>
                  )}

                  {bookingType === "per_day" ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Check In</label>
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Check Out</label>
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Jam Check In</label>
                          <input
                            type="time"
                            value={checkInTime}
                            onChange={(e) => setCheckInTime(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Jam Check Out</label>
                          <input
                            type="time"
                            value={checkOutTime}
                            onChange={(e) => setCheckOutTime(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Guests */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Jumlah Tamu</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} Tamu
                        </option>
                      ))}
                    </select>
                  </div>

                  <Separator />

                  {/* Features */}
                  <div className="space-y-2">
                    {property.freeBreakfast && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        Gratis Sarapan
                      </div>
                    )}
                    {property.refundable && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        Gratis Pembatalan
                      </div>
                    )}
                    {property.instantBooking && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        Konfirmasi Instan
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={goToBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                  >
                    Booking Sekarang
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {property.availableRooms} kamar tersisa
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-6">Penginapan Serupa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProperties.map((p, index) => (
                <PropertyCard key={p.id} property={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
