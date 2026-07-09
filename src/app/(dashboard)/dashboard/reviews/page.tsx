"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reviews } from "@/data/mock";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Review Saya</h1>
        <p className="text-muted-foreground">Review yang pernah Anda berikan</p>
      </motion.div>

      <div className="space-y-4">
        {reviews.slice(0, 2).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">{review.rating}/5</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{review.createdAt}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-blue-200" />
            <p className="font-medium">Belum ada review</p>
            <p className="text-sm mt-1">Review Anda akan tampil di sini setelah menginap</p>
          </div>
        )}
      </div>
    </div>
  );
}
