import { Section } from './getSections';
import { v4 } from 'uuid';
import * as ld from 'lodash';
import { Choice, Question } from './getQuestions';

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
  choice?: Choice;
  answer?: Choice;
  question: {
    connect: {
      id: string;
    };
  };
};

export type ElementForDB = {
  id: string;
  choice?: { create: Choice & { id: string } };
  answer?: { create: Choice & { id: string } };
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
): Promise<[Record[], ElementForDB[]]> => {
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
    const {
      id,
      tag: tagBase,
      type,
      selector,
      subSelector,
      categories,
      choices,
      answers,
    } = {
      ...question,
    };

    if (categories) {
      categories.create.map((category) => encodeQuestion(category));
    } else {
      const choiceArray =
        type === 'Matrix'
          ? choices || [undefined]
          : selector === 'Single' || (type === 'MC' && subSelector !== 'TX')
          ? [undefined]
          : choices || [undefined];
      choiceArray.map((choice, choiceIndex) => {
        const answerArray = type.split('-').length > 1 ? answers : [undefined];
        answerArray.map((answer, answerIndex) => {
          const tag = [
            tagBase,
            choice
              ? choice.value !== undefined && type !== 'Matrix'
                ? choice.value
                : choiceIndex + 1
              : undefined,
            answer
              ? answer.value !== undefined
                ? answer.value
                : answerIndex + 1
              : undefined,
          ]
            .filter((item) => item !== undefined)
            .join('_')
            .replace(/(.*)_(\d+_\d+_\d+)/g, '$1#$2');

          console.log(tag);
          tags.push(tagBase);
          const uniques: Element[] = elements.filter(
            (item) => item.question.connect.id === id
          );
          const uniqueLength = uniques.length;

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
                ? -99
                : Number(responses[index][tag]);
            const details =
              type === 'TE' || selector === 'TE'
                ? responses[index][tag]
                : responses[index][tag.concat('_TEXT')] &&
                  responses[index][tag.concat('_TEXT')] !== '-99'
                ? responses[index][tag.concat('_TEXT')]
                : undefined;

            if (tagBase === 'C10_01') {
              console.log(answers.find((item) => item.value == value)?.label);
            }

            let responseBase;

            switch (type.split('-')[0]) {
              case 'Matrix': {
                responseBase =
                  selector === 'TE'
                    ? {
                        choice,
                        answer: {
                          value: 0,
                          label: 'text entry',
                          details: details,
                        },
                      }
                    : {
                        choice,
                        answer: {
                          value: value ? value : 0,
                          label:
                            answers.find((item) => item.value == value)
                              ?.label || 'no response',
                          details: details,
                        },
                      };
                break;
              }
              case 'TE': {
                responseBase = {
                  choice,
                  answer:
                    details && details !== ''
                      ? {
                          value: 1,
                          label: 'text entry',
                          details: details,
                        }
                      : {
                          value: 0,
                          label: 'no entry',
                          details: details,
                        },
                };
                break;
              }
              case 'MC': {
                responseBase = {
                  choice: {
                    value: value,
                    label:
                      choices.find((item) => item.value === value)?.label ||
                      'no response',
                  },
                  answer:
                    choice?.isTextAllowed && details && details !== ''
                      ? {
                          value: 1,
                          label: 'text entry',
                          details: details,
                        }
                      : undefined,
                };
                break;
              }
              default:
                break;
            }

            const uniqueIndex = uniques.findIndex((item) => {
              if (tag.slice(0, 6) === 'QID120') {
                console.log(responseBase);
              }
              const itemInfo = (({ choice, answer }) => ({
                choice: choice
                  ? {
                      value: choice.value,
                      label: choice.label,
                      details: choice.details,
                    }
                  : undefined,
                answer: answer
                  ? {
                      value: answer.value,
                      label: answer.label,
                      details: answer.details,
                    }
                  : undefined,
              }))(item);
              const responseInfo = (({ choice, answer }) => ({
                choice: choice
                  ? {
                      value: choice.value,
                      label: choice.label,
                      details: choice.details,
                    }
                  : undefined,
                answer: answer
                  ? {
                      value: answer.value,
                      label: answer.label,
                      details: answer.details,
                    }
                  : undefined,
              }))(responseBase);
              return ld.isEqual(itemInfo, responseInfo);
            });

            if (uniqueIndex > -1) {
              records[index].elements.connect.push({
                id: uniques[uniqueIndex].id,
              });
            } else {
              const newElement: Element = {
                id: v4(),
                choice: responseBase.choice
                  ? { ...responseBase.choice }
                  : undefined,
                answer: responseBase.answer
                  ? { ...responseBase.answer }
                  : undefined,
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

  const elementsForDB: ElementForDB[] = elements.map((element) => {
    return {
      ...element,
      choice: element.choice
        ? { create: { ...element.choice, id: v4() } }
        : undefined,
      answer: element.answer
        ? { create: { ...element.answer, id: v4() } }
        : undefined,
    };
  });

  return [records, elementsForDB];
};
