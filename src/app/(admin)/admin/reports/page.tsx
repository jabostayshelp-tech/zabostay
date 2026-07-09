"use client";

import { motion } from "framer-motion";
import { Download, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const dailyData = [
  { date: "01", revenue: 8500000, bookings: 12 },
  { date: "02", revenue: 7200000, bookings: 9 },
  { date: "03", revenue: 9100000, bookings: 15 },
  { date: "04", revenue: 6800000, bookings: 8 },
  { date: "05", revenue: 11200000, bookings: 18 },
  { date: "06", revenue: 13500000, bookings: 22 },
  { date: "07", revenue: 12000000, bookings: 19 },
];

const monthlyData = [
  { month: "Jan", hotel: 35000000, homestay: 12000000, apartment: 8000000 },
  { month: "Feb", hotel: 42000000, homestay: 15000000, apartment: 10000000 },
  { month: "Mar", hotel: 38000000, homestay: 13000000, apartment: 9000000 },
  { month: "Apr", hotel: 51000000, homestay: 18000000, apartment: 12000000 },
  { month: "May", hotel: 46000000, homestay: 16000000, apartment: 11000000 },
  { month: "Jun", hotel: 58000000, homestay: 22000000, apartment: 15000000 },
];

const topProperties = [
  { name: "Grand Hyatt Jakarta", bookings: 156, revenue: 390000000 },
  { name: "The Ritz-Carlton Jakarta", bookings: 132, revenue: 501600000 },
  { name: "Bumi Surabaya City Resort", bookings: 98, revenue: 176400000 },
  { name: "Sudirman Suites", bookings: 89, revenue: 106800000 },
  { name: "Hotel Santika Semarang", bookings: 76, revenue: 57000000 },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Laporan</h1>
          <p className="text-muted-foreground">Analisis performa bisnis</p>
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

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          <TabsTrigger value="bookings">Booking</TabsTrigger>
          <TabsTrigger value="top">Top Properti</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4 space-y-6">
          {/* Daily Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Pendapatan Harian (Minggu Ini)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip formatter={(v) => [formatCurrency(v as number), "Pendapatan"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ fill: "#2563EB" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Pendapatan Bulanan per Tipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip formatter={(v) => [formatCurrency(v as number)]} />
                    <Legend />
                    <Bar dataKey="hotel" fill="#2563EB" name="Hotel" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="homestay" fill="#10B981" name="Homestay" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="apartment" fill="#F59E0B" name="Apartemen" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jumlah Booking Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#2563EB" name="Booking" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Properti Terlaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground">#</th>
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Properti</th>
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Booking</th>
                      <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProperties.map((prop, idx) => (
                      <tr key={prop.name} className="border-b border-border/50">
                        <td className="py-3 text-sm font-bold text-blue-600">{idx + 1}</td>
                        <td className="py-3 text-sm font-medium">{prop.name}</td>
                        <td className="py-3 text-sm">{prop.bookings} booking</td>
                        <td className="py-3 text-sm font-medium">{formatCurrency(prop.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
