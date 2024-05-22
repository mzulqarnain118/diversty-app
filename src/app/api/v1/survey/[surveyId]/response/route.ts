import { questionTypes } from "@/constants/questionTypes";
import {
  addResponsesBySurvey,
  getQuestionsBySurvey,
} from "@/lib/prisma/question";
import { getSurveyStats } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  const { surveyId } = params;

  const { openEndedStats, closeEndedStats, multipleChoiceStats, multiSelectStats } =
    await getSurveyStats(surveyId);
  const responses = [
    ...openEndedStats,
    ...closeEndedStats,
    ...multipleChoiceStats,
    ...multiSelectStats
  ].sort((a, b) => a.id - b.id);
  return NextResponse.json({ responses });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  const { surveyId } = params;

  const { responses } = await req.json();

  const serialized = responses.map((res: any) => {
    const { id, type, response } = res;
    return {
      survey_id: surveyId,
      question_id: id,
      respondent_id: 1,
      ...(type === questionTypes.openEnded && { response_text: response }),
      ...(type === questionTypes.mcqs && { choice_id: +response }),
      ...(type === questionTypes.closeEnded && {
        closeEnededChoice_id: +response,
      }),
    };
  });

  const newResponses = await addResponsesBySurvey(serialized);
  return NextResponse.json(
    { msg: "Responses Added Successfully!" },
    { status: 201 }
  );
}
