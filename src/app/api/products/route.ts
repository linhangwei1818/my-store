import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");

  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        sku: data.sku,
        inventory: data.inventory,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        weight: data.weight || null,
        categoryId: data.categoryId || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
