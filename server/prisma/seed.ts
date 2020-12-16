import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { embeddingElements, embeddingQuestions } from "./embedding";

const prisma = new PrismaClient();

async function seed() {
  try {
    const _survey = JSON.parse(
      readFileSync("prisma/data/survey.json").toString()
    );
    const survey = (await embeddingQuestions(_survey)) as any;
    await prisma.survey.create({
      data: survey,
    });
  } catch (error) {
    console.log(error);
  }
  try {
    let progress = 1;
    const _elements = JSON.parse(
      readFileSync("prisma/data/elements.json").toString()
    );
    const elements = (await embeddingElements(_elements)) as any;
    for (const data of elements as any) {
      console.log(`${progress} / ${elements.length}`);
      await prisma.element.create({
        data,
      });
      progress += 1;
    }
  } catch (error) {
    console.log(error);
  }
  try {
    let progress = 1;
    const records = JSON.parse(
      readFileSync("prisma/data/records.json").toString()
    );
    for (const data of records as any) {
      console.log(`${progress} / ${records.length}`);
      await prisma.record.create({
        data,
      });
      progress += 1;
    }
  } catch (error) {
    console.log(error);
  }
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    console.log("seeding completed");
    await prisma.$disconnect();
  });
