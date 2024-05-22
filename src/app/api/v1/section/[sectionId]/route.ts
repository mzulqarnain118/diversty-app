import { deleteSection, updateSection } from "@/lib/prisma/section";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  const { sectionId } = params;
  const data = await req.json();

  const section = await updateSection(+sectionId, data);
  return NextResponse.json({ sectionId, section, data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  const { sectionId } = params;
  const section = await deleteSection(+sectionId);
  return NextResponse.json({
    msg: "section deleted Successfully!",
    section: section,
  });
}
