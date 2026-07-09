"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/data/mock";

export function HeroSection() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    type: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.city) params.set("city", searchData.city);
    if (searchData.type && searchData.type !== "all")
      params.set("type", searchData.type);
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut);
    if (searchData.guests) params.set("guests", searchData.guests);
    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ""}`);
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Temukan Penginapan
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Premium di Indonesia
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Hotel mewah, Homestay nyaman, dan Apartemen modern dengan harga terbaik
          </motion.p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass rounded-2xl p-6 md:p-8 max-w-5xl mx-auto shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Kota
              </Label>
              <Select
                value={searchData.city}
                onValueChange={(v) => setSearchData({ ...searchData, city: v || "" })}
              >
                <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Pilih Kota" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.slug}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Check In */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Check In
              </Label>
              <Input
                type="date"
                value={searchData.checkIn}
                onChange={(e) =>
                  setSearchData({ ...searchData, checkIn: e.target.value })
                }
                className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Check Out */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Check Out
              </Label>
              <Input
                type="date"
                value={searchData.checkOut}
                onChange={(e) =>
                  setSearchData({ ...searchData, checkOut: e.target.value })
                }
                className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Tamu
              </Label>
              <Select
                value={searchData.guests}
                onValueChange={(v) =>
                  setSearchData({ ...searchData, guests: v || "2" })
                }
              >
                <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} Tamu
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Jenis
              </Label>
              <Select
                value={searchData.type}
                onValueChange={(v) =>
                  setSearchData({ ...searchData, type: v || "" })
                }
              >
                <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="homestay">Homestay</SelectItem>
                  <SelectItem value="apartment">Apartemen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              size="lg"
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-600/25 rounded-xl"
            >
              <Search className="h-4 w-4 mr-2" />
              Cari Penginapan
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center gap-8 md:gap-16 mt-10"
        >
          {[
            { label: "Penginapan", value: "5,000+" },
            { label: "Kota", value: "7+" },
            { label: "Pelanggan", value: "100K+" },
            { label: "Review", value: "50K+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-slate-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
