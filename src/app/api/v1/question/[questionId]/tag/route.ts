import { updateQuestionTags } from "@/lib/prisma/question";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;

  const { tags } = await req.json();

  const tagList = await updateQuestionTags(+questionId, tags);

  return NextResponse.json({ tags, msg: "Tags added successfully" });
}
