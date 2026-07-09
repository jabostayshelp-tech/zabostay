"use client";

import { motion } from "framer-motion";
import { Receipt, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const payments = [
  { id: "1", bookingCode: "STB-20240601-001", property: "Grand Hyatt Jakarta", amount: 4400000, method: "QRIS", status: "paid", date: "2024-06-01" },
  { id: "2", bookingCode: "STB-20240605-002", property: "Sudirman Suites", amount: 825000, method: "Virtual Account BCA", status: "pending", date: "2024-06-05" },
  { id: "3", bookingCode: "STB-20240510-003", property: "Hotel Santika Semarang", amount: 1650000, method: "GoPay", status: "paid", date: "2024-05-10" },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Riwayat Pembayaran</h1>
        <p className="text-muted-foreground">Riwayat transaksi pembayaran Anda</p>
      </motion.div>

      <div className="space-y-4">
        {payments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{payment.property}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.bookingCode} &middot; {payment.method} &middot; {payment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{formatCurrency(payment.amount)}</p>
                    <Badge className={payment.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                      {payment.status === "paid" ? "Dibayar" : "Pending"}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
