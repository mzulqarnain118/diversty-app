import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import { duplicateQuestion, getQuestionsBySurvey } from "@/lib/prisma/question";
import { duplicateSurvey } from "@/lib/prisma/survey";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
    
  const data = await getServerSession(authOptions);

  const isAdmin = (data?.user?.role ==='ADMIN')
  const { surveyId } = params;
  const newSurvey = await duplicateSurvey(surveyId, isAdmin, data?.user.id!);

  const res = await getQuestionsBySurvey(surveyId);

  const questions = res?.Question || [];
  
  for (let question of questions) {
    await duplicateQuestion(question.id, newSurvey.id, isAdmin);
  }

  return NextResponse.json({
    msg: "Survey Duplicated Successfully",
    survey: newSurvey,
  });
}
