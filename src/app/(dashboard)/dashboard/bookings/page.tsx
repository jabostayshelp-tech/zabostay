"use client";

import { motion } from "framer-motion";
import { Hotel, Calendar, Clock, MapPin, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

const statusMap: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Menunggu Bayar", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30" },
  paid: { label: "Dibayar", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30" },
  confirmed: { label: "Dikonfirmasi", color: "bg-green-100 text-green-700 dark:bg-green-900/30" },
  check_in: { label: "Check In", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30" },
  check_out: { label: "Check Out", color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30" },
  completed: { label: "Selesai", color: "bg-green-100 text-green-700 dark:bg-green-900/30" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700 dark:bg-red-900/30" },
  refunded: { label: "Refund", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30" },
};

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Booking Saya</h1>
        <p className="text-muted-foreground">Kelola semua reservasi Anda</p>
      </motion.div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
          <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {mockBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Icon */}
                    <div className="h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Hotel className="h-7 w-7 text-blue-600" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{booking.property.name}</h3>
                          <p className="text-sm text-muted-foreground">{booking.room.name}</p>
                        </div>
                        <Badge className={statusMap[booking.status]?.color || ""}>
                          {statusMap[booking.status]?.label || booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.property.city.name}
                        </span>
                        {booking.bookingType === "per_day" ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {booking.checkIn} - {booking.checkOut} ({booking.totalNights} malam)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.checkInTime} - {booking.checkOutTime} ({booking.totalHours} jam)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <code className="text-xs text-blue-600 font-mono">
                          {booking.bookingCode}
                        </code>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">
                            {formatCurrency(booking.totalPrice)}
                          </span>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="text-center py-12 text-muted-foreground">
            <Hotel className="h-12 w-12 mx-auto mb-3 text-blue-200" />
            <p>Booking aktif Anda akan tampil di sini</p>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="text-center py-12 text-muted-foreground">
            <Hotel className="h-12 w-12 mx-auto mb-3 text-green-200" />
            <p>Booking selesai akan tampil di sini</p>
          </div>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <div className="text-center py-12 text-muted-foreground">
            <Hotel className="h-12 w-12 mx-auto mb-3 text-red-200" />
            <p>Tidak ada booking yang dibatalkan</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
