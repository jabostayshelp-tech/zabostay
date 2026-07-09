"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cities, facilities } from "@/data/mock";
import { Property } from "@/types";

interface RoomInput {
  id: string;
  name: string;
  description: string;
  capacity: string;
  pricePerNight: string;
  quantity: string;
}

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => void;
}

export interface PropertyFormData {
  name: string;
  type: "hotel" | "homestay" | "apartment";
  cityId: string;
  address: string;
  description: string;
  shortDescription: string;
  stars: number;
  pricePerNight: number;
  pricePerHour?: number;
  originalPrice?: number;
  discount?: number;
  imageUrls: string[];
  facilityIds: string[];
  rooms: RoomInput[];
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  instantBooking: boolean;
  freeBreakfast: boolean;
  refundable: boolean;
}

export function PropertyForm({ property, onSubmit }: PropertyFormProps) {
  const router = useRouter();

  const [name, setName] = useState(property?.name || "");
  const [type, setType] = useState<"hotel" | "homestay" | "apartment">(property?.type || "hotel");
  const [cityId, setCityId] = useState(property?.cityId || "");
  const [address, setAddress] = useState(property?.address || "");
  const [description, setDescription] = useState(property?.description || "");
  const [shortDescription, setShortDescription] = useState(property?.shortDescription || "");
  const [stars, setStars] = useState((property?.stars || 3).toString());
  const [pricePerNight, setPricePerNight] = useState(property?.pricePerNight?.toString() || "");
  const [pricePerHour, setPricePerHour] = useState(property?.pricePerHour?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(property?.originalPrice?.toString() || "");
  const [discount, setDiscount] = useState(property?.discount?.toString() || "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    property?.images.map((img) => img.url) || [""]
  );
  const [facilityIds, setFacilityIds] = useState<string[]>(
    property?.facilities.map((f) => f.id) || []
  );
  const [rooms, setRooms] = useState<RoomInput[]>(
    property?.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description || "",
      capacity: r.capacity.toString(),
      pricePerNight: r.pricePerNight.toString(),
      quantity: r.quantity.toString(),
    })) || [
      { id: `room-${Date.now()}`, name: "", description: "", capacity: "2", pricePerNight: "", quantity: "10" },
    ]
  );
  const [isActive, setIsActive] = useState(property?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(property?.isFeatured ?? false);
  const [isFlashSale, setIsFlashSale] = useState(property?.isFlashSale ?? false);
  const [instantBooking, setInstantBooking] = useState(property?.instantBooking ?? true);
  const [freeBreakfast, setFreeBreakfast] = useState(property?.freeBreakfast ?? false);
  const [refundable, setRefundable] = useState(property?.refundable ?? true);

  const addImageUrl = () => setImageUrls([...imageUrls, ""]);
  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };
  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      { id: `room-${Date.now()}`, name: "", description: "", capacity: "2", pricePerNight: "", quantity: "5" },
    ]);
  };
  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };
  const updateRoom = (index: number, field: keyof RoomInput, value: string) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], [field]: value };
    setRooms(updated);
  };

  const toggleFacility = (facId: string) => {
    setFacilityIds((prev) =>
      prev.includes(facId) ? prev.filter((id) => id !== facId) : [...prev, facId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cityId || !pricePerNight) {
      toast.error("Nama, kota, dan harga per malam wajib diisi.");
      return;
    }

    onSubmit({
      name,
      type,
      cityId,
      address,
      description,
      shortDescription,
      stars: Number(stars),
      pricePerNight: Number(pricePerNight),
      pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discount: discount ? Number(discount) : undefined,
      imageUrls: imageUrls.filter((url) => url.trim() !== ""),
      facilityIds,
      rooms,
      isActive,
      isFeatured,
      isFlashSale,
      instantBooking,
      freeBreakfast,
      refundable,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/properties")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {property ? "Edit Properti" : "Tambah Properti Baru"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {property ? `Mengedit: ${property.name}` : "Isi form berikut untuk menambahkan properti"}
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Properti *</Label>
                  <Input
                    id="name"
                    placeholder="Grand Hyatt Jakarta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipe *</Label>
                    <Select value={type} onValueChange={(v) => setType((v || "hotel") as "hotel" | "homestay" | "apartment")}>
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
                    <Label>Bintang</Label>
                    <Select value={stars} onValueChange={(v) => setStars(v || "3")}>
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
                  <Label>Deskripsi Singkat</Label>
                  <Input
                    placeholder="Hotel bintang 5 di pusat Jakarta"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi Lengkap</Label>
                  <Textarea
                    placeholder="Deskripsi lengkap properti..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lokasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Kota *</Label>
                  <Select value={cityId} onValueChange={(v) => setCityId(v || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Textarea
                    placeholder="Jl. MH Thamrin No.28-30, Jakarta Pusat"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Harga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Harga per Malam (Rp) *</Label>
                    <Input
                      type="number"
                      placeholder="2500000"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Harga per Jam (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="150000"
                      value={pricePerHour}
                      onChange={(e) => setPricePerHour(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Harga Asli (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="3200000"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diskon (%)</Label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gambar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="flex-1"
                      />
                      {imageUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0 text-red-500 hover:bg-red-50"
                          onClick={() => removeImageUrl(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    {url && (
                      <div className="relative h-20 w-32 rounded-lg overflow-hidden border">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Tambah Gambar
                </Button>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fasilitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilities.map((fac) => (
                    <label
                      key={fac.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        facilityIds.includes(fac.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-border hover:border-blue-300"
                      }`}
                    >
                      <Checkbox
                        checked={facilityIds.includes(fac.id)}
                        onCheckedChange={() => toggleFacility(fac.id)}
                      />
                      <span className="text-xs font-medium">{fac.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opsi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive" className="cursor-pointer">Aktif</Label>
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured" className="cursor-pointer">Unggulan (Featured)</Label>
                  <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFlashSale" className="cursor-pointer">Flash Sale</Label>
                  <Switch id="isFlashSale" checked={isFlashSale} onCheckedChange={setIsFlashSale} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="instantBooking" className="cursor-pointer">Instant Booking</Label>
                  <Switch id="instantBooking" checked={instantBooking} onCheckedChange={setInstantBooking} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="freeBreakfast" className="cursor-pointer">Free Breakfast</Label>
                  <Switch id="freeBreakfast" checked={freeBreakfast} onCheckedChange={setFreeBreakfast} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="refundable" className="cursor-pointer">Refundable</Label>
                  <Switch id="refundable" checked={refundable} onCheckedChange={setRefundable} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rooms Section - Full Width */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Kamar</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addRoom}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Tambah Kamar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room, index) => (
              <div key={room.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kamar {index + 1}</span>
                  {rooms.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 h-7"
                      onClick={() => removeRoom(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Hapus
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label className="text-xs">Nama Kamar</Label>
                    <Input
                      placeholder="Deluxe Room"
                      value={room.name}
                      onChange={(e) => updateRoom(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label className="text-xs">Deskripsi</Label>
                    <Input
                      placeholder="Kamar mewah"
                      value={room.description}
                      onChange={(e) => updateRoom(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Kapasitas</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={room.capacity}
                      onChange={(e) => updateRoom(index, "capacity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Harga/Malam</Label>
                    <Input
                      type="number"
                      placeholder="2500000"
                      value={room.pricePerNight}
                      onChange={(e) => updateRoom(index, "pricePerNight", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Jumlah</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={room.quantity}
                      onChange={(e) => updateRoom(index, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/properties")}
          >
            Batal
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            {property ? "Simpan Perubahan" : "Tambah Properti"}
          </Button>
        </div>
      </form>
    </div>
  );
}
