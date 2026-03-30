"use client";

import React, { useState } from "react";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  FileVideo,
  X,
  Plus,
  Trash2,
  Globe,
  Clapperboard,
  Layout,
  Clock,
  Shield,
  Tag,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TextareaFallback = (props: any) => (
  <textarea
    {...props}
    className={cn(
      "flex min-h-[100px] w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      props.className,
    )}
  />
);

interface VideoUploadFormProps {
  onSuccess: (data: any) => void;
  onClose: () => void;
}

export default function VideoUploadForm({
  onSuccess,
  onClose,
}: VideoUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: {
      default: "",
      localized: { hi: "" },
    },
    description: "",
    type: "movie",
    genres: [] as string[],
    languages: ["English"] as string[],
    release_date: new Date().toISOString().split("T")[0],
    age_rating: "12+",
    duration_minutes: 0,
    poster_url: "",
    banner_url: "",
    trailer_url: "",
    tags: [] as string[],
    cast: [] as {
      person_id: string;
      name: string;
      role: string;
      character: string;
    }[],
    availability: {
      plan_required: "free",
      available_from: new Date().toISOString().split("T")[0],
    },
    // Type specific
    seasons: [] as {
      season_number: number;
      title: string;
      episode_count: number;
    }[],
    live: {
      start_time: "",
      end_time: "",
    },
    videoFile: null as File | null,
    trailerFile: null as File | null,
    posterFile: null as File | null,
    bannerFile: null as File | null,
  });

  const [newGenre, setNewGenre] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "videoFile" | "trailerFile" | "posterFile" | "bannerFile" = "videoFile") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const addGenre = () => {
    if (newGenre && !formData.genres.includes(newGenre)) {
      setFormData({ ...formData, genres: [...formData.genres, newGenre] });
      setNewGenre("");
    }
  };

  const removeGenre = (genre: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((g) => g !== genre),
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addCastMember = () => {
    setFormData({
      ...formData,
      cast: [
        ...formData.cast,
        {
          person_id: `p${formData.cast.length + 1}`,
          name: "",
          role: "Actor",
          character: "",
        },
      ],
    });
  };

  const updateCastMember = (index: number, field: string, value: string) => {
    const newCast = [...formData.cast];
    newCast[index] = { ...newCast[index], [field]: value };
    setFormData({ ...formData, cast: newCast });
  };

  const removeCastMember = (index: number) => {
    setFormData({
      ...formData,
      cast: formData.cast.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    if (!formData.videoFile || !formData.title.default || !formData.posterFile || !formData.bannerFile) {
      setError(
        "Please provide a title, poster, banner, and select a video file.",
      );
      return;
    }
    setError(null);

    // Prepare final JSON structure with proper date formatting for Go
    const finalData = { ...formData };
    finalData.release_date = new Date(formData.release_date).toISOString();
    finalData.availability = {
      ...formData.availability,
      available_from: new Date(
        formData.availability.available_from,
      ).toISOString(),
    };

    if (finalData.type === "live" && finalData.live.start_time) {
      finalData.live.start_time = new Date(
        finalData.live.start_time,
      ).toISOString();
      finalData.live.end_time = new Date(finalData.live.end_time).toISOString();
    }

    console.log("🚀 Submitting Content Metadata:", finalData);
    onSuccess(finalData); // pass formatted data
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-white z-20 py-4 -mt-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Add New Content
            </h1>
            <p className="text-xs text-zinc-500">
              Register metadata and upload source binary.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full flex flex-col">
        <TabsList className="w-full grid grid-cols-4 bg-zinc-100 p-1 rounded-xl mb-8 h-12">
          <TabsTrigger
            value="basic"
            className="rounded-lg text-zinc-500 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="rounded-lg text-zinc-500 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
          >
            Media & URLs
          </TabsTrigger>
          <TabsTrigger
            value="cast"
            className="rounded-lg text-zinc-500 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
          >
            Cast & Tags
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="rounded-lg text-zinc-500 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
          >
            Availability
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="basic"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Globe className="h-3 w-3" /> Default Title (EN)
              </Label>
              <Input
                placeholder="e.g. Interstellar"
                value={formData.title.default}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, default: e.target.value },
                  })
                }
                className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Globe className="h-3 w-3" /> Localized Title (HI)
              </Label>
              <Input
                placeholder="e.g. इंटरस्टेलर"
                value={formData.title.localized.hi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: {
                      ...formData.title,
                      localized: {
                        ...formData.title.localized,
                        hi: e.target.value,
                      },
                    },
                  })
                }
                className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Layout className="h-3 w-3" /> Description
            </Label>
            <TextareaFallback
              placeholder="When Earth becomes uninhabitable, a team of ex-pilots..."
              value={formData.description}
              onChange={(e: any) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Clapperboard className="h-3 w-3" /> Type
              </Label>
              <Select
                onValueChange={(v) => setFormData({ ...formData, type: v })}
                defaultValue={formData.type}
              >
                <SelectTrigger className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200 shadow-2xl rounded-xl z-100">
                  <SelectItem
                    value="movie"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    Movie
                  </SelectItem>
                  <SelectItem
                    value="show"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    TV Show
                  </SelectItem>
                  <SelectItem
                    value="live"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    Live Event
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Release Date
              </Label>
              <Input
                type="date"
                value={formData.release_date}
                onChange={(e) =>
                  setFormData({ ...formData, release_date: e.target.value })
                }
                className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Clock className="h-3 w-3" /> Duration (Min)
              </Label>
              <Input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_minutes: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Shield className="h-3 w-3" /> Age Rating
              </Label>
              <Select
                onValueChange={(v) =>
                  setFormData({ ...formData, age_rating: v })
                }
                defaultValue={formData.age_rating}
              >
                <SelectTrigger className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200 shadow-2xl rounded-xl z-100">
                  <SelectItem
                    value="G"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    G
                  </SelectItem>
                  <SelectItem
                    value="12+"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    12+
                  </SelectItem>
                  <SelectItem
                    value="16+"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    16+
                  </SelectItem>
                  <SelectItem
                    value="18+"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    18+
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Genres (Action, Sci-Fi...)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add genre"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addGenre())
                  }
                  className="bg-zinc-50 border-zinc-200 h-12 rounded-xl text-zinc-900 font-medium"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addGenre}
                  className="h-12 w-12 rounded-xl border-zinc-200"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-2 group transition-all hover:bg-indigo-100"
                  >
                    {g}
                    <X
                      className="h-4 w-4 cursor-pointer opacity-50 group-hover:opacity-100"
                      onClick={() => removeGenre(g)}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="media"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Layout className="h-3 w-3" /> Poster Image
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer h-48",
                    formData.posterFile
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100/50",
                  )}
                  onClick={() => document.getElementById("poster-upload")?.click()}
                >
                  <input
                    type="file"
                    id="poster-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "posterFile")}
                  />
                  {formData.posterFile ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs font-bold text-zinc-900 truncate max-w-[150px]">
                        {formData.posterFile.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-zinc-400 hover:text-red-500 font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, posterFile: null });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-zinc-400 mb-2" />
                      <p className="text-xs font-bold text-zinc-900">Upload Poster</p>
                      <p className="text-[10px] text-zinc-400">Portrait (2:3)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Layout className="h-3 w-3" /> Banner Image
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer h-48",
                    formData.bannerFile
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100/50",
                  )}
                  onClick={() => document.getElementById("banner-upload")?.click()}
                >
                  <input
                    type="file"
                    id="banner-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "bannerFile")}
                  />
                  {formData.bannerFile ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs font-bold text-zinc-900 truncate max-w-[150px]">
                        {formData.bannerFile.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-zinc-400 hover:text-red-500 font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, bannerFile: null });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-zinc-400 mb-2" />
                      <p className="text-xs font-bold text-zinc-900">Upload Banner</p>
                      <p className="text-[10px] text-zinc-400">Landscape (16:9)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <Label className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Play className="h-4 w-4 text-indigo-600" /> Trailer Video (Preview)
              </Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer",
                  formData.trailerFile
                    ? "border-indigo-500 bg-indigo-50/20"
                    : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100/50",
                )}
                onClick={() => document.getElementById("trailer-upload")?.click()}
              >
                <input
                  type="file"
                  id="trailer-upload"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "trailerFile")}
                />
                {formData.trailerFile ? (
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-zinc-900">
                        {formData.trailerFile.name}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {(formData.trailerFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] text-zinc-400 hover:text-red-500 ml-4 font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, trailerFile: null });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center mb-2">
                      <Upload className="h-5 w-5 text-zinc-400" />
                    </div>
                    <p className="text-xs font-bold text-zinc-900">
                      Upload trailer clip
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Short preview video (Max 500MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <Label className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-indigo-600" /> Source Video
              File
            </Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer",
                formData.videoFile
                  ? "border-indigo-500 bg-indigo-50/20"
                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100/50",
              )}
              onClick={() => document.getElementById("video-upload")?.click()}
            >
              <input
                type="file"
                id="video-upload"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
              {formData.videoFile ? (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-zinc-900">
                      {formData.videoFile.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {(formData.videoFile.size / (1024 * 1024)).toFixed(0)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-red-500 ml-4 font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, videoFile: null });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-zinc-400" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">
                    Choose source video
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    MP4, MKV or MOV (Up to 2GB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="cast"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Users className="h-3 w-3" /> Cast & Crew
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCastMember}
                className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-bold rounded-xl px-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Person
              </Button>
            </div>

            <div className="space-y-4">
              {formData.cast.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl border-zinc-100 bg-zinc-50/50">
                  <Users className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-medium">
                    No cast members added yet.
                  </p>
                </div>
              )}
              {formData.cast.map((person, i) => (
                <div
                  key={i}
                  className="grid grid-cols-7 gap-4 items-center bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="col-span-3 space-y-2">
                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Full Name
                    </Label>
                    <Input
                      placeholder="e.g. Matthew McConaughey"
                      value={person.name}
                      onChange={(e) =>
                        updateCastMember(i, "name", e.target.value)
                      }
                      className="bg-zinc-50 border-zinc-100 h-11 rounded-xl text-zinc-900 font-medium"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Character / Role
                    </Label>
                    <Input
                      placeholder="e.g. Cooper"
                      value={person.character}
                      onChange={(e) =>
                        updateCastMember(i, "character", e.target.value)
                      }
                      className="bg-zinc-50 border-zinc-100 h-11 rounded-xl text-zinc-900 font-medium"
                    />
                  </div>
                  <div className="flex justify-center pt-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCastMember(i)}
                      className="text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-6 border-t border-zinc-100">
            <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
              <Tag className="h-3 w-3" /> Search Tags
            </Label>
            <div className="flex gap-3">
              <Input
                placeholder="e.g. space, sci-fi, nolan"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="bg-zinc-50 border-zinc-200 h-12 rounded-xl text-zinc-900 font-medium"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="h-12 px-6 rounded-xl border-zinc-200 font-bold"
              >
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-[11px] font-bold rounded-xl flex items-center gap-2 group transition-all hover:bg-zinc-200"
                >
                  #{t}
                  <X
                    className="h-3.5 w-3.5 cursor-pointer opacity-40 group-hover:opacity-100"
                    onClick={() => removeTag(t)}
                  />
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="availability"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Subscription Requirement
              </Label>
              <Select
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    availability: {
                      ...formData.availability,
                      plan_required: v,
                    },
                  })
                }
                defaultValue={formData.availability.plan_required}
              >
                <SelectTrigger className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200 shadow-2xl rounded-xl z-100">
                  <SelectItem
                    value="free"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    Free / Public
                  </SelectItem>
                  <SelectItem
                    value="basic"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    Basic Plan
                  </SelectItem>
                  <SelectItem
                    value="premium"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    Premium Plan
                  </SelectItem>
                  <SelectItem
                    value="vip"
                    className="text-zinc-900 font-medium focus:bg-indigo-50"
                  >
                    VIP Special Access
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Available From
              </Label>
              <Input
                type="date"
                value={formData.availability.available_from}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: {
                      ...formData.availability,
                      available_from: e.target.value,
                    },
                  })
                }
                className="bg-zinc-50 border-zinc-200 text-zinc-900 font-bold h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden"
              />
            </div>
          </div>

          {formData.type === "live" && (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 space-y-4">
              <h3 className="text-sm font-bold text-orange-900 flex items-center gap-2">
                <Play className="h-4 w-4 fill-orange-600" /> Live Stream
                Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-orange-700 uppercase">
                    Start Time
                  </Label>
                  <Input
                    type="datetime-local"
                    className="bg-white border-orange-200"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        live: { ...formData.live, start_time: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-orange-700 uppercase">
                    End Time
                  </Label>
                  <Input
                    type="datetime-local"
                    className="bg-white border-orange-200"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        live: { ...formData.live, end_time: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === "show" && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-4">
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Layout className="h-4 w-4 text-indigo-600" /> Season Management
              </h3>
              <p className="text-xs text-indigo-600 italic">
                For TV Shows, you can manage seasons and episodes in the catalog
                after creation.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col gap-4 sticky bottom-0 bg-white py-4 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 text-lg shadow-lg shadow-indigo-100 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={handleSubmit}
        >
          <Play className="mr-2 h-5 w-5 fill-white" />
          Prepare Assets & Launch Pipeline
        </Button>
        {error && (
          <div className="flex items-center gap-2 text-red-600 justify-center">
            <AlertCircle className="h-4 w-4" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
