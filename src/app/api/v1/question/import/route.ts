import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import {
  createQuestion,
  getImportQuestionList,
  getQuestionWithChoice,
} from "@/lib/prisma/question";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data =await getServerSession(authOptions);

  const q = req.nextUrl.searchParams.get("search");
  const limit = req.nextUrl.searchParams.get("limit") as string;
  const page = req.nextUrl.searchParams.get("page") as string;
  const type = req.nextUrl.searchParams.get("type") as string;

  const { count, questions } = await getImportQuestionList(+limit, +page, type as any, data?.user.id!);

  return NextResponse.json({ count, questions });
}

export async function POST(req: NextRequest) {
  const { id, surveyId, question_text } = await req.json();
  const oldQuestion = await getQuestionWithChoice(+id);

  if (!oldQuestion) {
    return NextResponse.json({ msg: "Question Not Found" }, { status: 400 });
  }

  const { closeEndedChoiceType_id, question_type, Choice } = oldQuestion;

  const choices = Choice.map((c) => ({ choice_text: c.choice_text }));

  const question = await createQuestion(
    {
      closeEndedChoiceType_id,
      question_text,
      question_type,
      survey_id: surveyId,
    },
    choices
  );
  return NextResponse.json({ question });
}
