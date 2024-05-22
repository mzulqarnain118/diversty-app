import prisma from "./";


export function getGDPR(respondentId: number){
    return prisma.gDPR.findFirst({
        where:{
            respondentId
        }
    })
}


export function addGDPR(data:any){
    return prisma.gDPR.create({
        data,
    })
}