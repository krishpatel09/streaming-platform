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
  Layers,
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
import { mockShows } from "@/data/mock-data";
import Image from "next/image";

export default function SeriesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredShows = mockShows.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Series Management</h1>
          <p className="text-zinc-500">Manage your TV shows, seasons, and episodes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
              <Plus className="mr-2 h-4 w-4" /> Add Series
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white border-zinc-200 text-zinc-900">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Series</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Setup your new TV show details here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right text-zinc-700 font-medium">Title</Label>
                <Input id="title" className="col-span-3 bg-zinc-50 border-zinc-200" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="border-zinc-200 hover:bg-zinc-100">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Series</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search series..."
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
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Series Title</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Language & Year</TableHead>
              <TableHead className="text-center text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Seasons/Eps</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Views</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShows.map((show) => (
              <TableRow key={show.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                <TableCell>
                  <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-zinc-200">
                    <Image src={show.thumbnail} alt={show.title} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-zinc-900">{show.title}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs text-zinc-600">
                    <span className="font-medium text-zinc-900">{show.language}</span>
                    <span>{show.releaseYear}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-semibold">
                      <Layers className="h-3 w-3" />
                      <span>{show.seasons} Seasons</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <PlayCircle className="h-3 w-3" />
                      <span>{show.totalEpisodes} Episodes</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] font-bold uppercase">
                    {show.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 font-medium text-xs">{show.views}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-zinc-200 shadow-lg text-zinc-900">
                      <DropdownMenuItem className="hover:bg-zinc-50 cursor-pointer">
                        <Eye className="mr-2 h-4 w-4 text-zinc-400" /> View Series
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-zinc-50 cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-zinc-400" /> Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem className="text-red-500 focus:text-red-500 hover:bg-red-50 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete series
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
