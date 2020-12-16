import { Element } from './compileRecords';
import { Question } from './getQuestions';

export const exportDefaultElementsAsCsv = (
  elements: Element[],
  questions: Question[]
) => {
  const dictionary = elements
    .reduce((prev, curr) => {
      const question = questions.find(
        (question) => question.id === curr.question?.connect.id
      );
      const questionTag = question?.tag || 'no question';
      return curr.isAnswer || question.type.split('-')[0] !== 'Matrix'
        ? [
            ...prev,
            {
              questionTag,
              value: curr.value,
              label: curr.label,
            },
          ]
        : prev;
    }, [])
    .sort((a, b) =>
      a.questionTag > b.questionTag
        ? 1
        : a.questionTag < b.questionTag
        ? -1
        : a.value > b.value
        ? 1
        : a.value < b.value
        ? -1
        : 0
    );
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'src/data/dictionary.csv',
    header: Object.keys(dictionary[0]).map((item) => ({
      id: item,
      title: item,
    })),
  });
  console.log('Default elements have been exported.');
  csvWriter.writeRecords(dictionary);
};
