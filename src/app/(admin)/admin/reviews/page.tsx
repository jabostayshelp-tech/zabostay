"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Search, Star, MessageSquare, User, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { reviews as initialReviews, properties } from "@/data/mock";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviewList, setReviewList] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = reviewList.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.user.name.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q) ||
      (properties.find((p) => p.id === r.propertyId)?.name || "").toLowerCase().includes(q)
    );
  });

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) {
      toast.error("Tulis balasan terlebih dahulu.");
      return;
    }
    setReviewList((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, adminReply: replyText.trim() } : r
      )
    );
    toast.success("Balasan berhasil disimpan.");
    setReplyingTo(null);
    setReplyText("");
  };

  const avgRating = reviewList.length > 0
    ? (reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Manajemen Review</h1>
        <p className="text-muted-foreground">
          Kelola ulasan dan balasan untuk properti
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgRating}</p>
              <p className="text-xs text-muted-foreground">Rata-rata Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reviewList.length}</p>
              <p className="text-xs text-muted-foreground">Total Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reviewList.filter((r) => r.adminReply).length}
              </p>
              <p className="text-xs text-muted-foreground">Sudah Dibalas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.map((review) => {
          const property = properties.find((p) => p.id === review.propertyId);
          return (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                      {review.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {review.user.name}
                      </p>
                      {property && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {property.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-foreground">{review.comment}</p>

                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Admin Reply */}
                {review.adminReply && (
                  <div className="ml-4 pl-4 border-l-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-lg p-3">
                    <p className="text-xs font-medium text-blue-600 mb-1">Balasan Admin:</p>
                    <p className="text-sm">{review.adminReply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === review.id ? (
                  <div className="space-y-2 ml-4">
                    <Textarea
                      placeholder="Tulis balasan..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleReply(review.id)}
                      >
                        Kirim Balasan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReplyingTo(review.id)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {review.adminReply ? "Edit Balasan" : "Balas"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Tidak ada review ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
