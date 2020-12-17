import { PrismaClient } from "@prisma/client";
import Axios from "axios";
import { readFileSync } from "fs";
import { embeddingElements, embeddingQuestions } from "./embedding";

const prisma = new PrismaClient();

async function seed() {
  const choices = await prisma.choice.findMany();
  const array = choices.map((item) =>
    item.details === null ? item.label : item.details
  );

  const embeddingArray2 = await Axios.post(
    "http://localhost:7071/api/HttpTrigger2",
    array
  );

  choices.map((item, index) => {
    console.log(index);
    prisma.choice.update({
      where: { id: item.id },
      data: {
        embedding: {
          set: embeddingArray2.data[index].embedded,
        },
      },
    });
  });
  // try {
  //   const _survey = JSON.parse(
  //     readFileSync("prisma/data/survey.json").toString()
  //   );
  //   const survey = (await embeddingQuestions(_survey)) as any;
  //   await prisma.survey.create({
  //     data: survey,
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  // try {
  //   let progress = 1;
  //   const _elements = JSON.parse(
  //     readFileSync("prisma/data/elements.json").toString()
  //   );
  //   const elements = (await embeddingElements(_elements)) as any;
  //   for (const data of elements as any) {
  //     console.log(`${progress} / ${elements.length}`);
  //     await prisma.element.create({
  //       data,
  //     });
  //     progress += 1;
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // try {
  //   let progress = 1;
  //   const records = JSON.parse(
  //     readFileSync("prisma/data/records.json").toString()
  //   );
  //   for (const data of records as any) {
  //     console.log(`${progress} / ${records.length}`);
  //     await prisma.record.create({
  //       data,
  //     });
  //     progress += 1;
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    console.log("seeding completed");
    await prisma.$disconnect();
  });
