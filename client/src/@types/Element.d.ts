export type Element = {
  id: string;
  records: {
    id: string;
  }[];
  choice: Choice;
  answer: Choice;
};

export type Choice = {
  id: string;
  value: number;
  label: string;
  details?: string;
};
