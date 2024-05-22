import prisma from "./";


export async function getTags(
  limit: number,
  page: number,
) {
  try {
    const tags = await prisma.tag.findMany({
    //   where: filter,
      take: limit,
      skip: (page - 1) * limit,
    });

    const count = await prisma.tag.count( /*{ where: filter }*/);
    return { count, tags };
  } catch (error) {
    throw error;
  }
}


export function createTag(data:{title: string, description: string}){
    return prisma.tag.create({data})
}