// seed.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const questionsData = [
    { name: "Yes/No", description: "Used for Question Having yes/no answer" },
    {
      name: "True/False",
      description: "Used for Question Having true/false answer",
    },
    {
      name: "Agree/Disagree",
      description: "Used for Question Having agree/disagree scale answer",
    },
    {
      name: "Satisfied/unsatisfied",
      description: "Used for Question Having satisfied rating answer",
    },
  ];

  const choicesData = [
    { choice_text: "Strongly Disagree", type_id: 3 },
    { choice_text: "Disagree", type_id: 3 },
    { choice_text: "Neutral", type_id: 3 },
    { choice_text: "Agree", type_id: 3 },
    { choice_text: "Strongly Agree", type_id: 3 },
    { choice_text: "Very Unsatisfied", type_id: 4 },
    { choice_text: "Unsatisfied", type_id: 4 },
    { choice_text: "Neutral", type_id: 4 },
    { choice_text: "Satisfied", type_id: 4 },
    { choice_text: "Very Satisfied", type_id: 4 },
    { choice_text: "False", type_id: 2 },
    { choice_text: "True", type_id: 2 },
    { choice_text: "No", type_id: 1 },
    { choice_text: "Yes", type_id: 1 },
    { choice_text: "Don't want to answer", type_id: 1 },
  ];

  // Seed Questions
  for (const question of questionsData) {
    await prisma.closeEndedChoiceType.create({
      data: question,
    });
  }

  // Seed Choices
  for (const choice of choicesData) {
    await prisma.closeEndedChoice.create({
      data: choice,
    });
  }

  console.log("Seed script executed successfully");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
