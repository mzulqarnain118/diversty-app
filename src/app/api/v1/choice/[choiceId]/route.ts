import { deleteChoice, updateChoice } from "@/lib/prisma/choice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { choiceId: string } }
) {
  return NextResponse.json({});
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { choiceId: string } }
) {
  const { choiceId } = params;
  const { choice_text } = await req.json();
  const choice = await updateChoice(+choiceId, { choice_text });
  return NextResponse.json({ choice });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { choiceId: string } }
) {
  const { choiceId } = params;
  await deleteChoice(+choiceId);
  return NextResponse.json({ msg: "Choice Deleted Successfully!" });
}
