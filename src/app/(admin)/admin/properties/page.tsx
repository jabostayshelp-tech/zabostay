"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { properties as initialProperties } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types";

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [propertyList, setPropertyList] = useState<Property[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = propertyList.filter((p) => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setPropertyList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Properti berhasil dihapus.");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Master Properti</h1>
          <p className="text-muted-foreground">
            Kelola hotel, homestay, dan apartemen
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push("/admin/properties/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Properti
        </Button>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari properti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v || "all")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="homestay">Homestay</SelectItem>
                <SelectItem value="apartment">Apartemen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {property.images[0]?.url ? (
                  <img
                    src={property.images[0].url}
                    alt={property.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 text-xs capitalize backdrop-blur-sm">
                    {property.type === "apartment" ? "Apartemen" : property.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={property.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                    {property.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                {property.discount && property.discount > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-red-500 text-white text-xs font-semibold">
                      -{property.discount}%
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base line-clamp-1">{property.name}</h3>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="text-xs line-clamp-1">{property.city.name}</span>
                </div>

                {/* Stars */}
                {property.stars && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(property.stars)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-end justify-between pt-2 border-t border-border/50">
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

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/properties/${property.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Lihat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/properties/edit/${property.id}`)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Tidak ada properti ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau tambahkan properti baru</p>
        </div>
      )}
    </div>
  );
}
