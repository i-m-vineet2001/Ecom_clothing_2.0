
import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import api from "../lib/api.jsx";
import { toast } from "sonner";

// ── Individual file progress item ─────────────────────────────────────────────
const FileRow = ({ file, status, error }) => {
  const icons = {
    pending: <div className="w-4 h-4 rounded-full border-2 border-gray-300" />,
    uploading: (
      <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
    ),
    done: <Check className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
  };
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        status === "done"
          ? "bg-green-50"
          : status === "error"
            ? "bg-red-50"
            : status === "uploading"
              ? "bg-[#FDFAF5]"
              : "bg-gray-50"
      }`}
    >
      <div className="shrink-0">{icons[status]}</div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-medium text-[#2C2C2C]">
          {file.name}
        </p>
        <p className="text-[10px] text-gray-400">
          {(file.size / 1024).toFixed(0)} KB
          {error && <span className="text-red-500 ml-2">{error}</span>}
        </p>
      </div>
      <span
        className={`text-[10px] uppercase font-bold tracking-wider ${
          status === "done"
            ? "text-green-600"
            : status === "error"
              ? "text-red-500"
              : status === "uploading"
                ? "text-[#C5A059]"
                : "text-gray-400"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const ImageUploader = ({
  uploadUrl, // POST endpoint for upload
  multiple = true, // allow multiple files?
  currentImages = [], // [{ id, url, alt }] — existing images to display
  onDeleteUrl, // base URL for DELETE — e.g. /products/:id/images (appends /:imgId)
  onChanged, // callback after any upload or delete
  className = "",
}) => {
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState([]); // { file, status, error }
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  // ── Drag handlers ────────────────────────────────────────────────────────
  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);
  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!files.length) {
        toast.error("Only image files are supported");
        return;
      }
      handleFiles(multiple ? files : [files[0]]);
    },
    [multiple],
  );

  // ── File picker ──────────────────────────────────────────────────────────
  const onFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    handleFiles(multiple ? files : [files[0]]);
    e.target.value = ""; // reset so same file can be re-selected
  };

  // ── Upload pipeline ──────────────────────────────────────────────────────
  const handleFiles = async (files) => {
    // Validate sizes
    const valid = [];
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} is too large (max 10 MB)`);
        continue;
      }
      valid.push(f);
    }
    if (!valid.length) return;

    const rows = valid.map((f) => ({
      file: f,
      status: "pending",
      error: null,
    }));
    setQueue(rows);
    setUploading(true);

    for (let i = 0; i < rows.length; i++) {
      // Mark as uploading
      setQueue((q) =>
        q.map((r, idx) => (idx === i ? { ...r, status: "uploading" } : r)),
      );

      const formData = new FormData();
      formData.append("file", rows[i].file);
      formData.append("alt", rows[i].file.name.replace(/\.[^/.]+$/, ""));

      try {
        await api.post(uploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setQueue((q) =>
          q.map((r, idx) => (idx === i ? { ...r, status: "done" } : r)),
        );
      } catch (e) {
        const msg = e.response?.data?.detail || "Upload failed";
        setQueue((q) =>
          q.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: msg } : r,
          ),
        );
        toast.error(`${rows[i].file.name}: ${msg}`);
      }
    }

    setUploading(false);
    if (onChanged) onChanged();

    // Clear queue after 2.5s
    setTimeout(() => setQueue([]), 2500);
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (img) => {
    if (!onDeleteUrl || !img.id) return;
    if (!window.confirm("Remove this image?")) return;
    try {
      await api.delete(`${onDeleteUrl}/${img.id}`);
      toast.success("Image removed");
      if (onChanged) onChanged();
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const hasImages = currentImages.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── Drop zone ─────────────────────────────────────────────────── */}
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
          ${
            dragging
              ? "border-[#C5A059] bg-[#FDF8F0] scale-[1.01] shadow-lg shadow-[#C5A059]/10"
              : "border-[#E8E5E0] bg-[#F9F8F5] hover:border-[#C5A059]/60 hover:bg-white"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
              dragging
                ? "bg-[#C5A059] scale-110"
                : "bg-white shadow-sm border border-[#F2F0EB]"
            }`}
          >
            <Upload
              className={`w-7 h-7 ${dragging ? "text-white" : "text-[#C5A059]"}`}
            />
          </div>

          {dragging ? (
            <p className="text-base font-bold text-[#C5A059]">
              Drop to upload!
            </p>
          ) : (
            <>
              <p className="text-base font-semibold text-[#2C2C2C] mb-1">
                {multiple
                  ? "Drag & drop images here"
                  : "Drag & drop an image here"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                or click to browse from your computer
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {["JPEG", "PNG", "WebP", "GIF"].map((fmt) => (
                  <span
                    key={fmt}
                    className="bg-white border border-[#F2F0EB] px-2 py-0.5 rounded-md font-medium"
                  >
                    {fmt}
                  </span>
                ))}
                <span className="text-gray-300">·</span>
                <span>Max 10 MB</span>
                {multiple && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>Multiple files OK</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={onFileInput}
        />
      </div>

      {/* ── Upload progress queue ────────────────────────────────────── */}
      {queue.length > 0 && (
        <div className="space-y-1.5 bg-white border border-[#F2F0EB] rounded-xl p-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Uploading {queue.length} file{queue.length !== 1 ? "s" : ""}…
          </p>
          {queue.map((row, idx) => (
            <FileRow
              key={idx}
              file={row.file}
              status={row.status}
              error={row.error}
            />
          ))}
          {/* Overall progress bar */}
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C5A059] rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  (queue.filter(
                    (r) => r.status === "done" || r.status === "error",
                  ).length /
                    queue.length) *
                    100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Current images grid ──────────────────────────────────────── */}
      {hasImages && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {multiple
              ? `${currentImages.length} Image${currentImages.length !== 1 ? "s" : ""} — first is cover`
              : "Current Image"}
          </p>
          <div
            className={`grid gap-3 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}
          >
            {currentImages.map((img, idx) => (
              <div
                key={img.id || img.url || idx}
                className="relative group aspect-square bg-[#F2F0EB] rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.alt || ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                  {onDeleteUrl && img.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(img);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2.5 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Cover badge */}
                {multiple && idx === 0 && (
                  <span className="absolute top-2 left-2 bg-[#C5A059] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {/* Add more slot (multi only) */}
            {multiple && (
              <div
                onClick={() => !uploading && inputRef.current?.click()}
                className="aspect-square bg-white border-2 border-dashed border-[#E8E5E0] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] hover:bg-[#FDFAF5] transition-all group"
              >
                <Upload className="w-5 h-5 text-gray-300 group-hover:text-[#C5A059] mb-1 transition-colors" />
                <span className="text-[10px] text-gray-400 group-hover:text-[#C5A059] transition-colors">
                  Add more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state with upload hint (no images yet, non-multiple) */}
      {!hasImages && !multiple && (
        <div className="text-center py-6 bg-white border border-[#F2F0EB] rounded-xl">
          <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            No image set — drag one above to upload
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
