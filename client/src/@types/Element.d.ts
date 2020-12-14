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
  }[];
  isChoice?: boolean;
  isAnswer?: boolean;
};
