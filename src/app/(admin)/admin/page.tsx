"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Hotel,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CalendarCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 45000000 },
  { month: "Feb", revenue: 52000000 },
  { month: "Mar", revenue: 48000000 },
  { month: "Apr", revenue: 61000000 },
  { month: "May", revenue: 55000000 },
  { month: "Jun", revenue: 72000000 },
  { month: "Jul", revenue: 68000000 },
];

const bookingsByType = [
  { name: "Hotel", value: 55, color: "#2563EB" },
  { name: "Homestay", value: 25, color: "#10B981" },
  { name: "Apartemen", value: 20, color: "#F59E0B" },
];

const recentBookings = [
  { id: "1", guest: "Andi Pratama", property: "Grand Hyatt Jakarta", amount: 4400000, status: "confirmed" },
  { id: "2", guest: "Siti Rahayu", property: "Cozy Homestay Depok", amount: 700000, status: "pending_payment" },
  { id: "3", guest: "Budi Santoso", property: "Sudirman Suites", amount: 825000, status: "paid" },
  { id: "4", guest: "Dewi Lestari", property: "Bumi Surabaya", amount: 3600000, status: "check_in" },
  { id: "5", guest: "Rudi Hermawan", property: "Hotel Santika", amount: 1500000, status: "completed" },
];

const stats = [
  {
    label: "Total Pendapatan",
    value: formatCurrency(72000000),
    change: "+12.5%",
    up: true,
    icon: DollarSign,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600",
  },
  {
    label: "Total Booking",
    value: "1,248",
    change: "+8.2%",
    up: true,
    icon: CalendarCheck,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  },
  {
    label: "Total Customer",
    value: "5,432",
    change: "+15.3%",
    up: true,
    icon: Users,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  },
  {
    label: "Total Properti",
    value: "328",
    change: "+3.1%",
    up: true,
    icon: Hotel,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Menunggu", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Dibayar", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Konfirmasi", color: "bg-green-100 text-green-700" },
  check_in: { label: "Check In", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Selesai", color: "bg-slate-100 text-slate-700" },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Overview performa StayBook Indonesia
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Pendapatan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000000}M`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), "Pendapatan"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking per Tipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {bookingsByType.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {bookingsByType.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reservasi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Tamu</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Properti</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Total</th>
                  <th className="pb-3 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-sm font-medium">{booking.guest}</td>
                    <td className="py-3 text-sm text-muted-foreground">{booking.property}</td>
                    <td className="py-3 text-sm font-medium">{formatCurrency(booking.amount)}</td>
                    <td className="py-3">
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
