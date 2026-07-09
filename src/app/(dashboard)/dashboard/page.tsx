"use client";

import { motion } from "framer-motion";
import { Hotel, CalendarCheck, CheckCircle2, Gift, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBookings, mockVouchers, mockNotifications } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { label: "Total Booking", value: "12", icon: Hotel, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  { label: "Booking Aktif", value: "2", icon: CalendarCheck, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
  { label: "Booking Selesai", value: "10", icon: CheckCircle2, color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
  { label: "Voucher Aktif", value: "3", icon: Gift, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
];

export default function DashboardPage() {
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Halo, Andi! 👋</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali di StayBook Indonesia
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Booking Terbaru</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-blue-600">
                Lihat Semua
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Hotel className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {booking.property.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.bookingCode}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "default" : "secondary"
                    }
                    className={
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30"
                    }
                  >
                    {booking.status === "confirmed"
                      ? "Dikonfirmasi"
                      : "Menunggu Bayar"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Notifikasi</CardTitle>
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadNotifications.length} baru
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg ${
                  !notif.isRead
                    ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30"
                    : "bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notif.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Vouchers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Voucher Aktif</CardTitle>
            <Link href="/dashboard/vouchers">
              <Button variant="ghost" size="sm" className="text-blue-600">
                Lihat Semua
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockVouchers
              .filter((v) => !v.isUsed)
              .map((voucher) => (
                <div
                  key={voucher.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900/30"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{voucher.promo.title}</p>
                    <code className="text-xs text-blue-600 font-mono">
                      {voucher.promo.code}
                    </code>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Aktif
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/properties">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Hotel className="h-5 w-5 text-blue-600" />
                <span className="text-xs">Cari Penginapan</span>
              </Button>
            </Link>
            <Link href="/dashboard/wishlist">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-xs">Wishlist</span>
              </Button>
            </Link>
            <Link href="/dashboard/vouchers">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                <span className="text-xs">Voucher Saya</span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-600" />
                <span className="text-xs">Edit Profil</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
