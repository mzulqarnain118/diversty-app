import prisma from ".";

export async function addUser(data: Object) {
  return prisma.user.create({
    data: data as any,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function verifyUser(id: string) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      emailVerified: new Date(),
    },
  });
}

export async function updateUser(id: string, data: any) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}
