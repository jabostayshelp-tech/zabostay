"use client";

import { useState } from "react";
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
  MoreHorizontal,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { properties as initialProperties, cities, facilities } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types";

interface PropertyForm {
  name: string;
  type: "hotel" | "homestay" | "apartment";
  cityId: string;
  address: string;
  description: string;
  shortDescription: string;
  stars: string;
  pricePerNight: string;
  pricePerHour: string;
  originalPrice: string;
  discount: string;
  imageUrl: string;
  facilityIds: string[];
  roomName: string;
  roomDescription: string;
  roomCapacity: string;
  roomPrice: string;
  roomQuantity: string;
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  instantBooking: boolean;
  freeBreakfast: boolean;
  refundable: boolean;
}

const emptyForm: PropertyForm = {
  name: "",
  type: "hotel",
  cityId: "",
  address: "",
  description: "",
  shortDescription: "",
  stars: "3",
  pricePerNight: "",
  pricePerHour: "",
  originalPrice: "",
  discount: "",
  imageUrl: "",
  facilityIds: [],
  roomName: "",
  roomDescription: "",
  roomCapacity: "2",
  roomPrice: "",
  roomQuantity: "10",
  isActive: true,
  isFeatured: false,
  isFlashSale: false,
  instantBooking: true,
  freeBreakfast: false,
  refundable: true,
};

