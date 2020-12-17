import { Grid, repeat } from '@adobe/react-spectrum';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React from 'react';
import { filterVar, selectedQuestionVar } from '../../localState';
import { ActionTrigger } from '../atoms/ActionTrigger';
import { TwoColumnCard } from '../utils/TwoColumnCard';

type PropsBase = {};
export const defaultValue = {};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as actionPanelDefaultValue };
export type ActionPanelProps = Props;

const QUERY = gql`
  query GET_QUESTION($id: String!) {
    question(where: { id: $id }) {
      type
    }
  }
`;

export const ActionPanel: React.FC<PropsBase> = (_props: PropsBase) => {
  const selectedQuestion = useReactiveVar(selectedQuestionVar);
  const filter = useReactiveVar(filterVar);
  const { data } = useQuery(QUERY, {
    variables: {
      id: selectedQuestion,
    },
  });

  return (
    <TwoColumnCard title={'Actions'}>
      <Grid
        columns={repeat('auto-fit', 'size-2000')}
        autoRows={'size-1200'}
        columnGap={'size-400'}
      >
        {(data && data.question?.type === 'MC') || filter ? (
          <ActionTrigger type={'CrossTab'} />
        ) : (
          <></>
        )}
        <ActionTrigger type={'SimilaritySearch'} />
      </Grid>
    </TwoColumnCard>
  );
};
ActionPanel.defaultProps = defaultValue;
