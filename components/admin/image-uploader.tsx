"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  bucket: "product-images" | "category-images" | "banner-images";
  images: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
}

export function ImageUploader({
  bucket,
  images,
  onChange,
  multiple = false,
  maxImages = 10
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSupabase = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Compress image helper using canvas
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            "image/jpeg",
            0.82 // Quality factor
          );
        };
      };
    });
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Compress first
    const compressedBlob = await compressImage(file);
    const compressedFile = new File([compressedBlob], file.name, {
      type: "image/jpeg"
    });

    if (!hasSupabase) {
      // Return base64 URL as fallback
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
    }

    const supabase = createClient();
    const fileExt = "jpg";
    const fileName = `${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to bucket
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, compressedFile);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(10);

    const uploadedUrls: string[] = [];
    const limit = multiple ? Math.min(files.length, maxImages - images.length) : 1;

    try {
      for (let i = 0; i < limit; i++) {
        const url = await uploadFile(files[i]);
        uploadedUrls.push(url);
        setProgress(Math.round(10 + (i + 1) * (90 / limit)));
      }

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please ensure the bucket exists on Supabase.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = async (index: number) => {
    const urlToRemove = images[index];

    // Try deleting from Supabase
    if (hasSupabase && urlToRemove.includes(bucket)) {
      try {
        const supabase = createClient();
        const parts = urlToRemove.split(`/${bucket}/`);
        if (parts.length > 1) {
          const filePath = parts[1];
          await supabase.storage.from(bucket).remove([filePath]);
        }
      } catch (err) {
        console.error("Error deleting file from storage:", err);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    if (!multiple) return;
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const list = [...images];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    onChange(list);
  };

  return (
    <div className="w-full">
      {/* Upload Drag/Drop Box */}
      {(!multiple && images.length > 0) || (multiple && images.length >= maxImages) ? null : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-300 ${
            dragActive
              ? "border-[#5faedb] bg-[#5faedb]/5"
              : "border-[#4b328b]/15 bg-white hover:border-[#6e63b8] hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            multiple={multiple}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#6e63b8]" size={28} />
              <div className="text-center">
                <span className="text-xs font-semibold text-[#4b328b]">Uploading image...</span>
                <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full brand-gradient transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full p-2 bg-[#6e63b8]/5 text-[#6e63b8]">
                <Upload size={20} />
              </div>
              <p className="text-xs font-semibold text-[#21183d]">
                Drag & drop image here, or <span className="text-[#6e63b8] underline">browse</span>
              </p>
              <p className="text-[10px] text-[#6b6680]">
                Supports JPG, PNG (Max {maxImages} images, compressed automatically)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className={`mt-4 grid gap-3 ${multiple ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-1"}`}>
          {images.map((url, index) => (
            <div
              key={url + index}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#4b328b]/10 bg-slate-100 shadow-sm"
            >
              <img src={url} alt="Uploaded preview" className="h-full w-full object-cover" />

              {/* Toolbar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                {multiple && index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, "left")}
                    className="rounded-full p-1 bg-white/95 text-slate-800 hover:bg-white shadow"
                  >
                    <ArrowLeft size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded-full p-1 bg-red-600 text-white hover:bg-red-700 shadow"
                >
                  <X size={14} />
                </button>
                {multiple && index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, "right")}
                    className="rounded-full p-1 bg-white/95 text-slate-800 hover:bg-white shadow"
                  >
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Cover badge */}
              {multiple && index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-indigo-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
