import { questionTypes } from "@/constants/questionTypes";
import { updateMultiResponse, updateResponse } from "@/lib/prisma/response";
import { decodeID } from "@/utils/crypto";
import { getResponseAnswer } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { type, answer } = (await req.json()) || {};

  let data;
  let optionsList;
  if (type === questionTypes.openEnded) {
    data = { response_text: answer };
  } else if (type === questionTypes.mcqs) {
    data = { choice_id: decodeID(answer) };
  } else if (type === questionTypes.closeEnded) {
    data = { closeEnededChoice_id: decodeID(answer) };
  } else if (type === questionTypes.multiSelectMcq) {
    data = {};
    optionsList = answer.map(decodeID);
  } else {
    return NextResponse.json({ success: false, msg: "Invalid Type" });
  }

  const isAnswered =
    type === questionTypes.multiSelectMcq ? !!optionsList?.length : true;

  try {
    if (optionsList) {
      await updateMultiResponse(+decodeID(params.id), optionsList);
    }
    const response = await updateResponse(+decodeID(params.id), {
      ...data,
      isAnswered,
    });
    const savedResponse = getResponseAnswer(response, type);
    return NextResponse.json({ success: true, response: savedResponse });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, msg: "Cant Update this record!" },
      { status: 400 }
    );
  }
}
