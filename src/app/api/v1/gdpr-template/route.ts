import {
  createGdprTemplate,
  getGdprTemplate,
} from "@/lib/prisma/gdpr-template";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  const newgdpr = await createGdprTemplate({
    title,
    description,
  });

  return NextResponse.json({
    msg: "GDPR Added Successfully!",
    gdpr: newgdpr,
  });
}

export async function GET() {
  const gdpr = await getGdprTemplate();
  return NextResponse.json({ gdprTemplate: gdpr });
}
