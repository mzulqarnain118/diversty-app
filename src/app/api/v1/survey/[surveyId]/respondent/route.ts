import { getRespondentsBySurvey } from "@/lib/prisma/respondent";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { surveyId: string } }
) {
    const respondents = await getRespondentsBySurvey(params.surveyId);
    return NextResponse.json({
        success:true, 
        respondents
    })
}
