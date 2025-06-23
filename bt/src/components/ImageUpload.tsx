"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUpload,
  label,
  accept = "image/*",
  maxSize = 5,
  width = 200,
  height = 200,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setPreview(result.url);
      onImageUpload(result.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white opacity-0 hover:opacity-100 transition-opacity">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <svg className="w-full h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-2 w-full text-center">
              <p className="text-sm text-gray-600">{uploading ? "Uploading..." : "Add image here"}</p>
              {/* <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to {maxSize}MB</p> */}
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}
    </div>
  );
}
