"use client";

import { motion } from "framer-motion";
import { Gift, Clock, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockVouchers } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

export default function VouchersPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Voucher Saya</h1>
        <p className="text-muted-foreground">Voucher dan promo yang tersedia</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockVouchers.map((voucher, index) => (
          <motion.div
            key={voucher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={voucher.isUsed ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                    voucher.isUsed ? "bg-slate-100 dark:bg-slate-800" : "bg-blue-600"
                  }`}>
                    <Gift className={`h-6 w-6 ${voucher.isUsed ? "text-slate-400" : "text-white"}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{voucher.promo.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {voucher.promo.description}
                        </p>
                      </div>
                      <Badge
                        className={
                          voucher.isUsed
                            ? "bg-slate-100 text-slate-600"
                            : "bg-green-100 text-green-700"
                        }
                      >
                        {voucher.isUsed ? "Terpakai" : "Aktif"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                        {voucher.promo.code}
                      </code>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {voucher.isUsed ? `Digunakan ${voucher.usedAt}` : `s/d ${voucher.expiresAt}`}
                      </span>
                    </div>
                    {!voucher.isUsed && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white mt-2">
                        Gunakan Voucher
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
