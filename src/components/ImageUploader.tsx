"use client";

import { useRef, useState } from "react";
import { Card } from "./ui/Card";

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
    setStatus("uploading");
    setErrorMessage("");
    const previewUrl = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed");
      setStatus("idle");
      onUploaded(body.fileId, previewUrl);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <Card
      className={`flex flex-col items-center gap-5 border-dashed p-8 text-center transition ${
        dragActive ? "border-accent-solid bg-muted" : ""
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
        if (file && !disabled) void handleFile(file);
      }}
    >
      <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
        {guidance.map((tip) => (
          <li key={tip} className="flex items-center gap-2">
            <span className="pulse-gradient-bg h-1.5 w-1.5 shrink-0 rounded-full" />
            {tip}
          </li>
        ))}
      </ul>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <button
        type="button"
        disabled={disabled || status === "uploading"}
        onClick={() => inputRef.current?.click()}
        className="pulse-gradient-bg inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:brightness-105 disabled:opacity-50"
      >
        {status === "uploading" ? "Uploading…" : label}
      </button>

      <p className="text-xs text-muted-foreground">or drag and drop a photo here</p>

      {status === "error" && <p className="text-sm text-accent-solid">{errorMessage}</p>}
    </Card>
  );
}
