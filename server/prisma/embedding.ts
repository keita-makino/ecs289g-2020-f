import Axios from "axios";

export const embeddingQuestions = async (survey: any) => {
  const questionTextArray = survey.sections.create
    .flatMap(
      (section: { questions: { create: any } }) => section.questions.create
    )
    .map((item: { text: any }) => item.text);
  const embeddingArray = await Axios.post(
    "http://localhost:7071/api/HttpTrigger2",
    questionTextArray
  );
  let index = -1;
  return {
    ...survey,
    sections: {
      create: survey.sections.create.map(
        (section: { questions: { create: any[] } }) => ({
          ...section,
          questions: {
            create: section.questions.create.map((item: any) => {
              index = index + 1;
              return {
                ...item,
                embedding: embeddingArray.data[index].embedded,
              };
            }),
          },
        })
      ),
    },
  };
};

export const embeddingElements = async (array: any[]) => {
  const questionTextArray1 = array
    .filter((item: { choice: any }) => item.choice)
    .map((item: { choice: { create: any } }) => item.choice.create.label)
    .filter((item, index, array) => array.indexOf(item) === index);
  const embeddingArray1 = await Axios.post(
    "http://localhost:7071/api/HttpTrigger2",
    questionTextArray1
  );

  const result1 = array.map((item) => {
    if (item.choice) {
      return {
        ...item,
        choice: {
          create: {
            ...item.choice.create,
            embedding:
              embeddingArray1.data[
                questionTextArray1.indexOf(item.choice.create.label)
              ].embedded,
          },
        },
      };
    } else {
      return item;
    }
  });

  const questionTextArray2 = array
    .filter((item: { answer: any }) => item.answer)
    .map((item: { answer: { create: any } }) => item.answer.create.label)
    .filter((item, index, array) => array.indexOf(item) === index);
  const embeddingArray2 = await Axios.post(
    "http://localhost:7071/api/HttpTrigger2",
    questionTextArray2
  );

  const result2 = result1.map((item) => {
    if (item.answer) {
      return {
        ...item,
        answer: {
          create: {
            ...item.answer.create,
            embedding:
              embeddingArray2.data[
                questionTextArray2.indexOf(item.answer.create.label)
              ].embedded,
          },
        },
      };
    } else {
      return item;
    }
  });

  return result2;
};
