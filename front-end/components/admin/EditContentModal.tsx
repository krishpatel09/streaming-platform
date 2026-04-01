"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { adminService } from "@/serivces/admin.service";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";

/**
 * We use strings for all form fields including duration to avoid complex 
 * type inference issues between Zod, React Hook Form, and the UI components.
 * Conversion to number happens at the API boundary in onSubmit.
 */
const formSchema = z.object({
  title_default: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  age_rating: z.string().min(1, "Age rating is required"),
  duration_minutes: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Duration must be a number",
  }),
  poster_url: z.string().url("Must be a valid URL").or(z.literal("")),
  banner_url: z.string().url("Must be a valid URL").or(z.literal("")),
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
    },
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
    try {
      const payload = {
        title: {
          default: values.title_default,
        },
        description: values.description,
        slug: values.slug,
        type: values.type,
        age_rating: values.age_rating,
        duration_minutes: Number(values.duration_minutes),
        poster_url: values.poster_url,
        banner_url: values.banner_url,
      };

      await adminService.updateContent(contentId, payload);
      toast.success("Content updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white border-zinc-200 text-zinc-900 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div>
            <DialogTitle className="text-2xl font-bold">Edit Content</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Update the metadata and primary settings for this item.
            </DialogDescription>
          </div>
        </DialogHeader>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-zinc-500 font-medium">Loading details...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title_default"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Default Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-50 border-zinc-200 focus:bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Slug (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="auto-generated-if-empty" className="bg-zinc-50 border-zinc-200 focus:bg-white" />
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
                    <FormLabel className="text-zinc-700 font-bold">Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} className="bg-zinc-50 border-zinc-200 focus:bg-white resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Media Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-50 border-zinc-200">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-zinc-200">
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="series">Series</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Age Rating</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-50 border-zinc-200">
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-zinc-200">
                          <SelectItem value="U">General (U)</SelectItem>
                          <SelectItem value="PG">PG</SelectItem>
                          <SelectItem value="13+">13+</SelectItem>
                          <SelectItem value="16+">16+</SelectItem>
                          <SelectItem value="18+">Adult (18+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Duration (Min)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-zinc-50 border-zinc-200 focus:bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField<FormValues, "poster_url">
                  control={form.control}
                  name="poster_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Poster URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-50 border-zinc-200 focus:bg-white" />
                      </FormControl>
                      <FormDescription className="text-[10px]">Example: raw/67ce..._poster.jpg</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<FormValues, "banner_url">
                  control={form.control}
                  name="banner_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-bold">Banner URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-50 border-zinc-200 focus:bg-white" />
                      </FormControl>
                      <FormDescription className="text-[10px]">Example: raw/67ce..._banner.jpg</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-6 border-t border-zinc-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
