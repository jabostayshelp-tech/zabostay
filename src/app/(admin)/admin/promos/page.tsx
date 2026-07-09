"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Users,
  Percent,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { promos as initialPromos } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Promo } from "@/types";

export default function AdminPromosPage() {
  const [promoList, setPromoList] = useState<Promo[]>(initialPromos);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    type: "percentage" as "percentage" | "fixed" | "cashback",
    value: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const filtered = promoList.filter((p) => {
    if (search && !p.code.toLowerCase().includes(search.toLowerCase()) && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => {
    setForm({
      code: "",
      title: "",
      description: "",
      type: "percentage",
      value: "",
      minPurchase: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      isActive: true,
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      title: promo.title,
      description: promo.description,
      type: promo.type,
      value: promo.value.toString(),
      minPurchase: promo.minPurchase.toString(),
      maxDiscount: promo.maxDiscount?.toString() || "",
      startDate: promo.startDate,
      endDate: promo.endDate,
      usageLimit: promo.usageLimit.toString(),
      isActive: promo.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPromoList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Promo berhasil dihapus.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.title || !form.value || !form.endDate) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    if (editingPromo) {
      setPromoList((prev) =>
        prev.map((p) =>
          p.id === editingPromo.id
            ? {
                ...p,
                code: form.code.toUpperCase(),
                title: form.title,
                description: form.description,
                type: form.type,
                value: Number(form.value),
                minPurchase: Number(form.minPurchase) || 0,
                maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
                startDate: form.startDate,
                endDate: form.endDate,
                usageLimit: Number(form.usageLimit) || 100,
                isActive: form.isActive,
              }
            : p
        )
      );
      toast.success("Promo berhasil diperbarui.");
    } else {
      const newPromo: Promo = {
        id: `promo-${Date.now()}`,
        code: form.code.toUpperCase(),
        title: form.title,
        description: form.description,
        type: form.type,
        value: Number(form.value),
        minPurchase: Number(form.minPurchase) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        startDate: form.startDate || new Date().toISOString().slice(0, 10),
        endDate: form.endDate,
        usageLimit: Number(form.usageLimit) || 100,
        usageCount: 0,
        isActive: form.isActive,
      };
      setPromoList((prev) => [...prev, newPromo]);
      toast.success("Promo berhasil ditambahkan.");
    }

    resetForm();
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Master Promo</h1>
          <p className="text-muted-foreground">Kelola voucher dan promo</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Promo
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Edit Promo" : "Tambah Promo Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kode Voucher</Label>
                  <Input
                    placeholder="STAYBOOK50"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipe</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: (v || "percentage") as "percentage" | "fixed" | "cashback" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Persentase</SelectItem>
                      <SelectItem value="fixed">Nominal Tetap</SelectItem>
                      <SelectItem value="cashback">Cashback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Judul Promo</Label>
                <Input
                  placeholder="Diskon 50% Hotel Premium"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                  placeholder="Deskripsi promo..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nilai ({form.type === "fixed" ? "Rp" : "%"})</Label>
                  <Input
                    type="number"
                    placeholder={form.type === "fixed" ? "200000" : "50"}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min. Pembelian (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="500000"
                    value={form.minPurchase}
                    onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Maks. Diskon (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="500000"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Penggunaan</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Berakhir</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingPromo ? "Simpan Perubahan" : "Tambah Promo"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kode atau judul promo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Promo List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((promo) => (
          <Card key={promo.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 font-mono">
                      {promo.code}
                    </Badge>
                    <Badge className={promo.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {promo.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{promo.title}</h3>
                  <p className="text-xs text-muted-foreground">{promo.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {promo.type === "fixed" ? (
                        <DollarSign className="h-3 w-3" />
                      ) : (
                        <Percent className="h-3 w-3" />
                      )}
                      {promo.type === "fixed"
                        ? formatCurrency(promo.value)
                        : `${promo.value}%`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      s/d {promo.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {promo.usageCount}/{promo.usageLimit}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(promo)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600"
                    onClick={() => handleDelete(promo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Tidak ada promo ditemukan.</p>
        </div>
      )}
    </div>
  );
}
