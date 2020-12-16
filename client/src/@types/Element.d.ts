export type Element = {
  id: string;
  value: number;
  label: string;
  details?: {
    text: string;
    choice: number;
  };
  records: {
    id: string;
    elements: Element[];
  }[];
  isChoice?: boolean;
  isAnswer?: boolean;
};
