import { questionTypes } from "@/constants/questionTypes";
import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import { createQuestion } from "@/lib/prisma/question";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { survey_id, question_type, options, question_text, orderNumber } =
    await req.json();

  const data = await getServerSession(authOptions);

  const isAdmin = data?.user.role === "ADMIN";

  const newQuestion = await createQuestion(
    {
      survey_id,
      question_type,
      question_text,
      orderNumber,
      isPublic: isAdmin,
      ...(questionTypes.closeEnded === question_type && {
        closeEndedChoiceType_id: 1,
      }),
    },
    question_type === questionTypes.mcqs ? options : []
  );

  return NextResponse.json({
    msg: "Question Added Successfully!",
    question: newQuestion,
  });
}
