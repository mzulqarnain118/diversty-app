import { createSection } from "@/lib/prisma/section";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { survey_id, title, description, orderNumber } = await req.json();

  const newSection = await createSection({
    survey_id,
    title,
    description,
    orderNumber,
  });

  return NextResponse.json({
    msg: "Description Added Successfully!",
    section: newSection,
  });
}
