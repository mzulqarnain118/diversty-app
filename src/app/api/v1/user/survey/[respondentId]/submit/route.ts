import { getRespondentByUuid, markRespondentStatus } from "@/lib/prisma/respondent";
import { getUnanswered, markSubmitted } from "@/lib/prisma/response";
import { encodeID } from "@/utils/crypto";
import { decodeUUID } from "@/utils/uuid";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest,   { params }: { params: { respondentId: string } }){
    const { respondentId } = params;
    const { surveyId, id, isSubmitted } =
      (await getRespondentByUuid(decodeUUID(respondentId))) || {};
    if (!surveyId || !id) {
      return NextResponse.json({ success: false, msg: "Invalid Token" }, {status:400});
    }
    if(isSubmitted){
        return NextResponse.json({ success: false, msg: "Already submitted" }, {status:400});
    }

    const unanswered = await getUnanswered(id,surveyId)

    if(unanswered.length){
        const unansweredKeys = unanswered.map(u=>(encodeID(u.id)));
        return NextResponse.json({success:false, unanswered: unansweredKeys, msg:"Fill out all questions"}, {status:400})
    }
  
    await markSubmitted(id,surveyId);
    await markRespondentStatus(id, 'SUBMITTED');

    return NextResponse.json({msg:"Response submitted Successfully", success:true, isSubmitted: true})
}