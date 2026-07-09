"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  QrCode,
  Wallet,
  Building,
  CreditCard,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Shield,
  AlertCircle,
  Ticket,
  X,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPropertyById, promos } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { applyVoucher } from "@/lib/storage";
import { Promo } from "@/types";

const paymentMethods = [
  { id: "qris", label: "QRIS", icon: QrCode, category: "qris" },
  { id: "gopay", label: "GoPay", icon: Wallet, category: "ewallet" },
  { id: "va_bca", label: "BCA Virtual Account", icon: Building, category: "va" },
  { id: "va_mandiri", label: "Mandiri Virtual Account", icon: Building, category: "va" },
  { id: "va_bni", label: "BNI Virtual Account", icon: Building, category: "va" },
  { id: "va_bri", label: "BRI Virtual Account", icon: Building, category: "va" },
  { id: "va_permata", label: "Permata Virtual Account", icon: Building, category: "va" },
  { id: "credit_card", label: "Kartu Kredit", icon: CreditCard, category: "card" },
];

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const property = getPropertyById(params.id as string);
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success">("pending");

  // Voucher state
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [bookingCode] = useState(
    () => `STB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`
  );

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Properti tidak ditemukan</p>
      </div>
    );
  }

  const room = property.rooms[0];
  const basePrice = room.pricePerNight;
  const subtotalAfterDiscount = Math.max(0, basePrice - discount);
  const tax = Math.round(subtotalAfterDiscount * 0.11);
  const totalPrice = subtotalAfterDiscount + tax;

  const handleApplyVoucher = () => {
    setVoucherError("");
    const result = applyVoucher(voucherCode, basePrice);
    if (!result.ok) {
      setVoucherError(result.error || "Voucher tidak valid.");
      toast.error(result.error || "Voucher tidak valid.");
      return;
    }
    setAppliedPromo(result.promo!);
    setDiscount(result.discount!);
    toast.success(
      `Voucher ${result.promo!.code} diterapkan! Anda hemat ${formatCurrency(result.discount!)}`
    );
  };

  const handleRemoveVoucher = () => {
    setAppliedPromo(null);
    setDiscount(0);
    setVoucherCode("");
    setVoucherError("");
    toast.info("Voucher dihapus.");
  };

  const handlePay = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      toast.success("Pembayaran berhasil!");
    }, 3000);
  };

  const handleDownloadInvoice = () => {
    const invoiceText = [
      "STAYBOOK INDONESIA - INVOICE",
      "================================",
      `Kode Booking : ${bookingCode}`,
      `Properti     : ${property.name}`,
      `Kamar        : ${room.name}`,
      `Kota         : ${property.city.name}`,
      "--------------------------------",
      `Harga Kamar  : ${formatCurrency(basePrice)}`,
      appliedPromo
        ? `Diskon (${appliedPromo.code}) : -${formatCurrency(discount)}`
        : "Diskon       : -",
      `Pajak (11%)  : ${formatCurrency(tax)}`,
      `TOTAL DIBAYAR: ${formatCurrency(totalPrice)}`,
      "--------------------------------",
      `Metode       : ${paymentMethods.find((m) => m.id === selectedMethod)?.label || selectedMethod}`,
      `Status       : LUNAS`,
      `Tanggal      : ${new Date().toLocaleString("id-ID")}`,
      "================================",
      "Terima kasih telah menggunakan StayBook Indonesia.",
    ].join("\n");

    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${bookingCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Invoice diunduh.");
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText("880812345678 9012".replace(/\s/g, ""));
    toast.success("Nomor Virtual Account disalin.");
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Pembayaran Berhasil!</h1>
          <p className="text-muted-foreground">
            Booking Anda telah dikonfirmasi. Detail reservasi telah dikirim ke email Anda.
          </p>
          <Card>
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kode Booking</span>
                <span className="font-mono font-semibold">{bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Properti</span>
                <span>{property.name}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voucher</span>
                  <span className="text-green-600">
                    {appliedPromo.code} (-{formatCurrency(discount)})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Dibayar</span>
                <span className="font-semibold text-blue-600">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-100 text-green-700">Dibayar</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/dashboard/bookings")}
            >
              Lihat Booking
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            Pembayaran
          </motion.h1>
          <p className="text-blue-100 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Selesaikan pembayaran dalam 60:00
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pilih Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="qris" onValueChange={(v) => setSelectedMethod(v || "qris")}>
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="qris" className="text-xs">
                      <QrCode className="h-4 w-4 mr-1" />
                      QRIS
                    </TabsTrigger>
                    <TabsTrigger value="ewallet" className="text-xs">
                      <Wallet className="h-4 w-4 mr-1" />
                      E-Wallet
                    </TabsTrigger>
                    <TabsTrigger value="va" className="text-xs">
                      <Building className="h-4 w-4 mr-1" />
                      VA
                    </TabsTrigger>
                    <TabsTrigger value="card" className="text-xs">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Kartu
                    </TabsTrigger>
                  </TabsList>

                  {/* QRIS Tab */}
                  <TabsContent value="qris">
                    <div className="text-center space-y-4">
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          Scan QR code di bawah untuk membayar via QRIS
                        </p>
                        <div className="relative bg-white p-4 rounded-xl shadow-lg border inline-block">
                          {/* QRIS Payment QR Code - User's uploaded image */}
                          <Image
                            src="/images/payment/qris-code.png"
                            alt="QRIS Payment Code - Scan untuk membayar"
                            width={280}
                            height={280}
                            className="rounded-lg"
                            priority
                          />
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-blue-600 text-white shadow-lg">
                              QRIS
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 max-w-sm mx-auto">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Total Pembayaran
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(totalPrice)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3.5 w-3.5 text-green-500" />
                        Pembayaran dijamin aman oleh QRIS
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Dapat digunakan dengan semua aplikasi pembayaran yang mendukung QRIS
                        (GoPay, OVO, DANA, ShopeePay, LinkAja, dll)
                      </p>
                    </div>
                  </TabsContent>

                  {/* E-Wallet Tab */}
                  <TabsContent value="ewallet">
                    <div className="space-y-3">
                      {paymentMethods
                        .filter((m) => m.category === "ewallet")
                        .map((method) => (
                          <button
                            key={method.id}
                            className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                              selectedMethod === method.id
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                                : "border-border hover:border-blue-300"
                            }`}
                            onClick={() => setSelectedMethod(method.id)}
                          >
                            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <method.icon className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="font-medium">{method.label}</span>
                            {selectedMethod === method.id && (
                              <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                            )}
                          </button>
                        ))}
                    </div>
                  </TabsContent>

                  {/* Virtual Account Tab */}
                  <TabsContent value="va">
                    <div className="space-y-3">
                      {paymentMethods
                        .filter((m) => m.category === "va")
                        .map((method) => (
                          <button
                            key={method.id}
                            className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                              selectedMethod === method.id
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                                : "border-border hover:border-blue-300"
                            }`}
                            onClick={() => setSelectedMethod(method.id)}
                          >
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <method.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-medium">{method.label}</span>
                            {selectedMethod === method.id && (
                              <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                            )}
                          </button>
                        ))}

                      {selectedMethod.startsWith("va_") && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Nomor Virtual Account</p>
                          <div className="flex items-center gap-2">
                            <code className="text-lg font-mono font-bold tracking-wider">
                              8808 1234 5678 9012
                            </code>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyVa}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Credit Card Tab */}
                  <TabsContent value="card">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nomor Kartu</label>
                        <input
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Berlaku Sampai</label>
                          <input
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">CVV</label>
                          <input
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background"
                            placeholder="123"
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nama di Kartu</label>
                        <input
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background"
                          placeholder="NAMA LENGKAP"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 text-base"
                  onClick={handlePay}
                  disabled={paymentStatus === "processing"}
                >
                  {paymentStatus === "processing" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses Pembayaran...
                    </span>
                  ) : (
                    `Bayar ${formatCurrency(totalPrice)}`
                  )}
                </Button>

                <div className="flex items-center gap-2 mt-3 justify-center text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  Dilindungi oleh enkripsi SSL 256-bit
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Voucher Card */}
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-blue-600" />
                    Kode Voucher
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                            {appliedPromo.code}
                          </p>
                          <p className="text-xs text-green-600">
                            Hemat {formatCurrency(discount)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={handleRemoveVoucher}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Masukkan kode"
                          value={voucherCode}
                          onChange={(e) => {
                            setVoucherCode(e.target.value.toUpperCase());
                            if (voucherError) setVoucherError("");
                          }}
                          className="uppercase"
                        />
                        <Button
                          onClick={handleApplyVoucher}
                          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                        >
                          Pakai
                        </Button>
                      </div>
                      {voucherError && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {voucherError}
                        </p>
                      )}
                      {/* Suggested vouchers */}
                      <div className="flex flex-wrap gap-1.5">
                        {promos.slice(0, 3).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setVoucherCode(p.code)}
                            className="text-xs px-2 py-1 rounded border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          >
                            {p.code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">{property.name}</h4>
                    <p className="text-xs text-muted-foreground">{room.name}</p>
                    <p className="text-xs text-muted-foreground">{property.city.name}</p>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <Badge variant="secondary">1 malam</Badge>
                    <Badge variant="secondary">1 kamar</Badge>
                    <Badge variant="secondary">2 tamu</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Harga kamar</span>
                      <span>{formatCurrency(basePrice)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon voucher</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pajak (11%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Bayar</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Selesaikan pembayaran sebelum waktu habis agar booking tidak dibatalkan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
