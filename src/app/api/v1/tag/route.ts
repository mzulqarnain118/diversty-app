import { createTag, getTags } from "@/lib/prisma/tag";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // const q = req.nextUrl.searchParams.get("search");
  const limit = req.nextUrl.searchParams.get("limit") || 10;
  const page = req.nextUrl.searchParams.get("page") || 1;

  const {count,tags } =await getTags(+limit, +page)
  return NextResponse.json({ count, tags });
}

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  const tag = await createTag({ title, description });

  return NextResponse.json({ msg: "Tag Added Successfully", tag });
}