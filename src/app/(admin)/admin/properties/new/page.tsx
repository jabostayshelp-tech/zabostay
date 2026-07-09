"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm, PropertyFormData } from "../_components/property-form";
import { cities, facilities } from "@/data/mock";
import { Property } from "@/types";

export default function NewPropertyPage() {
  const router = useRouter();

  const handleSubmit = (data: PropertyFormData) => {
    const city = cities.find((c) => c.id === data.cityId) || cities[0];
    const selectedFacilities = facilities.filter((f) => data.facilityIds.includes(f.id));
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const newId = `prop-${Date.now()}`;

    const newProperty: Property = {
      id: newId,
      name: data.name,
      slug,
      type: data.type,
      cityId: data.cityId,
      city,
      address: data.address,
      description: data.description,
      shortDescription: data.shortDescription,
      latitude: -6.2,
      longitude: 106.8,
      stars: data.stars,
      rating: 0,
      totalReviews: 0,
      pricePerNight: data.pricePerNight,
      pricePerHour: data.pricePerHour,
      originalPrice: data.originalPrice,
      discount: data.discount,
      images: data.imageUrls.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        propertyId: newId,
        url,
        alt: data.name,
        isPrimary: i === 0,
        order: i + 1,
      })),
      facilities: selectedFacilities,
      rooms: data.rooms.map((room, i) => ({
        id: room.id || `room-${Date.now()}-${i}`,
        propertyId: newId,
        name: room.name || "Standard Room",
        description: room.description || "",
        capacity: Number(room.capacity) || 2,
        pricePerNight: Number(room.pricePerNight) || data.pricePerNight,
        pricePerHour: data.pricePerHour,
        images: [],
        facilities: selectedFacilities.slice(0, 3),
        isAvailable: true,
        quantity: Number(room.quantity) || 10,
      })),
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isFlashSale: data.isFlashSale,
      instantBooking: data.instantBooking,
      freeBreakfast: data.freeBreakfast,
      refundable: data.refundable,
      availableRooms: data.rooms.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    // In a real app, this would save to backend
    toast.success("Properti berhasil ditambahkan!");
    router.push("/admin/properties");
  };

  return <PropertyForm onSubmit={handleSubmit} />;
}
