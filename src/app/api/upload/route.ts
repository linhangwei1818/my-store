import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sharp from "sharp";

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

    let sharpInstance = sharp(inputBuffer);
    const metadata = await sharpInstance.metadata();

    if (metadata.width && metadata.width > MAX_WIDTH) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH);
    }

    const outputBuffer = await sharpInstance.jpeg({ quality: JPEG_QUALITY }).toBuffer();
    const base64 = outputBuffer.toString("base64");
    const url = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "unknown"}` },
      { status: 500 }
    );
  }
}
