"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/shared/property-card";
import { properties, cities, facilities } from "@/data/mock";

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("all");

  const filteredProperties = properties.filter((p) => {
    if (selectedType !== "all" && p.type !== selectedType) return false;
    if (selectedCity !== "all" && p.city.slug !== selectedCity) return false;
    if (priceRange.min && p.pricePerNight < parseInt(priceRange.min)) return false;
    if (priceRange.max && p.pricePerNight > parseInt(priceRange.max)) return false;
    if (selectedFacilities.length > 0) {
      const propertyFacilityIds = p.facilities.map((f) => f.id);
      if (!selectedFacilities.every((f) => propertyFacilityIds.includes(f))) return false;
    }
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.pricePerNight - b.pricePerNight;
      case "price_desc":
        return b.pricePerNight - a.pricePerNight;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return b.totalReviews - a.totalReviews;
    }
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Tipe Properti</Label>
        <div className="space-y-2">
          {[
            { value: "all", label: "Semua" },
            { value: "hotel", label: "Hotel" },
            { value: "homestay", label: "Homestay" },
            { value: "apartment", label: "Apartemen" },
          ].map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={selectedType === type.value}
                onChange={(e) => setSelectedType(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* City */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Kota</Label>
        <Select value={selectedCity} onValueChange={(v) => setSelectedCity(v || "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Kota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kota</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.slug}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Rentang Harga</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="text-sm"
          />
          <span className="flex items-center text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Rating Minimum</Label>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
              {rating}+
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Facilities */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Fasilitas</Label>
        <div className="space-y-2">
          {facilities.slice(0, 8).map((facility) => (
            <label key={facility.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedFacilities.includes(facility.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFacilities([...selectedFacilities, facility.id]);
                  } else {
                    setSelectedFacilities(selectedFacilities.filter((f) => f !== facility.id));
                  }
                }}
              />
              <span className="text-sm">{facility.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quick Filters */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Filter Cepat</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm">Gratis Sarapan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm">Bisa Refund</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm">Instant Booking</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm">Promo</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-white mb-2"
          >
            Temukan Penginapan Terbaik
          </motion.h1>
          <p className="text-blue-100">
            {sortedProperties.length} penginapan tersedia
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-blue-600" />
                <h2 className="font-semibold">Filter</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background h-9 px-3 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Active Filters */}
                {selectedType !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedType}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedType("all")}
                    />
                  </Badge>
                )}
                {selectedCity !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {cities.find((c) => c.slug === selectedCity)?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCity("all")}
                    />
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v || "popular")}>
                  <SelectTrigger className="w-[160px] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Populer</SelectItem>
                    <SelectItem value="price_asc">Harga Terendah</SelectItem>
                    <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Terbaik</SelectItem>
                    <SelectItem value="newest">Terbaru</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {sortedProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-2">
                  Tidak ada penginapan yang cocok dengan filter Anda.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedCity("all");
                    setPriceRange({ min: "", max: "" });
                    setSelectedFacilities([]);
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                    : "space-y-4"
                }
              >
                {sortedProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
