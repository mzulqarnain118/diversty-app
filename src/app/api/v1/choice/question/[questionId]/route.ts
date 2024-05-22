import { getChoicesByQuestion } from "@/lib/prisma/choice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;
  const choices = await getChoicesByQuestion(+questionId);
  return NextResponse.json({ choices });
}
