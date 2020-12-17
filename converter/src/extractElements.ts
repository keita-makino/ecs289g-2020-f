import { Question } from './getQuestions';
import { v4 } from 'uuid';

export const extractElements = (question: Question) => {
  const elements = [];
  if (question.categories?.create) {
    question.categories.create.map((category) =>
      elements.push(extractElements(category))
    );
  }

  elements.push(
    question.choices?.flatMap((choice) => {
      if (question.answers && question.answers.length > 0) {
        return question.answers?.map((answer) => ({
          id: v4(),
          question: {
            connect: {
              id: question.id,
            },
          },
          choice,
          answer,
        }));
      } else {
        return {
          id: v4(),
          question: {
            connect: {
              id: question.id,
            },
          },
          choice,
        };
      }
    })
  );

  return elements.filter((item) => item).flat();
};
