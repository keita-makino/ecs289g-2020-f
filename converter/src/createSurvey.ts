import { v4 } from 'uuid';

export const createSurvey = async (_sections) => {
  return {
    id: v4(),
    name: 'Test Survey with COVID-19 Data',
    sections: {
      create: (await _sections).map((section) => ({
        ...section,
        questions: {
          create: section.questions.create.map((question) => {
            delete question.choices;
            delete question.answers;
            if (question.categories) {
              question.categories.create.map((category) => {
                delete category.choices;
                delete category.answers;
              });
            }
            return question;
          }),
        },
      })),
    },
  };
};
