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
import EditContentModal from "@/components/admin/EditContentModal";
import VideoUploadForm from "@/components/admin/VideoUploadForm";
import VideoProcessingStatus from "@/components/admin/VideoProcessingStatus";
import { resolveStorageUrl } from "@/utils/storage";
import InAppPreviewModal from "@/components/admin/InAppPreviewModal";

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [movies, setMovies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showStatusModal, setShowStatusModal] = React.useState(false);
  const [selectedContentId, setSelectedContentId] = React.useState<
    string | null
  >(null);
  const [uploadData, setUploadData] = React.useState<any>(null);

  // Preview State
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [previewMovie, setPreviewMovie] = React.useState<any>(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Fetch from catalog service — it has live streaming URLs (hls_master_url)
      // set by the TranscodingCompleted Kafka event. The admin service does not.
      const response = await fetch("/api/catalog/content");
      if (!response.ok)
        throw new Error(`Catalog API error: ${response.status}`);
      const data = await response.json();
      const filtered = (
        Array.isArray(data) ? data : (data.content ?? [])
      ).filter((item: any) => item.type === "movie");
      console.log("Catalog content:", filtered);
      setMovies(filtered);
    } catch (error) {
      toast.error("Failed to fetch movies from server");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      await adminService.deleteContent(id);
      toast.success("Movie deleted");
      fetchMovies();
    } catch (error) {
      toast.error("Failed to delete movie");
    }
  };

  const handleEdit = (id: string) => {
    setSelectedContentId(id);
    setShowEditModal(true);
  };

  const handleViewInApp = (movie: any) => {
    setPreviewMovie(movie);
    setShowPreviewModal(true);
  };

  const handleUploadSuccess = (data: any) => {
    setUploadData(data);
    setShowAddModal(false);
    setShowStatusModal(true);
    fetchMovies();
  };

  const filteredMovies = movies.filter((movie) =>
    (movie.title?.default || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Movies Management
          </h1>
          <p className="text-zinc-500">
            Manage feature films and their metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchMovies}
            className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                <Plus className="mr-2 h-4 w-4" /> Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-white border-zinc-200 p-0 text-zinc-900">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Movie</DialogTitle>
                <DialogDescription>
                  Create a new movie record and start uploading.
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <VideoUploadForm
                  onSuccess={handleUploadSuccess}
                  onClose={() => setShowAddModal(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Modal for active uploads */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto bg-white border-zinc-200 p-0 text-zinc-900">
          <DialogHeader className="sr-only">
            <DialogTitle>Upload Status</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {uploadData && (
              <VideoProcessingStatus
                {...uploadData}
                onClose={() => setShowStatusModal(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unified Edit Modal */}
      <EditContentModal
        isOpen={showEditModal}
        contentId={selectedContentId}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchMovies}
      />

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
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold"
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-zinc-500 font-medium">
              Fetching movies...
            </p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-zinc-50 p-4 rounded-full mb-4">
              <Plus className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="text-zinc-900 font-bold text-lg">No movies found</h3>
            <p className="text-zinc-500 max-w-xs mx-auto">
              {searchTerm
                ? "Try a different search term or clear the filter."
                : "Get started by adding your first movie to the library."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="border-zinc-200 hover:bg-transparent text-zinc-900">
                <TableHead className="w-[100px] text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  Thumbnail
                </TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  Title
                </TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  Slug
                </TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  Type
                </TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider text-center">
                  Duration
                </TableHead>
                <TableHead className="text-right text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow
                  key={movie._id || movie.id}
                  className="border-zinc-100 hover:bg-zinc-50/50 transition-colors"
                >
                  <TableCell>
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100">
                      {movie.poster_url && (
                        <Image
                          src={resolveStorageUrl(movie.poster_url)}
                          alt={movie.title?.default || "No title"}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900">
                    {movie.title?.default || "Untitled"}
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
                      {movie.slug || "-"}
                    </code>
                  </TableCell>
                  <TableCell className="capitalize text-zinc-600 text-xs font-medium">
                    {movie.type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] font-bold uppercase ${
                        movie.status === "published" ||
                        movie.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-indigo-50 text-indigo-600 border-indigo-100"
                      }`}
                    >
                      {movie.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600 font-medium text-xs text-center">
                    {movie.duration_minutes || movie.duration}m
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-zinc-200 shadow-xl text-zinc-900 min-w-[160px]"
                      >
                        <DropdownMenuItem
                          className="hover:bg-zinc-50 cursor-pointer text-xs font-medium py-2"
                          onClick={() => handleViewInApp(movie)}
                        >
                          <Eye className="mr-2 h-4 w-4 text-indigo-500" />
                          <span className="text-zinc-900">View in App</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-zinc-50 cursor-pointer text-xs font-medium py-2"
                          onClick={() => handleEdit(movie._id || movie.id)}
                        >
                          <Edit className="mr-2 h-4 w-4 text-zinc-400" /> Edit
                          Metadata
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-100" />
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500 hover:bg-red-50 cursor-pointer text-xs font-semibold py-2"
                          onClick={() => handleDelete(movie._id || movie.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Movie
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

      {/* Cinematic Preview Overlay */}
      <InAppPreviewModal
        isOpen={showPreviewModal}
        movie={previewMovie}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
}
