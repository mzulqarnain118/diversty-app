import ApiError from "@/errors/ApiError";
import prisma from "./";
import httpStatus from "http-status";
import { createChoice } from "./choice";

export function createQuestion(data: any, choice: any[] = []) {
  return prisma.question.create({
    data: {
      ...data,
      Choice: {
        createMany: {
          data: choice,
        },
      },
    },
    include: {
      Choice: true,
      closeEndedChoiceType: {
        include: {
          CloseEndedChoice: true,
        },
      },
    },
  });
}

export function getQuestionsBySurvey(surveyId: string) {
  return prisma.survey.findUnique({
    where: {
      id: surveyId,
    },
    include: {
      Question: {
        include: {
          Choice: true,
          closeEndedChoiceType: {
            include: { CloseEndedChoice: true },
          },
        },
      },
      Section: true
    },
  });
}

export async function addResponsesBySurvey(responses: any) {
  await prisma.response.createMany({
    data: responses,
    skipDuplicates: true,
  });
}

export function getQuestion(id: number) {
  return prisma.question.findUnique({
    where: {
      id: id,
    },
  });
}

export function updateQuestion(id: number, data: { [key: string]: string }) {
  return prisma.question.update({
    where: {
      id,
    },
    data,
    include:{
      Choice: true,
      tags: true
    }
  });
}

export function deleteQuestion(id: number) {
  return prisma.question.delete({
    where: { id },
  });
}

export async function getImportQuestionList(
  limit: number,
  page: number,
  type: "PUBLIC" | "PRIVATE" = "PRIVATE",
  userId: string
) {
  const filter = {
    ...(type === "PUBLIC"
      ? {
          isPublic: true,
          isTemplate: true,
        }
      : {
          isTemplate: true,
          survey: {
            userId,
          },
        }),
  };
  try {
    const questions = await prisma.question.findMany({
      select: {
        question_text: true,
        id: true,
      },
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
    });

    const count = await prisma.question.count({ where: filter });
    return { count, questions };
  } catch (error) {
    throw error;
  }
}

export function getQuestionWithChoice(id: number) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      Choice: true,
    },
  });
}

export async function duplicateQuestion(
  id: number,
  survey_id = "",
  isAdmin = false
) {
  const oldQuestion = await prisma.question.findUnique({
    where: { id },
    include: {
      Choice: true,
      tags: true,
    },
  });

  if (!oldQuestion)
    throw new ApiError("Question not found", httpStatus.UNPROCESSABLE_ENTITY);

  const {
    Choice,
    created_at,
    survey_id: oldSurveyId,
    id: qId,
    isTemplate,
    isPublic,
    tags,
    ...data
  } = oldQuestion;

  const newQuestion = await createQuestion({
    survey_id: survey_id || oldSurveyId,
    isPublic: isAdmin,
    ...data,
  });

  for (let choice of Choice) {
    const { id, question_id, ...data } = choice;
    await createChoice({
      question_id: newQuestion.id,
      ...data,
    });
  }

  const tagsData = tags.map((t) => ({
    tagId: t.tagId,
    questionId: newQuestion.id,
  }));
  await prisma.questionTag.createMany({ data: tagsData });

  return newQuestion;
}

export async function reOrderQuestions(
  questionList: [{ id: number; orderNumber: number; type: string }]
) {
  const questionIds = questionList
    .filter(({ type }) => type === "QUESTION")
    .map(({ id, orderNumber }) => ({ id, orderNumber }));

  const sectionIds = questionList
    .filter(({ type }) => type === "SECTION")
    .map(({ id, orderNumber }) => ({ id, orderNumber }));

  return prisma.$transaction([
    ...questionIds.map(({ id, orderNumber }) =>
      prisma.question.update({
        where: { id },
        data: { orderNumber },
      })
    ),
    ...sectionIds.map(({ id, orderNumber }) =>
      prisma.section.update({
        where: { id },
        data: { orderNumber },
      })
    ),
  ]);
}

export async function updateQuestionTags(questionId: number, tags: string[]) {
  const data = tags.map((tag) => ({ tagId: tag, questionId }));
  await prisma.questionTag.deleteMany({ where: { questionId } });
  
  return await prisma.questionTag.createMany({ data })
}
