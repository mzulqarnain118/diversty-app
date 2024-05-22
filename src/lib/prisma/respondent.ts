import prisma from "./";

export function getRespondentsBySurvey(surveyId: string) {
  return prisma.respondent.findMany({
    where: { surveyId },
  });
}

export function addRespondents(data: any[]) {
  return prisma.respondent.createMany({
    data,
    skipDuplicates: true,
  });
}

const statuses = {
  INVITATION_SENT: { isInvitationSent: true, invitationSendDate: new Date() },
  VIEWED: { isViewed: true, viewedDate: new Date() },
  SUBMITTED: { isSubmitted: true, submittedDate: new Date() },
};

export type RespondentStatus = "INVITATION_SENT" | "VIEWED" | "SUBMITTED";

export async function markRespondentStatus(id: number, type: RespondentStatus) {
  return prisma.respondent.update({
    where: { id },
    data: statuses[type],
  });
}


export function getRespondentByUuid(uuid: string){
  return prisma.respondent.findFirst({
    where:{
      uuid
    }
  })
}