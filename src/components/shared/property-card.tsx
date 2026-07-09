"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, Zap, Coffee, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/properties/${property.id}`}>
        <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={primaryImage?.url || "/images/placeholder.jpg"}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {property.discount && property.discount > 0 && (
                <Badge className="bg-red-500 text-white text-xs font-semibold">
                  -{property.discount}%
                </Badge>
              )}
              {property.isFlashSale && (
                <Badge className="bg-amber-500 text-white text-xs font-semibold">
                  <Zap className="h-3 w-3 mr-0.5" />
                  Flash Sale
                </Badge>
              )}
              {property.instantBooking && (
                <Badge className="bg-green-500 text-white text-xs font-semibold">
                  Instant
                </Badge>
              )}
            </div>

            {/* Wishlist */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4 text-slate-600" />
            </Button>

            {/* Type Badge */}
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="bg-white/90 dark:bg-slate-900/90 text-xs capitalize backdrop-blur-sm"
              >
                {property.type === "apartment" ? "Apartemen" : property.type}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            {/* Title & Rating */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-blue-600 transition-colors">
                {property.name}
              </h3>
              <div className="flex items-center gap-0.5 shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{property.rating}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="text-xs line-clamp-1">{property.city.name} - {property.address.split(",")[0]}</span>
            </div>

            {/* Stars */}
            {property.stars && (
              <div className="flex items-center gap-0.5">
                {[...Array(property.stars)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            )}

            {/* Features */}
            <div className="flex items-center gap-2 flex-wrap">
              {property.freeBreakfast && (
                <span className="flex items-center gap-0.5 text-xs text-green-600 dark:text-green-400">
                  <Coffee className="h-3 w-3" />
                  Sarapan
                </span>
              )}
              {property.refundable && (
                <span className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400">
                  <RotateCcw className="h-3 w-3" />
                  Refundable
                </span>
              )}
            </div>

            {/* Price */}
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-end justify-between">
                <div>
                  {property.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(property.originalPrice)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(property.pricePerNight)}
                    </span>
                    <span className="text-xs text-muted-foreground">/malam</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {property.totalReviews} review
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
