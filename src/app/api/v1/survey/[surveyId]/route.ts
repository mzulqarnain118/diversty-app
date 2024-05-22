import {
  deleteSurvey,
  getSurveyAndQuestionnaireWithSections,
  updateSurvey,
} from "@/lib/prisma/survey";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  const { surveyId } = params;

  const result = await getSurveyAndQuestionnaireWithSections(surveyId);

  if (result) {
    const { Question = [], Section = [], ...survey } = result || {};

    const questionList = Question.map((question) => {
      const {tags: rawTags} = question;
      const tags = rawTags.map(t=>t.tag);
      return { ...question,tags, type: "QUESTION" };
    });

    const SectionList = Section.map((section) => {
      return { ...section, type: "SECTION" };
    });

    const questionAndSection = [...questionList, ...SectionList].sort(
      (obj1, obj2) => obj1.orderNumber - obj2.orderNumber
    );

    return NextResponse.json({ survey, questionAndSection });
  } else {
    return NextResponse.json(
      { msg: "Survey not found", survey: null },
      { status: 404 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  const body = await req.json();
  const survey = await updateSurvey(params.surveyId, body);
  return NextResponse.json(survey);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
  const { surveyId } = params;
  await deleteSurvey(surveyId);
  return NextResponse.json({ msg: "Survey Deleted Successfully!" });
}
