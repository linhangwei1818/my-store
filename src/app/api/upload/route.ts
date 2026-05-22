import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "public", "uploads");

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
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });

    const filepath = path.join(UPLOAD_DIR, filename);
    await writeFile(filepath, buffer);

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
