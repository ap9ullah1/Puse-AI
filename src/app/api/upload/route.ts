import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/youcam/client";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = await uploadImage(buffer, file.type || "image/jpeg", file.name || "upload.jpg");
    return NextResponse.json({ fileId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
