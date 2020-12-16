import { Grid, repeat } from '@adobe/react-spectrum';
import React from 'react';
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

export const ActionPanel: React.FC<PropsBase> = (_props: PropsBase) => {
  return (
    <TwoColumnCard title={'Actions'}>
      <Grid
        columns={repeat('auto-fit', 'size-2000')}
        autoRows={'size-1200'}
        columnGap={'size-400'}
      >
        <ActionTrigger type={'CrossTab'} />
        <ActionTrigger type={'SimilaritySearch'} />
      </Grid>
    </TwoColumnCard>
  );
};
ActionPanel.defaultProps = defaultValue;
