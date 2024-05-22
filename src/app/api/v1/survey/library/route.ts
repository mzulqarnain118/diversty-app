import { getLibrarySuervesy } from "@/lib/prisma/survey";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const surveys = await getLibrarySuervesy();
  return NextResponse.json({ success: true, surveys });
}

export async function POST(res: NextRequest){
    NextResponse.json({})
}