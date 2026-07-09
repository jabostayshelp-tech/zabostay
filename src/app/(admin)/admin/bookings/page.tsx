"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Download, Search, Filter } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";

const bookings = [
  { id: "STB-001", guest: "Andi Pratama", property: "Grand Hyatt Jakarta", type: "hotel", city: "Jakarta", checkIn: "2024-07-15", checkOut: "2024-07-17", amount: 4400000, status: "confirmed" },
  { id: "STB-002", guest: "Siti Rahayu", property: "Cozy Homestay Depok", type: "homestay", city: "Depok", checkIn: "2024-07-18", checkOut: "2024-07-19", amount: 700000, status: "pending_payment" },
  { id: "STB-003", guest: "Budi Santoso", property: "Sudirman Suites", type: "apartment", city: "Jakarta", checkIn: "2024-07-20", checkOut: "2024-07-20", amount: 825000, status: "paid" },
  { id: "STB-004", guest: "Dewi Lestari", property: "Bumi Surabaya", type: "hotel", city: "Surabaya", checkIn: "2024-07-22", checkOut: "2024-07-24", amount: 3600000, status: "check_in" },
  { id: "STB-005", guest: "Rudi Hermawan", property: "Hotel Santika", type: "hotel", city: "Semarang", checkIn: "2024-07-10", checkOut: "2024-07-12", amount: 1500000, status: "completed" },
  { id: "STB-006", guest: "Maya Kusuma", property: "Urban Living Bekasi", type: "apartment", city: "Bekasi", checkIn: "2024-07-25", checkOut: "2024-07-25", amount: 500000, status: "cancelled" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Menunggu Bayar", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Dibayar", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Dikonfirmasi", color: "bg-green-100 text-green-700" },
  check_in: { label: "Check In", color: "bg-purple-100 text-purple-700" },
  check_out: { label: "Check Out", color: "bg-indigo-100 text-indigo-700" },
  completed: { label: "Selesai", color: "bg-slate-100 text-slate-700" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refund", color: "bg-orange-100 text-orange-700" },
};

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Reservasi</h1>
          <p className="text-muted-foreground">Kelola semua reservasi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari booking..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending_payment">Menunggu Bayar</SelectItem>
                <SelectItem value="paid">Dibayar</SelectItem>
                <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                <SelectItem value="check_in">Check In</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Kota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kota</SelectItem>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="surabaya">Surabaya</SelectItem>
                <SelectItem value="semarang">Semarang</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="w-[160px]" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Kode</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Tamu</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Properti</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Check In/Out</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Total</th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-4 text-sm font-mono text-blue-600">{booking.id}</td>
                    <td className="p-4 text-sm font-medium">{booking.guest}</td>
                    <td className="p-4">
                      <p className="text-sm">{booking.property}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.type} &middot; {booking.city}</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{booking.checkIn}<br/>{booking.checkOut}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(booking.amount)}</td>
                    <td className="p-4">
                      <Badge className={statusMap[booking.status]?.color || ""}>
                        {statusMap[booking.status]?.label || booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
