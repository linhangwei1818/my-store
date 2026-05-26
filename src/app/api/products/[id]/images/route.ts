import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { url, alt, sortOrder } = body;

  const image = await prisma.productImage.create({
    data: {
      productId: id,
      url,
      alt: alt || null,
      sortOrder: sortOrder || 0,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: productId } = await params;
  const body = await req.json();
  const { imageId } = body;

  if (!imageId) {
    return NextResponse.json({ error: "imageId is required" }, { status: 400 });
  }

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image || image.productId !== productId) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  await prisma.productImage.delete({ where: { id: imageId } });

  return NextResponse.json({ success: true });
}
