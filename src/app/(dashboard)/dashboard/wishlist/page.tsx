"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PropertyCard } from "@/components/shared/property-card";
import { properties } from "@/data/mock";

export default function WishlistPage() {
  const wishlistProperties = properties.slice(0, 4);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-muted-foreground">Penginapan yang Anda simpan</p>
      </motion.div>

      {wishlistProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-3 text-red-200" />
          <p className="font-medium">Wishlist Anda masih kosong</p>
          <p className="text-sm mt-1">Simpan penginapan favorit Anda di sini</p>
        </div>
      )}
    </div>
  );
}
