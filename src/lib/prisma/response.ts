import { questionTypes } from "@/constants/questionTypes";
import prisma from "./";

export function deleteRepsonceBySurvey(surveyId: string) {
  return prisma.response.deleteMany({
    where: {
      survey_id: surveyId,
    },
  });
}

export function addResponses(data: any[]) {
  return prisma.response.createMany({
    data,
    skipDuplicates: true,
  });
}

export function getUnanswered(respondent_id: number, survey_id: string) {
  return prisma.response.findMany({
    where: {
      respondent_id,
      survey_id,
      isAnswered: false,
    },
    select: {
      id: true,
    },
  });
}

export function markSubmitted(respondent_id: number, survey_id: string) {
  return prisma.response.updateMany({
    where: {
      respondent_id,
      survey_id,
    },
    data: {
      isSubmitted: true,
    },
  });
}

export function updateResponse(id: number, data: any) {
  return prisma.response.update({
    where: { id, isSubmitted: false },
    data,
    include:{
      ChoiceResponse: true
    }
  });
}

export async function updateMultiResponse(
  responseId: number,
  choiceList: number[]
) {
  const data = choiceList.map((c) => ({ choiceId: c, responseId }));
  const [count, newResponses] = await prisma.$transaction([
    prisma.choiceResponse.deleteMany({ where: { responseId } }),
    prisma.choiceResponse.createMany({ data }),
  ]);

  return newResponses
}

export function getResponsesByRespondentId(id: number) {
  return prisma.response.findMany({
    where: {
      respondent_id: id,
    },
    include: {
      ChoiceResponse: true,
    },
  });
}

export function getMultipleChoiceStats(surveyId: string) {
  return prisma.$queryRaw`
  SELECT q.question_text, q.id, count(r.choice_id) as choiceCount, c.choice_text
  FROM Question q 
  JOIN Choice c ON c.question_id = q.id
  LEFT JOIN Response r ON r.question_id = q.id AND c.id = r.choice_id
  WHERE q.survey_id = ${surveyId} AND q.question_type=${questionTypes.mcqs}
  GROUP BY q.id , r.choice_id, c.choice_text
  `;
}

export function getMultiSelectMCQStats(surveyId: string){
  return prisma.question.findMany({
    where: {
      survey_id: surveyId,
      question_type: questionTypes.multiSelectMcq
    },
    include:{
      Choice:{
        select:{
          choice_text: true,
          _count:{
            select:{
              ChoiceResponse: true
            }
          }
        }
      }
    }
  });
}

export function getCloseEndedStats(surveyId: string) {
  return prisma.$queryRaw`
  SELECT q.question_text, q.id, count(r.closeEnededChoice_id) as choiceCount, r.closeEnededChoice_id, c.choice_text
  FROM Question q 
  LEFT JOIN Response r ON r.question_id = q.id
  LEFT JOIN CloseEndedChoice c ON c.id = r.closeEnededChoice_id
  WHERE q.survey_id = ${surveyId} AND r.closeEnededChoice_id is not null AND q.question_type = ${questionTypes.closeEnded}
  GROUP BY q.id , r.closeEnededChoice_id;
  `;
}

export function getOpenEndedStats(surveyId: string) {
  return prisma.$queryRaw`
  SELECT q.question_text, q.id, r.response_text 
  FROM Question q 
  LEFT JOIN Response r ON r.question_id = q.id 
  WHERE q.survey_id = ${surveyId} AND r.response_text is not null  AND q.question_type = ${questionTypes.openEnded}
  GROUP BY q.id , r.id;
  `;
}
