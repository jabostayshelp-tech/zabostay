"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Hotel,
  Heart,
  Gift,
  Receipt,
  Star,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { mockNotifications } from "@/data/mock";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Booking Saya", href: "/dashboard/bookings", icon: Hotel },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Voucher", href: "/dashboard/vouchers", icon: Gift },
  { name: "Riwayat Pembayaran", href: "/dashboard/payments", icon: Receipt },
  { name: "Review", href: "/dashboard/reviews", icon: Star },
  { name: "Profil", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/20">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center px-4 lg:px-8">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:inline">
              StayBook
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white">
                {mockNotifications.filter((n) => !n.isRead).length}
              </Badge>
            </Button>
          </Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border/40 pt-16 transform transition-transform lg:translate-x-0 lg:static lg:z-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 lg:hidden z-[-1]"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/40 mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
