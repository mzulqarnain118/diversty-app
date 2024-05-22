import { getCloseEndedChoiceTypes } from "@/lib/prisma/closeEndedChoiceType";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const variants = await getCloseEndedChoiceTypes();

  return NextResponse.json({ variants });
}
