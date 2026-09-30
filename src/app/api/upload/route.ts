import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/youcam/client";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png"]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  const type = (file.type || "").toLowerCase();
  const looksOk =
    ALLOWED_TYPES.has(type) || /\.jpe?g$/i.test(file.name) || /\.png$/i.test(file.name);

  if (!looksOk) {
    return NextResponse.json(
      { error: "Use a JPEG or PNG image (not HEIC/WebP)." },
      { status: 400 }
    );
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Photo must be between 1 byte and 10MB." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = ALLOWED_TYPES.has(type) ? type.replace("image/jpg", "image/jpeg") : "image/jpeg";
    const fileId = await uploadImage(buffer, contentType, file.name || "upload.jpg");
    return NextResponse.json({ fileId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
