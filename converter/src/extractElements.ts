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
    question.choices?.map((item) => ({
      ...item,
      id: v4(),
      question: {
        connect: {
          id: question.id,
        },
      },
      isChoice: true,
      isTextAllowed: item.isTextAllowed,
    }))
  );
  elements.push(
    question.answers?.map((item) => ({
      ...item,
      id: v4(),
      question: {
        connect: {
          id: question.id,
        },
      },
      isAnswer: true,
      isTextAllowed: item.isTextAllowed,
    }))
  );
  return elements.filter((item) => item).flat();
};
