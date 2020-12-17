import { makeVar } from '@apollo/client';

export const selectedQuestionVar = makeVar<string | null>(null);
export const selectedQuestionForCrossTabVar = makeVar<string | null>(null);
export const selectedActionVar = makeVar<string | null>(null);
export const queryForQuestionVar = makeVar<string | null>(null);
export const queryForChoiceVar = makeVar<string | null>(null);
export const isLoadingVar = makeVar<{ [key: string]: boolean }>({
  main: true,
  question: false,
  questionTitle: false,
  panel: true,
  crossTab: true,
  plot: true,
  search: true,
  choiceSearch: false,
});
export const isEditingVar = makeVar<{ [key: string]: boolean }>({
  questionTitle: false,
});
export const sortByVarInitial = {
  answer: {
    by: undefined,
    asc: false,
  },
  choice: {
    by: undefined,
    asc: false,
  },
};
export const sortByVar = makeVar<{
  [key: string]: {
    by: 'value' | 'label' | 'records' | undefined;
    asc: boolean;
  };
}>(sortByVarInitial);
export const filterVar = makeVar<string | null>(null);
export const isDarkVar = makeVar<boolean>(false);

export const fields = {
  selectedQuestion: {
    read() {
      return selectedQuestionVar();
    },
  },
  selectedQuestionForCrossTab: {
    read() {
      return selectedQuestionForCrossTabVar();
    },
  },
  selectedAction: {
    read() {
      return selectedActionVar();
    },
  },
  queryForQuestion: {
    read() {
      return queryForQuestionVar();
    },
  },
  queryForChoice: {
    read() {
      return queryForChoiceVar();
    },
  },
  isLoading: {
    read() {
      return isLoadingVar();
    },
  },
  isEditing: {
    read() {
      return isLoadingVar();
    },
  },
  sortBy: {
    read() {
      return sortByVar();
    },
  },
  filter: {
    read() {
      return filterVar();
    },
  },
  isDark: {
    read() {
      return isDarkVar();
    },
  },
};
