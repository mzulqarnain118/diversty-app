import prisma from "./";

export function getCloseEndedChoiceTypes() {
  return prisma.closeEndedChoiceType.findMany({});
}

export function getCloseEndedTypes() {
  return prisma.closeEndedChoiceType.findMany({
    include: {
      CloseEndedChoice: true,
    },
  });
}
