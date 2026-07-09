"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a short network delay for UX, then persist.
    setTimeout(() => {
      const result = register(form);
      setLoading(false);

      if (!result.ok) {
        setError(result.error || "Pendaftaran gagal.");
        toast.error(result.error || "Pendaftaran gagal.");
        return;
      }

      toast.success("Akun berhasil dibuat! Selamat datang di StayBook.");
      router.push("/dashboard");
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          StayBook
        </span>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold">Buat Akun Baru</h2>
        <p className="text-muted-foreground">
          Daftar dan mulai booking penginapan terbaik
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Nama lengkap Anda"
              className="pl-10"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className="pl-10"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">No. HP</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              className="pl-10"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              className="pl-10 pr-10"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              className="pl-10"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
            atau daftar dengan
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          type="button"
          onClick={() => toast.info("Login Google akan segera tersedia.")}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Daftar dengan Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Masuk
        </Link>
      </p>
    </motion.div>
  );
}
