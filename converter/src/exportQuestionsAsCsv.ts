import { Question } from './getQuestions';

export const exportQuestionsAsCsv = (_questions: Question[]) => {
  const questions = _questions
    .map((item) => ({
      questionTag: item.tag,
      text: item.text,
    }))
    .sort((a, b) => (a.questionTag < b.questionTag ? -1 : 1));
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'src/data/questions.csv',
    header: Object.keys(questions[0]).map((item) => ({
      id: item,
      title: item,
    })),
  });
  console.log('Questions have been exported.');
  csvWriter.writeRecords(questions);
};
