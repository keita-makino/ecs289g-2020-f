import { textFormatting } from './textFormatting';
import { v4 } from 'uuid';
import { recodeValue } from './recodeValue';
import { getNumberOrUndefined } from './getNumberOrUndefined';

export type Choice = {
  value: number;
  label: string;
  details?: string;
  isTextAllowed?: boolean;
};

type QuestionBase = {
  id: string;
  qid: string;
  name: string;
  tag: string;
  text: string;
  type: string;
  selector: 'Single' | 'Multiple' | 'TE';
  subSelector: string;
};

type QuestionMatrix = QuestionBase & {
  choices?: Choice[];
  answers?: Choice[];
};
type QuestionMC = QuestionBase & {
  choices?: Choice[];
};
type QuestionTE = QuestionBase & {
  choices?: Choice[];
};
type QuestionSBS = QuestionBase & {
  categories?: { create: QuestionMatrix[] };
};

export type Question = QuestionMatrix & QuestionMC & QuestionTE & QuestionSBS;

const createQuestionBase = (payload: any, category?: any): QuestionBase => ({
  id: v4(),
  qid: payload.QuestionID,
  text: textFormatting(payload.QuestionText),
  type: payload.QuestionType,
  selector:
    payload.Selector === 'SAVR' || payload.Selector === 'Likert'
      ? 'Single'
      : payload.Selector === 'TE'
      ? 'TE'
      : 'Multiple',
  subSelector: payload.SubSelector,
  tag: payload.DataExportTag || payload.QuestionID,
  name: payload.DataExportTag || payload.QuestionID,
});

const createQuestionMatrix = <T extends QuestionBase>(payload: any) => (
  base: T
): T => ({
  ...base,
  choices: Object.entries<any>(payload.Choices).map((choice) => ({
    value: getNumberOrUndefined(choice[0]),
    label: textFormatting(choice[1].Display),
    isTextAllowed: choice[1].TextEntry === 'true' || undefined,
  })),
  answers: Object.entries<any>(payload.Answers).map((answer) => ({
    value: recodeValue(answer[0], payload.RecodeValues),
    label: textFormatting(answer[1].Display),
  })),
});

const createQuestionMC = (payload: any) => (
  base: QuestionBase
): QuestionMC => ({
  ...base,
  choices: payload.Choices
    ? Object.entries<any>(payload.Choices).map((choice) => ({
        value: recodeValue(choice[0], payload.RecodeValues),
        label: textFormatting(choice[1].Display),
        isTextAllowed: choice[1].TextEntry === 'true' || undefined,
      }))
    : undefined,
});

const createQuestionSBS = (payload: any) => (
  base: QuestionBase
): QuestionSBS => ({
  ...base,
  categories: {
    create: Object.values<any>(payload.AdditionalQuestions).map((category) => {
      const categoryBase: QuestionBase = {
        id: v4(),
        qid: category.QuestionID,
        tag: category.DataExportTag || category.QuestionID,
        name: category.DataExportTag || category.QuestionID,
        type: category.QuestionType,
        text: category.QuestionText,
        selector:
          category.SubSelector === 'DL' ||
          category.SubSelector === 'SingleAnswer'
            ? 'Single'
            : category.Selector === 'TE'
            ? 'TE'
            : 'Multiple',
        subSelector: category.subSelector,
      };
      switch (categoryBase.type) {
        case 'Matrix':
          return {
            ...categoryBase,
            choices: Object.entries<any>(category.Choices).map((choice) => ({
              value: getNumberOrUndefined(choice[0]),
              label: textFormatting(choice[1].Display),
            })),
            answers: Object.entries<any>(category.Answers).map((answer) => ({
              value: recodeValue(
                answer[0],
                category.RecodeValues.length > 0
                  ? category.RecodeValues
                  : undefined
              ),
              label: textFormatting(answer[1].Display),
            })),
          };
        case 'TE':
        case 'MC':
          return {
            ...categoryBase,
            choices: Object.entries<any>(category[1].Choices).map((choice) => ({
              value: recodeValue(
                choice[0],
                category.RecodeValues.length > 0
                  ? category.RecodeValues
                  : undefined
              ),
              label: textFormatting(choice[1].Display),
            })),
          };
        default:
          throw new Error('no type matches!');
      }
    }),
  },
});

export const getQuestions = async (data: any, ids: string[]) => {
  const questions: Question[] = data.SurveyElements.filter(
    (item) => item.Element === 'SQ' && ids.includes(item.PrimaryAttribute)
  )
    .map((item) => item.Payload)
    .reduce((prev, curr) => {
      const base = createQuestionBase(curr);
      switch (base.type) {
        case 'Matrix':
          return [...prev, createQuestionMatrix(curr)(base)];
        case 'MC':
        case 'TE':
          return [...prev, createQuestionMC(curr)(base)];
        case 'SBS':
          return [...prev, createQuestionSBS(curr)(base)];
        default:
          return prev;
      }
    }, []);
  return questions;
};
