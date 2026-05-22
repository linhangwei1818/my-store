import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, description, parentId, sortOrder } = body;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      sortOrder: sortOrder || 0,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
