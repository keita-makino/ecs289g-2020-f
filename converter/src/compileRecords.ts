import { Section } from './getSections';
import { v4 } from 'uuid';
import * as ld from 'lodash';
import { Question } from './getQuestions';

export type Record = {
  id: string;
  meta: string;
  elements: {
    connect: { id: string }[];
  };
  user: {
    create: {
      id: string;
    };
  };
};

export type Element = {
  id: string;
  value: number;
  label: string;
  details?: {
    text?: string;
    choice?: string;
    answer?: string;
    data?: JSON;
  };
  isChoice?: boolean;
  isAnswer?: boolean;
  isTextAllowed?: boolean;
  question: {
    connect: {
      id: string;
    };
  };
};

const checkIfJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return Object.keys(JSON.parse(str)).length > 0;
};

export const compileRecords = async (
  _sections: Promise<Section[]>,
  _responses,
  _elements
): Promise<[Record[], Element[]]> => {
  const sections = await _sections;
  const responses = await _responses;
  const elements: Element[] = _elements;

  if (responses.length === 0) throw 'no responses!';

  const records: Record[] = [];
  const tags: string[] = [];
  responses.map(() =>
    records.push({
      id: v4(),
      meta: '',
      elements: { connect: [] },
      user: { create: { id: v4() } },
    })
  );

  const encodeQuestion = (question: Question) => {
    const { id, tag: tagBase, type, selector, categories, choices, answers } = {
      ...question,
    };

    if (categories) {
      categories.create.map((category) => encodeQuestion(category));
    } else {
      const choiceArray =
        selector === 'Single' && type === 'MC'
          ? [undefined]
          : choices || [undefined];
      choiceArray.map((choice, choiceIndex) => {
        const answerArray = type.split('-').length > 1 ? answers : [undefined];
        answerArray.map((answer, answerIndex) => {
          const tag = [
            tagBase,
            choice ? choiceIndex + 1 : undefined,
            answer ? answerIndex + 1 : undefined,
          ]
            .filter((item) => item)
            .join('_')
            .replace(/(.*)_(\d+_\d+_\d+)/g, '$1#$2');

          console.log(tag);
          tags.push(tagBase);
          const uniques: Element[] = elements.filter(
            (item) => item.question.connect.id === id
          );
          const uniqueLength = uniques.length;

          if (tagBase === 'D01') {
            console.log(choice);
          }

          records.map((_, index) => {
            const value =
              type === 'TE' || selector === 'TE'
                ? responses[index][tag] === ''
                  ? undefined
                  : responses[index][tag] == -99
                  ? -99
                  : 1
                : responses[index][tag] === '' ||
                  isNaN(Number(responses[index][tag]))
                ? undefined
                : Number(responses[index][tag]);
            const details =
              type === 'TE' || selector === 'TE'
                ? {
                    text: responses[index][tag],
                    choice: choice?.value,
                    answer: answer?.value,
                  }
                : responses[index][tag.concat('_TEXT')]
                ? {
                    text: responses[index][tag.concat('_TEXT')],
                    choice: choice?.value,
                    answer: answer?.value,
                  }
                : undefined;

            let responseBase;

            switch (type.split('-')[0]) {
              case 'Matrix': {
                responseBase =
                  selector === 'TE'
                    ? {
                        value: value,
                        label: 'text entry',
                        details: details,
                      }
                    : {
                        value: value,
                        label: answers.find((item) => item.value == value)
                          ?.label,
                        details: details,
                      };
                break;
              }
              case 'TE': {
                responseBase = {
                  value: value,
                  label: 'text entry',
                  details: details,
                };
                break;
              }
              case 'MC': {
                responseBase = {
                  value: value,
                  label:
                    selector === 'Single'
                      ? choices.find((item) => item.value === value)?.label
                      : choice.label,
                  details: details,
                };
                break;
              }
              default:
                break;
            }

            if (responseBase.value === undefined) {
              return;
            }

            if (tag.slice(0, 6) === 'QID120') {
              console.log(responseBase);
            }
            const response: Pick<Element, 'value' | 'label' | 'details'> =
              responseBase.details?.text?.length > 0
                ? checkIfJson(responseBase.details.text)
                  ? {
                      ...responseBase,
                      details: {
                        data: JSON.parse(responseBase.details.text),
                        choice: responseBase.details.choice,
                        answer: responseBase.details.answer,
                      },
                    }
                  : responseBase
                : {
                    value: responseBase.value,
                    label: responseBase.label,
                  };

            const uniqueIndex = uniques.findIndex((item) =>
              ld.isEqual(
                (({ value, label, details }) => ({ value, label, details }))(
                  item
                ),
                (({ value, label, details }) => ({ value, label, details }))(
                  response
                )
              )
            );

            if (uniqueIndex > -1) {
              records[index].elements.connect.push({
                id: uniques[uniqueIndex].id,
              });
            } else {
              const newElement: Element = {
                id: v4(),
                ...response,
                question: {
                  connect: {
                    id: id,
                  },
                },
              };
              records[index].elements.connect.push({
                id: newElement.id,
              });
              uniques.push(newElement);
            }
          });

          if (uniques.length > uniqueLength) {
            elements.push(...uniques.slice(uniqueLength));
          }
        });
      });
    }
  };

  sections.map((section) => {
    section.questions.create.map((question) => {
      encodeQuestion(question);
    });
  });

  const metaIds = Object.keys(responses[0])
    .reduce(
      (prev, curr) =>
        tags.map((item) => item.split('_')[0]).includes(curr.split('_')[0])
          ? prev
          : [...prev, curr],
      []
    )
    .filter((item) => item.slice(0, 3) !== 'QID');

  responses.map((response, index) => {
    const metaObject = {};
    metaIds.map((meta) => {
      metaObject[meta] = response[meta];
    });
    records[index].meta = JSON.stringify(metaObject);
  });
  return [records, elements as Element[]];
};
