import { questionTypes } from "@/constants/questionTypes";
import { removeChoicesByQuestion } from "@/lib/prisma/choice";
import {
  deleteQuestion,
  getQuestion,
  updateQuestion,
} from "@/lib/prisma/question";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;
  const { field_name, value } = await req.json();

  let data = {};

  switch (field_name) {
    case "question_text":
      data = { question_text: value };
      break;
    case "question_type":
      const oldQuestion = await getQuestion(+questionId);
      if (
        [questionTypes.mcqs, questionTypes.multiSelectMcq].includes(
          oldQuestion?.question_type || ""
        )
      ) {
        await removeChoicesByQuestion(+questionId);
      }
      data = {
        closeEndedChoiceType_id: null,
        question_type: value,
        ...(questionTypes.closeEnded === value && {
          closeEndedChoiceType_id: 1,
        }),
      };
      break;
    case "question_varient":
      data = { closeEndedChoiceType_id: value };
      break;
    case "visiblity":
      data = { isTemplate: value };
    default:
      break;
  }

  const question = await updateQuestion(+questionId, data);
  return NextResponse.json({ questionId, question, data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;
  try {
    await deleteQuestion(+questionId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          msg: "Responses are found, You cant delete this",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          msg: "Something went wrong",
        },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({});
}
