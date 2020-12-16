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

export const embeddingElements = async (array: any) => {
  const questionTextArray = array.map(
    (item: { label: any }) => item.label || ""
  );
  const embeddingArray = await Axios.post(
    "http://localhost:7071/api/HttpTrigger2",
    questionTextArray
  );
  return array.map((element: any, index: string | number) => ({
    ...element,
    embedding: embeddingArray.data[index].embedded,
  }));
};
