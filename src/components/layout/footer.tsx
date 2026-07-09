"use client";

import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Globe, CircleDot, MessageCircle, Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StayBook</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform booking penginapan premium terpercaya di Indonesia.
              Hotel, Homestay, dan Apartemen dengan harga terbaik.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-colors">
                <CircleDot className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center transition-colors">
                <Video className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Penginapan</h3>
            <ul className="space-y-2.5">
              <li><Link href="/properties?type=hotel" className="text-sm hover:text-blue-400 transition-colors">Hotel</Link></li>
              <li><Link href="/properties?type=homestay" className="text-sm hover:text-blue-400 transition-colors">Homestay</Link></li>
              <li><Link href="/properties?type=apartment" className="text-sm hover:text-blue-400 transition-colors">Apartemen</Link></li>
              <li><Link href="/properties?flashsale=true" className="text-sm hover:text-blue-400 transition-colors">Flash Sale</Link></li>
              <li><Link href="/properties" className="text-sm hover:text-blue-400 transition-colors">Promo Hari Ini</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-2.5">
              <li><Link href="#faq" className="text-sm hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-sm hover:text-blue-400 transition-colors">Cara Booking</Link></li>
              <li><Link href="#" className="text-sm hover:text-blue-400 transition-colors">Pembayaran</Link></li>
              <li><Link href="#" className="text-sm hover:text-blue-400 transition-colors">Pembatalan & Refund</Link></li>
              <li><Link href="#" className="text-sm hover:text-blue-400 transition-colors">Hubungi Kami</Link></li>
              <li><Link href="#" className="text-sm hover:text-blue-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="text-sm hover:text-blue-400 transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                <span className="text-sm">Jl. Sudirman Kav. 52-53, Jakarta Selatan 12190</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-sm">+62 21 5555 8888</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-sm">hello@staybook.id</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white text-sm font-medium mb-2">Metode Pembayaran</h4>
              <div className="flex flex-wrap gap-2">
                {["QRIS", "GoPay", "BCA", "Mandiri", "BNI", "BRI"].map((method) => (
                  <span key={method} className="text-xs bg-slate-800 px-2 py-1 rounded">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} StayBook Indonesia. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Terdaftar di Kemenparekraf RI
          </p>
        </div>
      </div>
    </footer>
  );
}
