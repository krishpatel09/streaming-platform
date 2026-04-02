"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/serivces/admin.service";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  X,
  Upload,
  Play,
  FileVideo,
  CheckCircle2,
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Settings,
  ChevronRight,
  Globe,
  Info,
} from "lucide-react";
import { resolveStorageUrl } from "@/utils/storage";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * We use strings for all form fields including duration to avoid complex
 * type inference issues between Zod, React Hook Form, and the UI components.
 * Conversion to number happens at the API boundary in onSubmit.
 */
const formSchema = z.object({
  title_default: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().optional().or(z.literal("")),
  type: z.string().min(1, "Type is required"),
  age_rating: z.string().min(1, "Age rating is required"),
  duration_minutes: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Duration must be a number",
  }),
  poster_url: z.string().optional().or(z.literal("")),
  banner_url: z.string().optional().or(z.literal("")),
  trailer_url: z.string().optional().or(z.literal("")),

  // Categorization
  genres: z.array(z.string()),
  tags: z.array(z.string()),
  languages: z.array(z.string()),

  // Cast
  cast: z.array(
    z.object({
      person_id: z.string().optional(),
      name: z.string().min(1, "Name is required"),
      role: z.string().min(1, "Role is required"),
      character: z.string().optional(),
    }),
  ),

  // Availability
  plan_required: z.string(),
  available_from: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditContentModalProps {
  contentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditContentModal({
  contentId,
  isOpen,
  onClose,
  onSuccess,
}: EditContentModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("general");

  // File states for replacement
  const [posterFile, setPosterFile] = React.useState<File | null>(null);
  const [bannerFile, setBannerFile] = React.useState<File | null>(null);
  const [trailerFile, setTrailerFile] = React.useState<File | null>(null);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_default: "",
      description: "",
      slug: "",
      type: "movie",
      age_rating: "16+",
      duration_minutes: "0",
      poster_url: "",
      banner_url: "",
      trailer_url: "",
      genres: [],
      tags: [],
      languages: [],
      cast: [],
      plan_required: "basic",
      available_from: new Date().toISOString().split("T")[0],
    },
  });

  const {
    fields: castFields,
    append: appendCast,
    remove: removeCast,
  } = useFieldArray({
    control: form.control,
    name: "cast",
  });

  React.useEffect(() => {
    if (isOpen && contentId) {
      const fetchContent = async () => {
        setFetching(true);
        try {
          const data = await adminService.getContentByID(contentId);
          form.reset({
            title_default: data.title?.default || "",
            description: data.description || "",
            slug: data.slug || "",
            type: data.type || "movie",
            age_rating: data.age_rating || "16+",
            duration_minutes: String(data.duration_minutes || 0),
            poster_url: data.poster_url || "",
            banner_url: data.banner_url || "",
            trailer_url: data.trailer_url || "",
            genres: data.genres || [],
            tags: data.tags || [],
            languages: data.languages || [],
            cast: data.cast || [],
            plan_required: data.availability?.plan_required || "basic",
            available_from: data.availability?.available_from?.$date
              ? new Date(data.availability.available_from.$date)
                  .toISOString()
                  .split("T")[0]
              : new Date().toISOString().split("T")[0],
          });
        } catch (error) {
          toast.error("Failed to fetch content details");
          onClose();
        } finally {
          setFetching(false);
        }
      };
      fetchContent();
    }
  }, [isOpen, contentId, form, onClose]);

  const onSubmit = async (values: FormValues) => {
    if (!contentId) return;
    setLoading(true);
    setUploadProgress(0);

    try {
      let finalPosterPath = values.poster_url;
      let finalBannerPath = values.banner_url;
      let finalTrailerPath = values.trailer_url;
      let finalVideoPath = ""; // This will trigger notification if changed

      // 1. Upload new assets if selected
      if (posterFile) {
        toast.info("Uploading new poster...");
        const data = await adminService.getUploadUrl(contentId, "poster");
        await adminService.uploadToMinio(data.upload_url, posterFile, (p) =>
          setUploadProgress(p),
        );
        finalPosterPath = data.storage_path;
        setUploadProgress(0);
      }

      if (bannerFile) {
        toast.info("Uploading new banner...");
        const data = await adminService.getUploadUrl(contentId, "banner");
        await adminService.uploadToMinio(data.upload_url, bannerFile, (p) =>
          setUploadProgress(p),
        );
        finalBannerPath = data.storage_path;
        setUploadProgress(0);
      }

      if (trailerFile) {
        toast.info("Uploading new trailer...");
        const data = await adminService.getUploadUrl(contentId, "trailer");
        await adminService.uploadToMinio(data.upload_url, trailerFile, (p) =>
          setUploadProgress(p),
        );
        finalTrailerPath = data.storage_path;
        setUploadProgress(0);
      }

      if (videoFile) {
        toast.info("Uploading new source video...");
        const data = await adminService.getUploadUrl(contentId, "source");
        await adminService.uploadToMinio(data.upload_url, videoFile, (p) =>
          setUploadProgress(p),
        );
        finalVideoPath = data.storage_path;
        setUploadProgress(0);
      }

      // 2. Update Metadata
      const payload: any = {
        title: {
          default: values.title_default,
        },
        description: values.description,
        slug: values.slug,
        type: values.type,
        age_rating: values.age_rating,
        duration_minutes: Number(values.duration_minutes),
        poster_url: finalPosterPath,
        banner_url: finalBannerPath,
        trailer_url: finalTrailerPath,
        genres: values.genres,
        tags: values.tags,
        languages: values.languages,
        cast: values.cast,
        availability: {
          plan_required: values.plan_required,
          available_from: {
            $date: new Date(values.available_from || "").toISOString(),
          },
          available_until: null,
        },
      };

      await adminService.updateContent(contentId, payload);

      // 3. Notify for video/trailer if changed
      if (finalTrailerPath && trailerFile) {
        await adminService.notifyUploadComplete({
          video_id: contentId,
          title: `${values.title_default} - Trailer`,
          description: `Trailer for ${values.title_default}`,
          storage_path: finalTrailerPath,
        });
      }

      if (finalVideoPath) {
        await adminService.notifyUploadComplete({
          video_id: contentId,
          title: values.title_default,
          description: values.description,
          storage_path: finalVideoPath,
        });
      }

      toast.success("Content updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update content");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl overflow-hidden h-[85vh] flex flex-col sm:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full sm:w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col p-4 shrink-0">
          <div className="mb-8 px-2">
            <h2 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Studio Editor
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Content Management
            </p>
          </div>

          <nav className="space-y-1 flex-1">
            {[
              { id: "general", label: "General Info", icon: Info },
              { id: "media", label: "Media & Assets", icon: ImageIcon },
              {
                id: "categorization",
                label: "Categorization",
                icon: LayoutDashboard,
              },
              { id: "cast", label: "Cast & Crew", icon: Video },
              { id: "availability", label: "Availability", icon: Globe },
              { id: "advanced", label: "Advanced Setup", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  activeTab === tab.id
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent",
                )}
              >
                <tab.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    activeTab === tab.id
                      ? "text-indigo-400"
                      : "text-zinc-600 group-hover:text-zinc-400",
                  )}
                />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="active-pill" className="ml-auto">
                    <ChevronRight className="h-3 w-3" />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-zinc-800/50">
            <div className="px-3 py-4 bg-zinc-900 rounded-xl border border-zinc-800 shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  Live Preview Active
                </span>
              </div>
              <p className="text-[9px] text-zinc-600">
                ID: {contentId?.slice(-8)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full bg-zinc-950/50 overflow-hidden relative">
          {fetching ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-sm text-zinc-500 animate-pulse">
                Synchronizing Studio Data...
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <AnimatePresence mode="wait">
                      {activeTab === "general" && (
                        <motion.div
                          key="general"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField<FormValues>
                              control={form.control}
                              name="title_default"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    Default Title
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      value={(field.value as string) || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      className="bg-zinc-900 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-indigo-50 shadow-inner"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField<FormValues>
                              control={form.control}
                              name="slug"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    Slug (URL)
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                                      <Input
                                        value={(field.value as string) || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="pl-9 bg-zinc-900 border-zinc-800 focus:border-indigo-500/50 text-indigo-50"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    value={(field.value as string) || ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                    rows={6}
                                    className="bg-zinc-900 border-zinc-800 focus:border-indigo-500/50 text-indigo-50 resize-none shadow-inner"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField<FormValues>
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    Media Type
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={(field.value as string) || ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-indigo-50">
                                        <SelectValue placeholder="Type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                      <SelectItem value="movie">
                                        Movie
                                      </SelectItem>
                                      <SelectItem value="series">
                                        Series
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField<FormValues>
                              control={form.control}
                              name="age_rating"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    Age Rating
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={(field.value as string) || ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-indigo-50">
                                        <SelectValue placeholder="Rating" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                      <SelectItem value="U">
                                        General (U)
                                      </SelectItem>
                                      <SelectItem value="13+">13+</SelectItem>
                                      <SelectItem value="16+">16+</SelectItem>
                                      <SelectItem value="18+">18+</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField<FormValues>
                              control={form.control}
                              name="duration_minutes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    Duration (Min)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      value={(field.value as string) || "0"}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      className="bg-zinc-900 border-zinc-800 focus:border-indigo-500/50 text-indigo-50"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "media" && (
                        <motion.div
                          key="media"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8 pb-10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {/* Poster Card */}
                            <div className="md:col-span-2 space-y-3">
                              <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                Poster (2:3)
                              </FormLabel>
                              <div
                                className={cn(
                                  "aspect-2/3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group",
                                  posterFile
                                    ? "border-indigo-500 bg-indigo-500/5"
                                    : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700",
                                )}
                                onClick={() =>
                                  document
                                    .getElementById("studio-poster")
                                    ?.click()
                                }
                              >
                                <input
                                  type="file"
                                  id="studio-poster"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) =>
                                    e.target.files &&
                                    setPosterFile(e.target.files[0])
                                  }
                                />
                                {posterFile ? (
                                  <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-400">
                                    <CheckCircle2 className="h-10 w-10 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">
                                      Ready to Sync
                                    </span>
                                  </div>
                                ) : form.getValues("poster_url") ? (
                                  <>
                                    <Image
                                      src={resolveStorageUrl(
                                        form.getValues("poster_url") || "",
                                      )}
                                      alt="Poster"
                                      fill
                                      className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                      unoptimized={true}
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center">
                                      <Upload className="h-6 w-6 text-white/50 group-hover:text-white transition-all scale-90 group-hover:scale-110" />
                                      <span className="text-[10px] font-bold text-white/50 group-hover:text-white mt-2">
                                        Replace File
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-zinc-600 flex flex-col items-center">
                                    <Upload className="h-8 w-8 mb-2" />
                                    <span className="text-[10px] font-bold">
                                      New Upload
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Banner Card */}
                            <div className="md:col-span-3 space-y-6">
                              <div className="space-y-3">
                                <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                  Banner (21:9)
                                </FormLabel>
                                <div
                                  className={cn(
                                    "aspect-21/9 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group",
                                    bannerFile
                                      ? "border-indigo-500 bg-indigo-500/5"
                                      : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700",
                                  )}
                                  onClick={() =>
                                    document
                                      .getElementById("studio-banner")
                                      ?.click()
                                  }
                                >
                                  <input
                                    type="file"
                                    id="studio-banner"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      e.target.files &&
                                      setBannerFile(e.target.files[0])
                                    }
                                  />
                                  {bannerFile ? (
                                    <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-400">
                                      <CheckCircle2 className="h-10 w-10 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter">
                                        Ready to Sync
                                      </span>
                                    </div>
                                  ) : form.getValues("banner_url") ? (
                                    <>
                                      <Image
                                        src={resolveStorageUrl(
                                          form.getValues("banner_url") || "",
                                        )}
                                        alt="Banner"
                                        fill
                                        className="object-cover opacity-60 group-hover:scale-105 transition-all duration-700"
                                        unoptimized={true}
                                      />
                                      <div className="absolute inset-0 bg-black/40 transition-colors flex flex-col items-center justify-center">
                                        <Upload className="h-6 w-6 text-white/50" />
                                        <span className="text-[10px] font-bold text-white/50 mt-2">
                                          Replace File
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-zinc-600 flex flex-col items-center">
                                      <Upload className="h-8 w-8 mb-2" />
                                      <span className="text-[10px] font-bold">
                                        New Upload
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div
                                  className={cn(
                                    "p-4 rounded-xl border border-zinc-800 flex items-center gap-4 cursor-pointer hover:bg-zinc-900 transition-all",
                                    trailerFile
                                      ? "border-indigo-500/50 bg-indigo-50/5"
                                      : "bg-zinc-900/50",
                                  )}
                                  onClick={() =>
                                    document
                                      .getElementById("studio-trailer")
                                      ?.click()
                                  }
                                >
                                  <input
                                    type="file"
                                    id="studio-trailer"
                                    className="hidden"
                                    accept="video/*"
                                    onChange={(e) =>
                                      e.target.files &&
                                      setTrailerFile(e.target.files[0])
                                    }
                                  />
                                  <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                                    {trailerFile ? (
                                      <CheckCircle2 className="text-emerald-500" />
                                    ) : (
                                      <Play className="text-zinc-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-zinc-200">
                                      Trailer Video
                                    </p>
                                    <p className="text-[10px] text-zinc-500 truncate">
                                      {trailerFile
                                        ? trailerFile.name
                                        : "High-quality MP4 file recommended"}
                                    </p>
                                  </div>
                                </div>

                                <div
                                  className={cn(
                                    "p-4 rounded-xl border border-zinc-800 flex items-center gap-4 cursor-pointer hover:bg-zinc-900 transition-all",
                                    videoFile
                                      ? "border-indigo-500/50 bg-indigo-50/5"
                                      : "bg-zinc-900/50",
                                  )}
                                  onClick={() =>
                                    document
                                      .getElementById("studio-video")
                                      ?.click()
                                  }
                                >
                                  <input
                                    type="file"
                                    id="studio-video"
                                    className="hidden"
                                    accept="video/*"
                                    onChange={(e) =>
                                      e.target.files &&
                                      setVideoFile(e.target.files[0])
                                    }
                                  />
                                  <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                                    {videoFile ? (
                                      <CheckCircle2 className="text-emerald-500" />
                                    ) : (
                                      <Video className="text-zinc-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-zinc-200">
                                      Main Feature Film
                                    </p>
                                    <p className="text-[10px] text-zinc-500 truncate">
                                      {videoFile
                                        ? videoFile.name
                                        : "Replacing this will trigger new HLS transcoding"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "categorization" && (
                        <motion.div
                          key="categorization"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                          <div className="space-y-4">
                            <FormField<FormValues>
                              control={form.control}
                              name="genres"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase">
                                    Genres
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Action, Sci-Fi, Drama (Comma separated)"
                                      className="bg-zinc-900 border-zinc-800"
                                      value={
                                        (field.value as string[])?.join(", ") ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter((t) => t !== ""),
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription className="text-[10px] text-zinc-600">
                                    Enter genres separated by commas.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <FormField<FormValues>
                              control={form.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase">
                                    Search Tags
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Blockbuster, Space, Viral"
                                      className="bg-zinc-900 border-zinc-800"
                                      value={
                                        (field.value as string[])?.join(", ") ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter((t) => t !== ""),
                                        )
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField<FormValues>
                              control={form.control}
                              name="languages"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase">
                                    Audio Languages
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="English, Hindi, Spanish"
                                      className="bg-zinc-900 border-zinc-800"
                                      value={
                                        (field.value as string[])?.join(", ") ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter((t) => t !== ""),
                                        )
                                      }
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "cast" && (
                        <motion.div
                          key="cast"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-sm font-bold text-zinc-200">
                                Cast & Production Crew
                              </h3>
                              <p className="text-[10px] text-zinc-500">
                                Manage the talent associated with this content
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20"
                              onClick={() =>
                                appendCast({
                                  name: "",
                                  role: "Actor",
                                  character: "",
                                })
                              }
                            >
                              <Plus className="h-3 w-3 mr-2" /> Add Member
                            </Button>
                          </div>

                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {castFields.map((field, index) => (
                              <div
                                key={field.id}
                                className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col gap-4 relative group"
                              >
                                <button
                                  type="button"
                                  onClick={() => removeCast(index)}
                                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField<FormValues>
                                    control={form.control}
                                    name={`cast.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] font-bold text-zinc-500 uppercase">
                                          Real Name
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            value={
                                              (field.value as string) || ""
                                            }
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                            className="h-9 bg-zinc-900 border-zinc-800 text-sm"
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField<FormValues>
                                    control={form.control}
                                    name={`cast.${index}.role`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] font-bold text-zinc-500 uppercase">
                                          Role
                                        </FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          value={(field.value as string) || ""}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-sm">
                                              <SelectValue />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                            <SelectItem value="Actor">
                                              Actor
                                            </SelectItem>
                                            <SelectItem value="Director">
                                              Director
                                            </SelectItem>
                                            <SelectItem value="Producer">
                                              Producer
                                            </SelectItem>
                                            <SelectItem value="Writer">
                                              Writer
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField<FormValues>
                                  control={form.control}
                                  name={`cast.${index}.character`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[10px] font-bold text-zinc-500 uppercase">
                                        Character / Department
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          value={(field.value as string) || ""}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                          name={field.name}
                                          ref={field.ref}
                                          className="h-9 bg-zinc-900 border-zinc-800 text-sm"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                            {castFields.length === 0 && (
                              <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
                                <Video className="h-8 w-8 text-zinc-800 mx-auto mb-2" />
                                <p className="text-zinc-600 text-xs font-medium">
                                  No cast members added yet
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "availability" && (
                        <motion.div
                          key="availability"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField<FormValues>
                              control={form.control}
                              name="plan_required"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase">
                                    Subscription Tier
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={(field.value as string) || ""}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-indigo-50">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                      <SelectItem value="free">
                                        Free for All
                                      </SelectItem>
                                      <SelectItem value="basic">
                                        Basic Plan Required
                                      </SelectItem>
                                      <SelectItem value="premium">
                                        Premium Plan Exclusive
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription className="text-[10px] text-zinc-600">
                                    Which users can watch this?
                                  </FormDescription>
                                </FormItem>
                              )}
                            />

                            <FormField<FormValues>
                              control={form.control}
                              name="available_from"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs font-bold uppercase">
                                    Release Date
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                      <Input
                                        type="date"
                                        value={(field.value as string) || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="pl-10 bg-zinc-900 border-zinc-800 text-indigo-50"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormDescription className="text-[10px] text-zinc-600">
                                    When should this go live?
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <div className="flex gap-4">
                              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-emerald-400">
                                  Visibility Optimized
                                </p>
                                <p className="text-[10px] text-emerald-800/60 leading-relaxed mt-1 uppercase font-black">
                                  Content is currently set to published and will
                                  be immediately visible on the storefront once
                                  transcoding completes.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "advanced" && (
                        <motion.div
                          key="advanced"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-200 text-sm flex gap-3">
                            <Info className="h-5 w-5 shrink-0" />
                            <p>
                              Advanced setup allows you to manually correct
                              storage paths and metadata structure. Use with
                              caution.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <FormField<FormValues>
                              control={form.control}
                              name="poster_url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-500 text-[10px] font-black uppercase">
                                    Manual Poster Path
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      value={(field.value as string) || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      className="h-9 text-xs bg-zinc-900 border-zinc-800"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField<FormValues>
                              control={form.control}
                              name="banner_url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-500 text-[10px] font-black uppercase">
                                    Manual Banner Path
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      value={(field.value as string) || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      className="h-9 text-xs bg-zinc-900 border-zinc-800"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField<FormValues>
                              control={form.control}
                              name="trailer_url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-500 text-[10px] font-black uppercase">
                                    Manual Trailer Path
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      value={(field.value as string) || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      className="h-9 text-xs bg-zinc-900 border-zinc-800"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </Form>
              </div>

              {/* Action Bar Footer */}
              <div className="shrink-0 p-6 bg-zinc-900/90 backdrop-blur-2xl border-t border-zinc-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                  disabled={loading}
                >
                  Discard Changes
                </Button>

                <div className="flex items-center gap-3">
                  {loading && uploadProgress > 0 && (
                    <div className="text-right mr-4">
                      <p className="text-[10px] font-black text-indigo-400 animate-pulse tracking-widest">
                        UPLOADING ASSETS
                      </p>
                      <p className="text-xs font-black text-white">
                        {uploadProgress}% COMPLETE
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[160px] h-11 font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02] border-t border-white/10"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Syncing Studio...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>Publish All Changes</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
