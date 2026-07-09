"use client";

import { motion } from "framer-motion";
import { Zap, Gift, Clock, Percent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { promos, properties, getFlashSaleProperties } from "@/data/mock";
import { PropertyCard } from "@/components/shared/property-card";
import { formatCurrency } from "@/lib/utils";

export function PromoSection() {
  const flashSaleProperties = getFlashSaleProperties();

  return (
    <>
      {/* Promo Cards */}
      <section className="py-16 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Gift className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Promo Hari Ini</h2>
              <p className="text-sm text-muted-foreground">
                Jangan lewatkan penawaran menarik
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {promos.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                  <Badge className="bg-white/20 text-white border-0 mb-3">
                    {promo.type === "percentage" && <Percent className="h-3 w-3 mr-1" />}
                    {promo.type === "fixed" && <Gift className="h-3 w-3 mr-1" />}
                    {promo.type === "cashback" && <Zap className="h-3 w-3 mr-1" />}
                    {promo.type === "percentage"
                      ? `Diskon ${promo.value}%`
                      : promo.type === "fixed"
                      ? formatCurrency(promo.value)
                      : `Cashback ${promo.value}%`}
                  </Badge>
                  <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                  <p className="text-sm text-blue-100 mb-4">{promo.description}</p>
                  <div className="flex items-center justify-between">
                    <code className="bg-white/20 px-3 py-1 rounded text-sm font-mono">
                      {promo.code}
                    </code>
                    <span className="text-xs text-blue-200 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Berakhir {promo.endDate}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      {flashSaleProperties.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center animate-pulse">
                  <Zap className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    Flash Sale
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      LIVE
                    </Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Penawaran terbatas, booking sekarang!
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="text-red-600 hover:text-red-700">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {flashSaleProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Properties */}
      <section className="py-16 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Penginapan Terlaris</h2>
              <p className="text-sm text-muted-foreground">
                Paling banyak dibooking bulan ini
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {properties.slice(0, 4).map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
