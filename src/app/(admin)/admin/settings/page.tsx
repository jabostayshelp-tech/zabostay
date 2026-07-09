"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Settings,
  QrCode,
  Wallet,
  Upload,
  Save,
  Image as ImageIcon,
  Trash2,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [qrisImage, setQrisImage] = useState<string>("");
  const [qrisPreview, setQrisPreview] = useState<string>("");
  const [gopayNumber, setGopayNumber] = useState("");
  const [siteName, setSiteName] = useState("StayBook Indonesia");
  const [siteEmail, setSiteEmail] = useState("info@staybook.id");
  const [sitePhone, setSitePhone] = useState("021-12345678");
  const [siteDescription, setSiteDescription] = useState(
    "Platform booking penginapan terbaik di Indonesia"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQris = localStorage.getItem("staybook_qris_image");
      const savedGopay = localStorage.getItem("staybook_gopay_number");
      const savedSiteName = localStorage.getItem("staybook_site_name");
      const savedSiteEmail = localStorage.getItem("staybook_site_email");
      const savedSitePhone = localStorage.getItem("staybook_site_phone");
      const savedSiteDesc = localStorage.getItem("staybook_site_description");

      if (savedQris) {
        setQrisImage(savedQris);
        setQrisPreview(savedQris);
      }
      if (savedGopay) setGopayNumber(savedGopay);
      if (savedSiteName) setSiteName(savedSiteName);
      if (savedSiteEmail) setSiteEmail(savedSiteEmail);
      if (savedSitePhone) setSitePhone(savedSitePhone);
      if (savedSiteDesc) setSiteDescription(savedSiteDesc);
    }
  }, []);

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setQrisImage(base64);
      setQrisPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQris = () => {
    setQrisImage("");
    setQrisPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSavePayment = () => {
    if (typeof window !== "undefined") {
      if (qrisImage) {
        localStorage.setItem("staybook_qris_image", qrisImage);
      } else {
        localStorage.removeItem("staybook_qris_image");
      }
      if (gopayNumber.trim()) {
        localStorage.setItem("staybook_gopay_number", gopayNumber.trim());
      } else {
        localStorage.removeItem("staybook_gopay_number");
      }
    }
    toast.success("Pengaturan pembayaran berhasil disimpan!");
  };

  const handleSaveGeneral = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("staybook_site_name", siteName);
      localStorage.setItem("staybook_site_email", siteEmail);
      localStorage.setItem("staybook_site_phone", sitePhone);
      localStorage.setItem("staybook_site_description", siteDescription);
    }
    toast.success("Pengaturan umum berhasil disimpan!");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan website dan pembayaran
        </p>
      </motion.div>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Pengaturan Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QRIS Upload */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">QRIS Barcode</Label>
            <p className="text-sm text-muted-foreground">
              Upload gambar QRIS barcode yang akan ditampilkan pada halaman pembayaran
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {qrisPreview ? (
                    <div className="space-y-3">
                      <img
                        src={qrisPreview}
                        alt="QRIS Preview"
                        className="mx-auto max-w-[200px] max-h-[200px] rounded-lg object-contain"
                      />
                      <p className="text-xs text-muted-foreground">
                        Klik untuk mengganti gambar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Klik untuk upload QRIS barcode
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Format: PNG, JPG, JPEG (Maks. 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleQrisUpload}
                />
              </div>

              {qrisPreview && (
                <div className="flex sm:flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleRemoveQris}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* GoPay Number */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-600" />
              Nomor GoPay
            </Label>
            <p className="text-sm text-muted-foreground">
              Nomor GoPay yang akan ditampilkan kepada customer untuk pembayaran
            </p>
            <Input
              placeholder="Contoh: 081234567890"
              value={gopayNumber}
              onChange={(e) => setGopayNumber(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSavePayment}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Pengaturan Pembayaran
          </Button>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Pengaturan Umum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Nama Website
              </Label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                type="email"
                value={siteEmail}
                onChange={(e) => setSiteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telepon
              </Label>
              <Input
                value={sitePhone}
                onChange={(e) => setSitePhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi Website</Label>
            <Textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSaveGeneral}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Pengaturan Umum
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
