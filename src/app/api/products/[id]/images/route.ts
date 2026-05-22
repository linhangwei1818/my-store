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
