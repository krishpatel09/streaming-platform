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
  RefreshCw,
  Loader2,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { adminService } from "@/serivces/admin.service";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import EditContentModal from "@/components/admin/EditContentModal";
import VideoUploadForm from "@/components/admin/VideoUploadForm";
import { resolveStorageUrl } from "@/utils/storage";

export default function SeriesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [series, setSeries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = React.useState<string | null>(null);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllContent();
      // Filter for series only (note: backend now uses "series")
      const filtered = data.filter((item: any) => item.type === "series" || item.type === "show");
      setSeries(filtered);
    } catch (error) {
      toast.error("Failed to fetch series from server");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSeries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this series?")) return;
    try {
      await adminService.deleteContent(id);
      toast.success("Series deleted");
      fetchSeries();
    } catch (error) {
      toast.error("Failed to delete series");
    }
  };

  const handleEdit = (id: string) => {
    setSelectedSeriesId(id);
    setShowEditModal(true);
  };

  const filteredSeries = series.filter((item) =>
    (item.title?.default || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Series Management</h1>
          <p className="text-zinc-500">Manage your TV shows, seasons, and episodes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchSeries}
            className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                <Plus className="mr-2 h-4 w-4" /> Add Series
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-white border-zinc-200 p-0 text-zinc-900">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Series</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                {/* For Series, we typically use a metadata-only form first, then add episodes */}
                <VideoUploadForm 
                  onSuccess={() => {
                    setShowAddModal(false);
                    fetchSeries();
                  }} 
                  onClose={() => setShowAddModal(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Unified Edit Modal */}
      <EditContentModal 
        isOpen={showEditModal}
        contentId={selectedSeriesId}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchSeries}
      />

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-zinc-500 font-medium">Fetching series...</p>
          </div>
        ) : filteredSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-zinc-50 p-4 rounded-full mb-4">
              <Layers className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="text-zinc-900 font-bold text-lg">No series found</h3>
            <p className="text-zinc-500">Add your first TV series to start managing seasons.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="border-zinc-200 hover:bg-transparent text-zinc-900">
                <TableHead className="w-[100px] text-zinc-400 uppercase text-[10px] font-bold tracking-wider">Thumbnail</TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">Series Title</TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">Slug</TableHead>
                <TableHead className="text-center text-zinc-400 uppercase text-[10px] font-bold tracking-wider">Seasons</TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
                <TableHead className="text-right text-zinc-400 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeries.map((item) => (
                <TableRow key={item._id || item.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors text-zinc-900">
                  <TableCell>
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm">
                      {item.poster_url && (
                        <Image src={resolveStorageUrl(item.poster_url)} alt={item.title?.default} fill className="object-cover" unoptimized={true} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{item.title?.default || "Untitled"}</TableCell>
                  <TableCell>
                     <code className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
                       {item.slug || "-"}
                     </code>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] font-bold">
                       {item.seasons?.length || 0} Seasons
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-bold uppercase">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-zinc-200 shadow-xl text-zinc-900 min-w-[180px]">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/content/series/${item._id || item.id}/episodes`} className="hover:bg-zinc-50 cursor-pointer text-xs font-medium py-2 flex items-center">
                            <PlayCircle className="mr-2 h-4 w-4 text-indigo-500" /> Manage Episodes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="hover:bg-zinc-50 cursor-pointer text-xs font-medium py-2"
                          onClick={() => handleEdit(item._id || item.id)}
                        >
                          <Edit className="mr-2 h-4 w-4 text-zinc-400" /> Edit Metadata
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-100" />
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500 hover:bg-red-50 cursor-pointer text-xs font-semibold py-2"
                          onClick={() => handleDelete(item._id || item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Series
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
