"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Hash,
  Plus,
  Minus,
  Calendar,
  Clock,
  CreditCard,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getPropertyById } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const property = getPropertyById(params.id as string);
  const [guestCount, setGuestCount] = useState(1);
  const [guests, setGuests] = useState<string[]>([""]); 
  const [bookingType, setBookingType] = useState<"per_day" | "per_hour">("per_day");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("14:00");

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Properti tidak ditemukan</p>
      </div>
    );
  }

  const room = property.rooms[0];
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  const hours = bookingType === "per_hour" ? Math.max(1, Math.ceil(
    ((parseInt(checkOutTime.split(":")[0]) * 60 + parseInt(checkOutTime.split(":")[1])) -
    (parseInt(checkInTime.split(":")[0]) * 60 + parseInt(checkInTime.split(":")[1]))) / 60
  )) : 0;

  const basePrice = bookingType === "per_day"
    ? room.pricePerNight * nights
    : (room.pricePerHour || 150000) * hours;
  const tax = Math.round(basePrice * 0.11);
  const totalPrice = basePrice + tax;

  const addGuest = () => {
    setGuests([...guests, ""]);
    setGuestCount(guestCount + 1);
  };

  const removeGuest = () => {
    if (guests.length > 1) {
      setGuests(guests.slice(0, -1));
      setGuestCount(guestCount - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/payment/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            Form Reservasi
          </motion.h1>
          <p className="text-blue-100">{property.name}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Type for Apartments */}
              {property.type === "apartment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tipe Booking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={bookingType === "per_day" ? "default" : "outline"}
                        className={`h-auto py-4 ${bookingType === "per_day" ? "bg-blue-600" : ""}`}
                        onClick={() => setBookingType("per_day")}
                      >
                        <div className="text-center">
                          <Calendar className="h-5 w-5 mx-auto mb-1" />
                          <span className="font-semibold">Per Hari</span>
                          <p className="text-xs opacity-80 mt-0.5">{formatCurrency(room.pricePerNight)}/malam</p>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={bookingType === "per_hour" ? "default" : "outline"}
                        className={`h-auto py-4 ${bookingType === "per_hour" ? "bg-blue-600" : ""}`}
                        onClick={() => setBookingType("per_hour")}
                      >
                        <div className="text-center">
                          <Clock className="h-5 w-5 mx-auto mb-1" />
                          <span className="font-semibold">Per Jam</span>
                          <p className="text-xs opacity-80 mt-0.5">{formatCurrency(room.pricePerHour || 150000)}/jam</p>
                        </div>
                      </Button>
                    </div>

                    {bookingType === "per_day" ? (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label>Tanggal Check In</Label>
                          <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label>Tanggal Check Out</Label>
                          <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
                        </div>
                        {checkIn && checkOut && (
                          <div className="col-span-2">
                            <Badge variant="secondary" className="text-sm">
                              Total: {nights} malam
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label>Jam Check In</Label>
                          <Input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label>Jam Check Out</Label>
                          <Input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="mt-1" />
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-sm">
                            Durasi: {hours} jam
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Date for non-apartment */}
              {property.type !== "apartment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tanggal Menginap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tanggal Check In</Label>
                        <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label>Tanggal Check Out</Label>
                        <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
                      </div>
                      {checkIn && checkOut && (
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-sm">
                            Total: {nights} malam
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booker Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Pemesan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nama lengkap" className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="email@example.com" className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Nomor HP</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="08xxxxxxxxxx" className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Alamat</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Alamat lengkap" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Negara</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Indonesia" className="pl-10" defaultValue="Indonesia" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Kota</Label>
                      <Input placeholder="Kota" />
                    </div>
                    <div className="space-y-2">
                      <Label>Kode Pos</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="12345" className="pl-10" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Data */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Data Tamu</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={removeGuest} disabled={guests.length <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{guests.length}</span>
                      <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={addGuest}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {guests.map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Label>Nama Tamu {index + 1}</Label>
                      <Input
                        placeholder={`Nama tamu ${index + 1}`}
                        value={guests[index]}
                        onChange={(e) => {
                          const newGuests = [...guests];
                          newGuests[index] = e.target.value;
                          setGuests(newGuests);
                        }}
                        required
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Permintaan Khusus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm">Smoking</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm">Non-Smoking</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm">Early Check In</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox />
                      <span className="text-sm">Late Check Out</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan Tambahan</Label>
                    <Textarea placeholder="Tulis permintaan khusus Anda..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Ringkasan Booking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm">{property.name}</h4>
                      <p className="text-xs text-muted-foreground">{room.name}</p>
                      <p className="text-xs text-muted-foreground">{property.city.name}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {bookingType === "per_day"
                            ? `${formatCurrency(room.pricePerNight)} x ${nights} malam`
                            : `${formatCurrency(room.pricePerHour || 150000)} x ${hours} jam`}
                        </span>
                        <span>{formatCurrency(basePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pajak (11%)</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Lanjut ke Pembayaran
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3.5 w-3.5 text-green-500" />
                      Pembayaran aman & terenkripsi
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
