import prisma from ".";

export async function createGdprTemplate(data: any) {
  const gdpr = await prisma.gDPRForm.findFirst({});

  if (gdpr) {
    return await prisma.gDPRForm.update({
      where: {
        id: gdpr.id,
      },
      data,
    });
  } else {
    return await prisma.gDPRForm.create({ data });
  }
}

export function getGdprTemplate() {
  return prisma.gDPRForm.findFirst();
}
