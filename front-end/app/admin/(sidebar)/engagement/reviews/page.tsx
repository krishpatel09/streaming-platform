"use client";

import * as React from "react";
import { Star, MoreHorizontal, CheckCircle2, XCircle, Search, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockReviews = [
  { id: "r1", user: "Alice Johnson", content: "Interstellar", rating: 5, comment: "Absolutely breathtaking! A true masterpiece.", date: "2 hours ago", status: "Approved" },
  { id: "r2", user: "Bob Smith", content: "The Boys", rating: 4, comment: "Gritty and refreshing take on the genre.", date: "5 hours ago", status: "Pending" },
  { id: "r3", user: "Charlie Davis", content: "Stranger Things", rating: 2, comment: "Season 4 was a bit too long for me.", date: "1 day ago", status: "Flagged" },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">User Reviews</h1>
        <p className="text-zinc-500">Monitor and moderate community feedback.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search reviews..." className="pl-9 bg-white border-zinc-200" />
        </div>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="border-zinc-200 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">User</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Content</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Rating</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Comment</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReviews.map((review) => (
              <TableRow key={review.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="font-semibold text-zinc-900">{review.user}</TableCell>
                <TableCell className="text-zinc-600 font-medium">{review.content}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200 fill-zinc-200"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate text-zinc-500 text-sm italic">"{review.comment}"</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      review.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      review.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-red-50 text-red-600 border-red-200"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
