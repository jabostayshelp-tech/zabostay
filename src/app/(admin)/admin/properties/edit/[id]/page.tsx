"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm, PropertyFormData } from "../../_components/property-form";
import { properties, cities, facilities } from "@/data/mock";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Properti Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Properti dengan ID &quot;{propertyId}&quot; tidak dapat ditemukan.
          </p>
          <button
            onClick={() => router.push("/admin/properties")}
            className="text-blue-600 hover:underline"
          >
            Kembali ke daftar properti
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: PropertyFormData) => {
    const city = cities.find((c) => c.id === data.cityId) || cities[0];
    const selectedFacilities = facilities.filter((f) => data.facilityIds.includes(f.id));

    // In a real app, this would update in the backend
    toast.success("Properti berhasil diperbarui!");
    router.push("/admin/properties");
  };

  return <PropertyForm property={property} onSubmit={handleSubmit} />;
}
