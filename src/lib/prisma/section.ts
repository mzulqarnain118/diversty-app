import prisma from ".";

export function createSection(data: any) {
  return prisma.section.create({
    data,
  });
}

export function updateSection(
  sectionId: number,
  data: { [key: string]: string }
) {
  return prisma.section.update({
    where: {
      id: sectionId,
    },
    data: data,
  });
}

export function deleteSection(sectionId: number) {
  return prisma.section.delete({
    where: {
      id: sectionId,
    },
  });
}
