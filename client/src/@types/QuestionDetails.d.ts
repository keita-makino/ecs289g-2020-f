import { Element } from './Element';

export type QuestionDetails = {
  id: string;
  qid: string;
  name: string;
  tag: string;
  text: string;
  type: 'MC' | 'Matrix' | 'TE' | 'SBS';
  elements: Element[];
};
