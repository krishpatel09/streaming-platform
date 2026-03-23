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
import { mockMovies } from "@/data/mock-data";
import Image from "next/image";

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredMovies = mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Movies Management</h1>
          <p className="text-zinc-500">Add, edit, and organize your platform's movies.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
              <Plus className="mr-2 h-4 w-4" /> Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white border-zinc-200 text-zinc-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Movie</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Enter movie details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right text-zinc-700 font-medium">Title</Label>
                <Input id="title" className="col-span-3 bg-zinc-50 border-zinc-200 focus:bg-white" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right text-zinc-700 font-medium">Language</Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-zinc-50 border-zinc-200 focus:bg-white text-zinc-900">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-200">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="border-zinc-200 hover:bg-zinc-100">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save movie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-zinc-200 focus:ring-indigo-600 text-zinc-900"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="border-zinc-200 hover:bg-transparent text-zinc-900">
              <TableHead className="w-[100px] text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Thumbnail</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Title</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Language</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Year</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Views</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.map((movie) => (
              <TableRow key={movie.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                <TableCell>
                  <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
                    <Image src={movie.thumbnail} alt={movie.title} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-zinc-900">{movie.title}</TableCell>
                <TableCell className="text-zinc-600">{movie.language}</TableCell>
                <TableCell className="text-zinc-600">{movie.releaseYear}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px] font-bold">
                    {movie.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 font-medium">{movie.views}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-zinc-200 shadow-lg text-zinc-900">
                      <DropdownMenuItem className="hover:bg-zinc-50 cursor-pointer">
                        <Eye className="mr-2 h-4 w-4 text-zinc-400" /> View content
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-zinc-50 cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-zinc-400" /> Edit movie
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem className="text-red-500 focus:text-red-500 hover:bg-red-50 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete movie
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
