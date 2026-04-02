"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  Play,
  FileVideo,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminService } from "@/serivces/admin.service";
import { cn } from "@/lib/utils";

interface VideoProcessingStatusProps {
  title: {
    default: string;
    localized?: { [key: string]: string };
  };
  description: string;
  type: string;
  genres: string[];
  languages: string[];
  release_date: string;
  age_rating: string;
  duration_minutes: number;
  poster_url?: string;
  banner_url?: string;
  trailer_url?: string;
  tags?: string[];
  cast?: any[];
  availability?: any;
  seasons?: any[];
  live?: any;
  videoFile: File;
  trailerFile?: File | null;
  posterFile?: File | null;
  bannerFile?: File | null;
  videoID?: string;
  onClose: () => void;
}

export default function VideoProcessingStatus(
  props: VideoProcessingStatusProps,
) {
  const {
    title,
    videoFile,
    trailerFile,
    posterFile,
    bannerFile,
    onClose,
    videoID: propVideoID,
  } = props;
  const [step, setStep] = useState(0); // 1: Metadata, 2: Assets, 3: Binary, 4: Notifying, 5: Success
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isStarted = useRef(false);

  useEffect(() => {
    const startProcess = async () => {
      if (isStarted.current) return;
      isStarted.current = true;

      try {
        setLoading(true);
        setError(null);

        const videoID = propVideoID;
        if (!videoID)
          throw new Error("No Video ID provided to processing status");

        // Step 2: Upload Assets (Poster, Banner, Trailer)
        setStep(2);
        let finalPosterPath = "";
        let finalBannerPath = "";
        let finalTrailerPath = "";

        if (posterFile) {
          console.log("🖼️ Uploading Poster...");
          const posterUrlData = await adminService.getUploadUrl(
            videoID,
            "poster",
          );
          await adminService.uploadToMinio(
            posterUrlData.upload_url,
            posterFile,
            (p) => setUploadProgress(p),
          );
          finalPosterPath = posterUrlData.storage_path;
          setUploadProgress(0);
        }

        if (bannerFile) {
          console.log("🖼️ Uploading Banner...");
          const bannerUrlData = await adminService.getUploadUrl(
            videoID,
            "banner",
          );
          await adminService.uploadToMinio(
            bannerUrlData.upload_url,
            bannerFile,
            (p) => setUploadProgress(p),
          );
          finalBannerPath = bannerUrlData.storage_path;
          setUploadProgress(0);
        }

        if (trailerFile) {
          console.log("🎬 Uploading Trailer...");
          const trailerUrlData = await adminService.getUploadUrl(
            videoID,
            "trailer",
          );
          await adminService.uploadToMinio(
            trailerUrlData.upload_url,
            trailerFile,
            (p) => setUploadProgress(p),
          );
          finalTrailerPath = trailerUrlData.storage_path;
          setUploadProgress(0);
        }

        // Step 3: Direct binary upload for Main Video
        setStep(3);
        const { upload_url, storage_path } = await adminService.getUploadUrl(
          videoID,
          "source",
        );
        await adminService.uploadToMinio(upload_url, videoFile, (percent) => {
          setUploadProgress(percent);
        });

        // Step 4: Finalize Metadata & Trigger Processing
        setStep(4);
        // Save poster/banner/trailer URLs to catalog record
        if (finalPosterPath || finalBannerPath || finalTrailerPath) {
          await adminService.updateContent(videoID, {
            poster_url: finalPosterPath,
            banner_url: finalBannerPath,
            trailer_url: finalTrailerPath,
          });
        }

        if (finalTrailerPath) {
          await adminService.notifyUploadComplete({
            video_id: videoID,
            title: `${title.default} - Trailer`,
            description: `Trailer for ${title.default}`,
            storage_path: finalTrailerPath,
          });
        }

        await adminService.notifyUploadComplete({
          video_id: videoID,
          title: title.default,
          description: props.description,
          storage_path: storage_path,
        });

        // Step 5: Transcoding Pipeline Implementation (SSE Push)
        setStep(5);
        await new Promise<void>((resolve, reject) => {
          const eventSource = new EventSource(
            adminService.getNotificationUrl(videoID),
          );
          eventSource.onmessage = (event) => {
            const data = event.data.trim();
            if (data === "completed") {
              console.log("✅ Transcoding finished! Signal received via SSE.");
              eventSource.close();
              setLoading(false);
              resolve();
            }
          };
          eventSource.onerror = (err) => {
            console.error("SSE Connection Error:", err);
            eventSource.close();
            // Optional: fallback to poll if SSE fails, but here we show error
            reject(new Error("Lost connection to notification service."));
          };
          // Timeout after 10 mins
          setTimeout(() => {
            eventSource.close();
            reject(new Error("Transcoding timed out."));
          }, 600000);
        });

        setStep(7); // Final Success (All checks green)
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(
          err.message || "An unexpected error occurred during processing.",
        );
      } finally {
        setLoading(false);
      }
    };

    startProcess();
  }, [videoFile, title, props.description]); // Reduced deps for safety, title object change will trigger

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Upload className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              Uploading & Processing
            </h2>
            <p className="text-sm text-zinc-500 font-medium">{title.default}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {step < 6 && !error && (
            <Card className="border-0 shadow-xl shadow-zinc-200/50 bg-white p-12 flex flex-col items-center justify-center text-center">
              <div className="relative h-40 w-40 mb-8">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-zinc-100 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-indigo-600 stroke-current transition-all duration-300 ease-in-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      40 *
                      (1 -
                        (step > 3 ? 100 : step === 3 ? uploadProgress : 0) /
                          100)
                    }
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-zinc-900">
                    {step > 3 ? "100" : step === 3 ? uploadProgress : "0"}%
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                {step === 1 && "Registering Metadata..."}
                {step === 2 && "Syncing Visual Assets..."}
                {step === 3 && "Uploading Video Binary..."}
                {step === 4 && "Finalizing & Launching..."}
              </h2>
              <p className="text-zinc-500 max-w-xs mx-auto">
                {step <= 3
                  ? "Please do not close this window while we securely upload your content to our storage servers."
                  : "Metadata registered. Storage secured. Upload finished. Now triggering the transcoding workers."}
              </p>

              <div className="w-full mt-12 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 text-left">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    File Size
                  </p>
                  <p className="text-sm font-bold text-zinc-700">
                    {(videoFile.size / (1024 * 1024)).toFixed(0)} MB
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 text-left">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Current Activity
                  </p>
                  <p className="text-sm font-bold text-indigo-600 animate-pulse">
                    {step === 1 && "Cataloging"}
                    {step === 2 && "Visualizing"}
                    {step === 3 && "Streaming"}
                    {step === 4 && "Broadcasting"}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {step >= 6 && (
            <Card className="border-0 shadow-xl shadow-zinc-200/50 bg-white p-12 flex flex-col items-center justify-center text-center scale-in duration-500">
              <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8 shadow-inner">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-zinc-900 mb-4">
                Mission Success!
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto mb-8">
                Your video{" "}
                <span className="font-bold text-zinc-900">
                  "{title.default}"
                </span>{" "}
                has been registered and uploaded. The transcoding pipeline is
                now generating adaptive bitrates.
              </p>
              <div className="flex gap-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                  onClick={onClose}
                >
                  Back to Library
                </Button>
              </div>
            </Card>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6 text-red-600">
                <AlertCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-red-900 mb-2">
                Process Interrupted
              </h2>
              <p className="text-sm text-red-600 mb-8 max-w-sm">{error}</p>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 px-8"
              >
                Dismiss & Restart
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border border-zinc-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-50 bg-zinc-50/30">
              <CardTitle className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Pipeline Status View
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {[
                { s: 1, name: "1. Metadata Registration" },
                { s: 2, name: "2. Visual Asset Upload" },
                { s: 3, name: "3. Direct Binary Upload" },
                { s: 4, name: "4. Trigger Processing" },
                { s: 5, name: "5. Transcoding Engine" },
                { s: 6, name: "6. Finalizing Assets" },
              ].map((item) => (
                <div key={item.s} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        step >= item.s
                          ? step === item.s
                            ? "bg-indigo-600 animate-pulse ring-4 ring-indigo-100"
                            : "bg-emerald-500"
                          : "bg-zinc-200",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold transition-colors",
                        step >= item.s ? "text-zinc-900" : "text-zinc-400",
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                  {step > item.s && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {step === item.s && (
                    <div className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-zinc-100 bg-linear-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold opacity-80 uppercase tracking-widest">
                Active Manifest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              <p className="text-xs text-indigo-100 flex justify-between border-b border-white/10 pb-2">
                <span>Format</span>
                <span className="font-bold text-white uppercase">
                  {videoFile.name.split(".").pop()}
                </span>
              </p>
              <p className="text-xs text-indigo-100 flex justify-between border-b border-white/10 pb-2">
                <span>Type</span>
                <span className="font-bold text-white uppercase">
                  {props.type}
                </span>
              </p>
              <p className="text-xs text-indigo-100 flex justify-between">
                <span>Rating</span>
                <span className="font-bold text-white">{props.age_rating}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
