import { getGDPR } from "@/lib/prisma/gdpr";
import { getQuestionsBySurvey } from "@/lib/prisma/question";
import {
  getRespondentByUuid,
  markRespondentStatus,
} from "@/lib/prisma/respondent";
import { getResponsesByRespondentId } from "@/lib/prisma/response";
import { getSurvey } from "@/lib/prisma/survey";
import { encodeID } from "@/utils/crypto";
import { addResponsesByRespondent } from "@/utils/respondents";
import { getResponseAnswer } from "@/utils/response";
import { decodeUUID } from "@/utils/uuid";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { respondentId: string } }
) {
  const { respondentId } = params;
  const { surveyId, id, email, isSubmitted } =
    (await getRespondentByUuid(decodeUUID(respondentId))) || {};
  if (!surveyId || !id) {
    return NextResponse.json({ success: false, msg: "Invalid Invitation Id" });
  }

  const gdpr = await getGDPR(id);

  if (!gdpr) {
    return NextResponse.json(
      { succss: false, redirect: true, msg: "GDPR form not found!!" },
      { status: 400 }
    );
  }

  await addResponsesByRespondent(surveyId, id);
  await markRespondentStatus(id, "VIEWED");

  const responses = await getResponsesByRespondentId(id);

  const responseMap = new Map();
  responses.forEach((response) => {
    responseMap.set(response.question_id, response);
  });

  const survey = await getQuestionsBySurvey(surveyId);

  const questions = survey?.Question || [];
  const sections = survey?.Section || [];

  const serializedQuestions = questions.map((question) => {
    const {
      Choice,
      closeEndedChoiceType,
      id,
      question_text,
      question_type,
      orderNumber,
    } = question;
    const newQuestion = { question_type, question_text, orderNumber };

    let choices;

    if (Choice) {
      choices = Choice;
    }
    if (closeEndedChoiceType?.CloseEndedChoice) {
      choices = closeEndedChoiceType?.CloseEndedChoice;
    }

    choices = choices?.map((choice) => {
      const { choice_text, id } = choice;
      return { id: encodeID(id), choice_text };
    });

    const response = responseMap.get(id);
    const defaultResponse = getResponseAnswer(response, question_type);
    Object.assign(newQuestion, {
      defaultResponse,
      choices,
      id: encodeID(response.id),
      type: "QUESTION",
    });
    return newQuestion;
  });

  const finalQuestionList = [
    ...serializedQuestions,
    ...sections.map((s) => ({ ...s, type: "SECTION" })),
  ].sort((obj1, obj2) => obj1.orderNumber - obj2.orderNumber);

  const { title, description } = survey || {};
  const serailizeSurvey = { title, description };
  return NextResponse.json({
    questions: finalQuestionList,
    survey: serailizeSurvey,
    email,
    isSubmitted,
  });
}
