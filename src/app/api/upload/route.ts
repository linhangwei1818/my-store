import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "public", "uploads");

const MAX_WIDTH = 1200;
const JPEG_QUALITY = 80;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    const filepath = path.join(UPLOAD_DIR, filename);

    // Resize and optimize image
    let sharpInstance = sharp(inputBuffer);
    const metadata = await sharpInstance.metadata();

    if (metadata.width && metadata.width > MAX_WIDTH) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH);
    }

    const outputBuffer =
      ext === "png"
        ? await sharpInstance.png({ quality: JPEG_QUALITY }).toBuffer()
        : await sharpInstance.jpeg({ quality: JPEG_QUALITY }).toBuffer();

    await writeFile(filepath, outputBuffer);

    const url = `/api/uploads/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "unknown"}` },
      { status: 500 }
    );
  }
}
