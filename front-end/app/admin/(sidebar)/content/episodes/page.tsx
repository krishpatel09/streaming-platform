"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const mockEpisodes = [
  { id: "ep1", title: "The Vanishing of Will Byers", series: "Stranger Things", season: 1, episode: 1, duration: "48m", status: "Active", views: "1.2M", thumbnail: "https://images.unsplash.com/photo-1627389955805-39401309f984?w=400&h=225&fit=crop" },
  { id: "ep2", title: "The Weirdo on Maple Street", series: "Stranger Things", season: 1, episode: 2, duration: "55m", status: "Active", views: "1.1M", thumbnail: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=225&fit=crop" },
  { id: "ep3", title: "The Name of the Game", series: "The Boys", season: 1, episode: 1, duration: "60m", status: "Active", views: "950k", thumbnail: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=400&h=225&fit=crop" },
];

export default function EpisodesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredEpisodes = mockEpisodes.filter((ep) =>
    ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ep.series.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Episodes Management</h1>
          <p className="text-zinc-500">Manage individual episodes and their metadata.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
          <Plus className="mr-2 h-4 w-4" /> Add Episode
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search episodes or series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-zinc-200 focus:ring-indigo-600 text-zinc-900"
          />
        </div>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="border-zinc-200 hover:bg-transparent text-zinc-900">
              <TableHead className="w-[100px] text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Thumbnail</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Episode Title</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Series / S / E</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Duration</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Views</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEpisodes.map((ep) => (
              <TableRow key={ep.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                <TableCell>
                  <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-zinc-200">
                    <Image src={ep.thumbnail} alt={ep.title} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-zinc-900">{ep.title}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs text-zinc-600">
                    <span className="font-medium text-zinc-900">{ep.series}</span>
                    <span>Season {ep.season}, Ep {ep.episode}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 font-medium text-xs">{ep.duration}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] font-bold uppercase">
                    {ep.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 font-medium text-xs">{ep.views}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-zinc-200 shadow-lg text-zinc-900">
                      <DropdownMenuItem className="hover:bg-zinc-50 cursor-pointer">
                        <PlayCircle className="mr-2 h-4 w-4 text-zinc-400" /> Play Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-zinc-50 cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-zinc-400" /> Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem className="text-red-500 focus:text-red-500 hover:bg-red-50 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete episode
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
