import { getQuestions, Question } from './getQuestions';

export type Section = {
  name: string;
  questions: { create: Question[] };
};
export const getSections = async (_sections: any): Promise<Section[]> => {
  if (_sections.SurveyElements === undefined) throw 'no elements!';

  const blockContainer = _sections.SurveyElements.find(
    (item) => item.Element === 'BL'
  );

  if (blockContainer.Payload === undefined) throw 'no payloads!';

  const sections = Object.values(blockContainer.Payload)
    .filter((item: any) => item.Type !== 'Trash')
    .map(async (item: any) => ({
      name: item.Description,
      questions: {
        create: await getQuestions(
          _sections,
          Object.values<any>(item.BlockElements).reduce(
            (prev: string[], curr: any) =>
              curr.QuestionID ? [...prev, curr.QuestionID] : prev,
            []
          )
        ),
      },
    }));
  return Promise.all(sections);
};
