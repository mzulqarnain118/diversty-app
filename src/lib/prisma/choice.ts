import prisma from "./";

export function removeChoicesByQuestion(questionId: number) {
  return prisma.choice.deleteMany({
    where: {
      question_id: questionId,
    },
  });
}

export function createChoice(data: any) {
  return prisma.choice.create({
    data,
  });
}

export function deleteChoice(id: number) {
  return prisma.choice.delete({
    where: {
      id,
    },
  });
}

export function updateChoice(id: number, data: any) {
  return prisma.choice.update({
    where: {
      id,
    },
    data,
  });
}

export function getChoicesByQuestion(questionId: number) {
  return prisma.choice.findMany({
    where: {
      question_id: questionId,
    },
  });
}
