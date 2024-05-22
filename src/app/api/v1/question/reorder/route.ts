import { reOrderQuestions } from "@/lib/prisma/question";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { newSequence } = await req.json();
  await reOrderQuestions(newSequence);

  return NextResponse.json({ msg: "sequence updated", newSequence });
}
