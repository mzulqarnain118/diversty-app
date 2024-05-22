import { addGDPR } from "@/lib/prisma/gdpr";
import { getRespondentByUuid } from "@/lib/prisma/respondent";
import { decodeUUID } from "@/utils/uuid";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { respondentId, ...body } = await req.json();

  const { id } = (await getRespondentByUuid(decodeUUID(respondentId))) || {};

  if (!id) {
    return NextResponse.json(
      { success: false, msg: "Invalid Token" },
      { status: 400 }
    );
  }

  try {
    const gdpr = await addGDPR({ ...body, date: new Date(), respondentId: id });
    return NextResponse.json({ success: true, gdpr });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return NextResponse.json({ success: false, msg: "Already Exisits!!" });
    else
      return NextResponse.json({msg:"Internal server error"}, {status:500})
  }
}
