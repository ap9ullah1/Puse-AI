"use client";

import { useRef, useState } from "react";
import { Card } from "./ui/Card";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);
const MAX_BYTES = 10 * 1024 * 1024;

type ImageUploaderProps = {
  label: string;
  guidance: string[];
  onUploaded: (fileId: string, previewUrl: string) => void;
  disabled?: boolean;
};

export function ImageUploader({ label, guidance, onUploaded, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  async function handleFile(file: File) {
    setErrorMessage("");

    const type = (file.type || "").toLowerCase();
    const looksJpegOrPng =
      ALLOWED_TYPES.has(type) ||
      /\.jpe?g$/i.test(file.name) ||
      /\.png$/i.test(file.name);

    if (!looksJpegOrPng) {
      setStatus("error");
      setErrorMessage("Use a JPEG or PNG selfie (iPhone Live/HEIC photos need to be saved as JPEG first).");
      return;
    }

    if (file.size <= 0) {
      setStatus("error");
      setErrorMessage("That file looks empty. Try another photo.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setStatus("error");
      setErrorMessage("That photo is over 10MB. Try a smaller JPEG or PNG.");
      return;
    }

    setStatus("uploading");
    const previewUrl = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        URL.revokeObjectURL(previewUrl);
        throw new Error(body?.error ?? "Upload failed");
      }
      if (typeof body?.fileId !== "string") {
        URL.revokeObjectURL(previewUrl);
        throw new Error("Upload succeeded but no file id came back. Try again.");
      }
      setStatus("idle");
      onUploaded(body.fileId, previewUrl);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Card
      className={`flex flex-col items-center gap-5 border-dashed border-accent-solid/30 p-8 text-center transition ${
        dragActive ? "border-accent-solid bg-muted/80 shadow-[0_0_24px_-8px_var(--accent-solid)]" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && !disabled && status !== "uploading") void handleFile(file);
      }}
    >
      <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
        {guidance.map((tip) => (
          <li key={tip} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-solid" />
            {tip}
          </li>
        ))}
      </ul>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        disabled={disabled || status === "uploading"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <button
        type="button"
        disabled={disabled || status === "uploading"}
        onClick={() => inputRef.current?.click()}
        className="nova-ring-btn inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition disabled:opacity-50"
      >
        {status === "uploading" ? "Uploading…" : label}
      </button>

      <p className="text-xs text-muted-foreground">or drag and drop a JPEG/PNG photo here</p>

      {status === "error" && <p className="max-w-sm text-sm text-amber-400">{errorMessage}</p>}
    </Card>
  );
}