export default function AdminPropertiesPage() {
  const [propertyList, setPropertyList] = useState<Property[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form, setForm] = useState<PropertyForm>(emptyForm);

  const filtered = propertyList.filter((p) => {
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProperty(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setForm({
      name: property.name,
      type: property.type,
      cityId: property.cityId,
      address: property.address,
      description: property.description,
      shortDescription: property.shortDescription,
      stars: (property.stars || 3).toString(),
      pricePerNight: property.pricePerNight.toString(),
      pricePerHour: property.pricePerHour?.toString() || "",
      originalPrice: property.originalPrice?.toString() || "",
      discount: property.discount?.toString() || "",
      imageUrl: property.images[0]?.url || "",
      facilityIds: property.facilities.map((f) => f.id),
      roomName: property.rooms[0]?.name || "",
      roomDescription: property.rooms[0]?.description || "",
      roomCapacity: (property.rooms[0]?.capacity || 2).toString(),
      roomPrice: (property.rooms[0]?.pricePerNight || property.pricePerNight).toString(),
      roomQuantity: (property.rooms[0]?.quantity || 10).toString(),
      isActive: property.isActive,
      isFeatured: property.isFeatured,
      isFlashSale: property.isFlashSale,
      instantBooking: property.instantBooking,
      freeBreakfast: property.freeBreakfast,
      refundable: property.refundable,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPropertyList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Properti berhasil dihapus.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cityId || !form.pricePerNight) {
      toast.error("Nama, kota, dan harga wajib diisi.");
      return;
    }

    const city = cities.find((c) => c.id === form.cityId) || cities[0];
    const selectedFacilities = facilities.filter((f) => form.facilityIds.includes(f.id));
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (editingProperty) {
      setPropertyList((prev) =>
        prev.map((p) =>
          p.id === editingProperty.id
            ? {
                ...p,
                name: form.name,
                slug,
                type: form.type,
                cityId: form.cityId,
                city,
                address: form.address,
                description: form.description,
                shortDescription: form.shortDescription,
                stars: Number(form.stars),
                pricePerNight: Number(form.pricePerNight),
                pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
                originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
                discount: form.discount ? Number(form.discount) : undefined,
                images: form.imageUrl
                  ? [{ id: `img-${Date.now()}`, propertyId: p.id, url: form.imageUrl, alt: form.name, isPrimary: true, order: 1 }]
                  : p.images,
                facilities: selectedFacilities,
                rooms: [
                  {
                    id: p.rooms[0]?.id || `room-${Date.now()}`,
                    propertyId: p.id,
                    name: form.roomName || "Standard Room",
                    description: form.roomDescription || "",
                    capacity: Number(form.roomCapacity) || 2,
                    pricePerNight: Number(form.roomPrice) || Number(form.pricePerNight),
                    pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
                    images: [],
                    facilities: selectedFacilities.slice(0, 3),
                    isAvailable: true,
                    quantity: Number(form.roomQuantity) || 10,
                  },
                ],
                isActive: form.isActive,
                isFeatured: form.isFeatured,
                isFlashSale: form.isFlashSale,
                instantBooking: form.instantBooking,
                freeBreakfast: form.freeBreakfast,
                refundable: form.refundable,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : p
        )
      );
      toast.success("Properti berhasil diperbarui.");
    } else {
      const newId = `prop-${Date.now()}`;
      const newProperty: Property = {
        id: newId,
        name: form.name,
        slug,
        type: form.type,
        cityId: form.cityId,
        city,
        address: form.address,
        description: form.description,
        shortDescription: form.shortDescription,
        latitude: -6.2,
        longitude: 106.8,
        stars: Number(form.stars),
        rating: 0,
        totalReviews: 0,
        pricePerNight: Number(form.pricePerNight),
        pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        images: form.imageUrl
          ? [{ id: `img-${Date.now()}`, propertyId: newId, url: form.imageUrl, alt: form.name, isPrimary: true, order: 1 }]
          : [],
        facilities: selectedFacilities,
        rooms: [
          {
            id: `room-${Date.now()}`,
            propertyId: newId,
            name: form.roomName || "Standard Room",
            description: form.roomDescription || "",
            capacity: Number(form.roomCapacity) || 2,
            pricePerNight: Number(form.roomPrice) || Number(form.pricePerNight),
            pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
            images: [],
            facilities: selectedFacilities.slice(0, 3),
            isAvailable: true,
            quantity: Number(form.roomQuantity) || 10,
          },
        ],
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isFlashSale: form.isFlashSale,
        instantBooking: form.instantBooking,
        freeBreakfast: form.freeBreakfast,
        refundable: form.refundable,
        availableRooms: Number(form.roomQuantity) || 10,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setPropertyList((prev) => [...prev, newProperty]);
      toast.success("Properti berhasil ditambahkan.");
    }

    resetForm();
    setDialogOpen(false);
  };

  const toggleFacility = (facId: string) => {
    setForm((prev) => ({
      ...prev,
      facilityIds: prev.facilityIds.includes(facId)
        ? prev.facilityIds.filter((id) => id !== facId)
        : [...prev.facilityIds, facId],
    }));
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleOpenAdd}>
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

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Properti</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Tipe</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Kota</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Harga</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-right text-xs font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((property) => (
                  <tr key={property.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          {property.images[0]?.url ? (
                            <img
                              src={property.images[0].url}
                              alt={property.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{property.name}</p>
                          <p className="text-xs text-muted-foreground">{property.rooms.length} kamar</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {property.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.city.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">
                        {formatCurrency(property.pricePerNight)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {property.rating}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={property.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {property.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(property)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(property.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Property Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Edit Properti" : "Tambah Properti Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Informasi Dasar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Properti *</Label>
                  <Input
                    placeholder="Grand Hyatt Jakarta"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipe *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: (v || "hotel") as "hotel" | "homestay" | "apartment" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="apartment">Apartemen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kota *</Label>
                  <Select value={form.cityId} onValueChange={(v) => setForm({ ...form, cityId: v || "" })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bintang</Label>
                  <Select value={form.stars} onValueChange={(v) => setForm({ ...form, stars: v || "3" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bintang</SelectItem>
                      <SelectItem value="2">2 Bintang</SelectItem>
                      <SelectItem value="3">3 Bintang</SelectItem>
                      <SelectItem value="4">4 Bintang</SelectItem>
                      <SelectItem value="5">5 Bintang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alamat</Label>
                <Input
                  placeholder="Jl. MH Thamrin No.28-30, Jakarta Pusat"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi Singkat</Label>
                <Input
                  placeholder="Hotel bintang 5 di pusat Jakarta"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi Lengkap</Label>
                <Textarea
                  placeholder="Deskripsi lengkap properti..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Harga</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Harga/Malam (Rp) *</Label>
                  <Input
                    type="number"
                    placeholder="2500000"
                    value={form.pricePerNight}
                    onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Harga/Jam (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="150000"
                    value={form.pricePerHour}
                    onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Harga Asli (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="3200000"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Diskon (%)</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Gambar</h3>
              <div className="space-y-2">
                <Label>URL Gambar Utama</Label>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
                {form.imageUrl && (
                  <div className="mt-2">
                    <img src={form.imageUrl} alt="Preview" className="h-24 w-36 object-cover rounded-lg border" />
                  </div>
                )}
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Fasilitas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {facilities.map((fac) => (
                  <label
                    key={fac.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      form.facilityIds.includes(fac.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : "border-border hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.facilityIds.includes(fac.id)}
                      onChange={() => toggleFacility(fac.id)}
                      className="rounded"
                    />
                    <span className="text-xs">{fac.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Room */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Kamar Utama</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Kamar</Label>
                  <Input
                    placeholder="Deluxe Room"
                    value={form.roomName}
                    onChange={(e) => setForm({ ...form, roomName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi Kamar</Label>
                  <Input
                    placeholder="Kamar mewah dengan pemandangan kota"
                    value={form.roomDescription}
                    onChange={(e) => setForm({ ...form, roomDescription: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kapasitas (orang)</Label>
                  <Input
                    type="number"
                    value={form.roomCapacity}
                    onChange={(e) => setForm({ ...form, roomCapacity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Harga Kamar/Malam (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="2500000"
                    value={form.roomPrice}
                    onChange={(e) => setForm({ ...form, roomPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Kamar</Label>
                  <Input
                    type="number"
                    value={form.roomQuantity}
                    onChange={(e) => setForm({ ...form, roomQuantity: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Opsi</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "isActive", label: "Aktif" },
                  { key: "isFeatured", label: "Unggulan" },
                  { key: "isFlashSale", label: "Flash Sale" },
                  { key: "instantBooking", label: "Instant Booking" },
                  { key: "freeBreakfast", label: "Free Breakfast" },
                  { key: "refundable", label: "Refundable" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[opt.key as keyof PropertyForm] as boolean}
                      onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingProperty ? "Simpan Perubahan" : "Tambah Properti"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
