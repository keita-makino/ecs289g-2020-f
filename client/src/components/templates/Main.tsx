import React from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Grid, View } from '@adobe/react-spectrum';
import { useWindowSize } from 'react-use';
import { QuestionDetailsPanel } from '../organisms/QuestionDetailsPanel';
import { QuestionTitle } from '../molecules/QuestionTitle';
import { useReactiveVar } from '@apollo/client';
import {
  isLoadingVar,
  selectedActionVar,
  selectedQuestionVar,
} from '../../localState';
import { CrossTabPanel } from '../organisms/CrossTabPanel';
import { LoadedScreen } from '../molecules/LoadedScreen';
import Scrollbar from 'react-scrollbars-custom';

type Props = {};

export const Main: React.FC<Props> = () => {
  const window = useWindowSize();
  const selectedAction = useReactiveVar(selectedActionVar);
  const selectedQuestion = useReactiveVar(selectedQuestionVar);
  const isLoadingMain = useReactiveVar(isLoadingVar)['main'];
  const isLoadingPanel = useReactiveVar(isLoadingVar)['panel'];

  return (
    <>
      <LoadedScreen loading={isLoadingMain}>
        <Grid
          areas={['side  main']}
          columns={['size-5000', 'auto']}
          height={window.height}
          width={window.width}
          columnGap={'size-400'}
        >
          <Grid gridArea={'side'}>
            <Sidebar />
          </Grid>
          <Grid gridArea={'main'} alignContent={'start'}>
            {selectedQuestion === null ? (
              <></>
            ) : (
              <LoadedScreen loading={isLoadingPanel}>
                <Scrollbar
                  style={{ width: '100%', height: window.height }}
                  noScrollX
                >
                  <View height={window.height}>
                    <QuestionTitle />
                    {selectedAction !== 'CrossTab' ? (
                      <QuestionDetailsPanel />
                    ) : (
                      <CrossTabPanel />
                    )}
                  </View>
                </Scrollbar>
              </LoadedScreen>
            )}
          </Grid>
        </Grid>
      </LoadedScreen>
    </>
  );
};
