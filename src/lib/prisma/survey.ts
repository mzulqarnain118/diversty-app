import ApiError from "@/errors/ApiError";
import prisma from "./";
import httpStatus from "http-status";

export function createSurvey(data: any) {
  return prisma.survey.create({
    data,
  });
}

export function getSurveys(userId: string) {
  return prisma.survey.findMany({ where: { userId } });
}

export function getSurveyAndQuestionnaireWithSections(surveyId: string) {
  return prisma.survey.findUnique({
    where: {
      id: surveyId,
    },
    include: {
      Question: {
        include: {
          Choice: true,
          closeEndedChoiceType: {
            include: {
              CloseEndedChoice: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
      Section: true,
    },
  });
}
export function updateSurvey(surveyId: string, data: any) {
  return prisma.survey.update({
    where: {
      id: surveyId,
    },
    data,
  });
}

export function getSurvey(surveyId: string) {
  return prisma.survey.findUnique({
    where: {
      id: surveyId,
    },
  });
}

export function deleteSurvey(surveyId: string) {
  return prisma.survey.delete({
    where: {
      id: surveyId,
    },
  });
}

export async function duplicateSurvey(
  surveyId: string,
  isAdmin: boolean = false,
  userId: string
) {
  const oldSurvey = await prisma.survey.findUnique({
    where: { id: surveyId },
  });

  if (!oldSurvey)
    throw new ApiError("Survey not found", httpStatus.UNPROCESSABLE_ENTITY);

  const { id, title, isTemplate, userId: old, ...data } = oldSurvey;

  return await createSurvey({
    title: `${title}-copy`,
    isTemplate: isAdmin,
    userId,
    ...data,
  });
}

export function getLibrarySuervesy() {
  return prisma.survey.findMany({
    where: {
      isTemplate: true,
    },
    include: {
      Question: {
        select: {
          question_text: true,
          question_type: true,
        },
      },
    },
  });
}
