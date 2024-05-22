import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import { createSurvey, getSurveys } from "@/lib/prisma/survey";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await getServerSession(authOptions);

  const surveys = await getSurveys(data?.user.id!);
  return NextResponse.json({ surveys });
}

export async function POST(req: NextRequest) {
  const data = await getServerSession(authOptions);

  const { name, description } = await req.json();

  const survey = await createSurvey({ title: name, description, userId: data?.user.id, isTemplate: data?.user.role==='ADMIN' });

  return NextResponse.json(
    { msg: "Survey added successfully!", survey },
    { status: 201 }
  );
}
