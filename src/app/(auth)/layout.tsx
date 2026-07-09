import Link from "next/link";
import { Building2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">StayBook</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Temukan Penginapan<br />Premium Terbaik
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-md">
            Booking hotel, homestay, dan apartemen dengan mudah. Harga terbaik, pembayaran aman, dan konfirmasi instan.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm text-blue-200">Penginapan</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100K+</div>
              <div className="text-sm text-blue-200">Pelanggan</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-sm text-blue-200">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
