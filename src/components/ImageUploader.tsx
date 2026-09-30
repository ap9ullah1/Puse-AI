"use client";

import { useRef, useState } from "react";

type ImageUploaderProps = {
  label: string;
  onUploaded: (fileId: string, previewUrl: string) => void;
  disabled?: boolean;
};

export function ImageUploader({ label, onUploaded, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
    <div className="flex flex-col items-start gap-3">
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
        className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {status === "uploading" ? "Uploading…" : label}
      </button>
      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
