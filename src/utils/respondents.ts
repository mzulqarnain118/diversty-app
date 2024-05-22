import {
  addRespondents,
  getRespondentsBySurvey,
  markRespondentStatus,
} from "@/lib/prisma/respondent";
import { createSurveyInvitationLink } from ".";
import { sendSurveyInvitationEmal } from "@/lib/email";
import { encodeUUID } from "./uuid";
import { getQuestionsBySurvey } from "@/lib/prisma/question";
import { addResponses } from "@/lib/prisma/response";

export async function addAndInviteRespondents(
  surveyId: string,
  data: { email: string; surveyId: string }[],
  company: string
) {
  await addRespondents(data);

  const respondents = await getRespondentsBySurvey(surveyId);

  for (let respondent of respondents) {
    if (respondent.isInvitationSent) continue;

    await sendInvitation({...respondent, company});
  }

  const newRespondents = await getRespondentsBySurvey(surveyId);

  return newRespondents;
}

export async function sendInvitation(respondent: any) {
  const { id, email, uuid, company } = respondent;

  const invitationLink = createSurveyInvitationLink(encodeUUID(uuid));

  try {
    await sendSurveyInvitationEmal(email, invitationLink, company);
    await markRespondentStatus(id, "INVITATION_SENT");
  } catch (e) {
    console.log(e);
  }
}



export async function addResponsesByRespondent(survey_id: string, respondent_id: number){
  const survey = await getQuestionsBySurvey(survey_id);

  const questions = survey?.Question || []

  const data = questions.map(q=>({question_id: q.id, survey_id, respondent_id}));

  await addResponses(data);
}