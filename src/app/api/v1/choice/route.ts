import { createChoice } from "@/lib/prisma/choice";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question_id, choice_text } = await req.json();
  const choice = await createChoice({ question_id, choice_text });
  return NextResponse.json({ choice });
}
