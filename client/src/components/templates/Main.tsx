import React from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Grid, View } from '@adobe/react-spectrum';
import { useWindowSize } from 'react-use';
import { QuestionDetailsPanel } from '../organisms/QuestionDetailsPanel';
import { QuestionTitle } from '../molecules/QuestionTitle';
import { useReactiveVar } from '@apollo/client';
import { selectedActionVar } from '../../App';
import { CrossTabPanel } from '../organisms/CrossTabPanel';

type Props = {};

export const Main: React.FC<Props> = () => {
  const window = useWindowSize();
  const selectedAction = useReactiveVar(selectedActionVar);

  return (
    <>
      <Grid
        areas={['side  main']}
        columns={['size-5000', 'auto']}
        height={window.height}
        width={window.width}
      >
        <View gridArea={'side'}>
          <Sidebar />
        </View>
        <View
          gridArea={'main'}
          paddingStart={'size-400'}
          paddingEnd={'size-400'}
        >
          <QuestionTitle />
          {selectedAction === null ? (
            <QuestionDetailsPanel />
          ) : (
            <CrossTabPanel />
          )}
        </View>
      </Grid>
    </>
  );
};
