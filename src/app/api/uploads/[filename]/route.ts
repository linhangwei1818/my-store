import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeName = path.basename(filename);
  const fullPath = path.join(UPLOAD_DIR, safeName);

  if (!existsSync(fullPath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await readFile(fullPath);
  const ext = path.extname(safeName).toLowerCase();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
