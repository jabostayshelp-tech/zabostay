"use client";

import { motion } from "framer-motion";
import { Hotel, Home, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { properties } from "@/data/mock";

const categories = [
  { type: "hotel" as const, label: "Hotel", icon: Hotel, description: "Hotel berbintang dengan fasilitas premium" },
  { type: "homestay" as const, label: "Homestay", icon: Home, description: "Suasana rumahan yang nyaman dan hangat" },
  { type: "apartment" as const, label: "Apartemen", icon: Building2, description: "Modern living dengan booking fleksibel" },
];

export function RecommendationsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        {categories.map((category, catIndex) => {
          const categoryProperties = properties
            .filter((p) => p.type === category.type)
            .slice(0, 4);

          if (categoryProperties.length === 0) return null;

          return (
            <div key={category.type} className={catIndex > 0 ? "mt-16" : ""}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      Rekomendasi {category.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Link href={`/properties?type=${category.type}`}>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    Lihat Semua
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {categoryProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={index}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
