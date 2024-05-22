import prisma from "./";

export function addToken(identifier: string, token: string) {
  return prisma.verificationToken.create({
    data: {
      token: token,
      identifier: identifier,
    },
  });
}

export async function removeToken(token: string) {
  const t = await getToken(token);

  if (t) {
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });
  }
  return token;
}

export function removeTokenByIdentifier(identifier: string){
  return prisma.verificationToken.deleteMany({
    where:{identifier}
  })
}

export async function getToken(token: string) {
  return prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });
}
