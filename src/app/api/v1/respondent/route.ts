import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import { getEmailFromFile } from "@/lib/csv";
import { getUUID } from "@/utils";
import { addAndInviteRespondents } from "@/utils/respondents";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const sessionData = await getServerSession(authOptions);
  const surveyId = form.get("surveyId") as string;

  if (!surveyId) {
    return NextResponse.json(
      { success: false, msg: "Survey Id is required" },
      { status: 400 }
    );
  }

  const email = form.get("email") as string;
  const csvData = form.get("emails") as File;
  const extractedEmails = (await getEmailFromFile(csvData)) as string[];

  let emails = [...(email ? [email] : []), ...extractedEmails];

  const data = emails
    .filter((email) => validator.isEmail(email))
    .map((email: string) => ({ email, surveyId, uuid: getUUID() }));

  const respondents = await addAndInviteRespondents(surveyId, data, sessionData?.user.company || "");

  return NextResponse.json({
    sucsess: true,
    respondents,
  });
}
