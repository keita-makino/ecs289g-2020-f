import { Flex, Grid, Text, View } from '@adobe/react-spectrum';
import { gql, useReactiveVar, useQuery } from '@apollo/client';
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft';
import React, { useEffect } from 'react';
import { useMeasure } from 'react-use';
import {
  selectedQuestionVar,
  selectedQuestionForCrossTabVar,
  isLoadingVar,
  filterVar,
} from '../../localState';
import { ActionTrigger } from '../atoms/ActionTrigger';
import { CrossTabQuestions } from '../molecules/CrossTabQuestions';
import { TwoColumnCard } from '../utils/TwoColumnCard';

import { HeatMapPanel } from '../molecules/HeatMapPanel';
import { QuestionDetails } from '../../@types';
import { LoadedScreen } from '../molecules/LoadedScreen';

const QUERY = gql`
  query GET_QUESTION($id: String!) {
    question(where: { id: $id }) {
      id
      qid
      name
      tag
      text
      type
      elements {
        id
        choice {
          id
          value
          label
          details
        }
        answer {
          id
          value
          label
          details
        }
        records {
          id
        }
      }
    }
  }
`;

export const CrossTabPanel: React.FC = () => {
  const [ref, dimension] = useMeasure<HTMLDivElement>();
  const selectedQuestions = [
    useReactiveVar(selectedQuestionVar),
    useReactiveVar(selectedQuestionForCrossTabVar),
  ];

  const { data: dataPrimary } = useQuery<{ question: QuestionDetails }>(QUERY, {
    variables: { id: selectedQuestions[0] },
  });
  const { data: dataSecondary, loading } = useQuery<{
    question: QuestionDetails;
  }>(QUERY, {
    variables: { id: selectedQuestions[1] },
  });

  const isLoading = isLoadingVar()['crossTab'];

  useEffect(() => {
    isLoadingVar({ ...isLoadingVar(), crossTab: loading });
  }, [loading]);

  return (
    <Grid alignContent={'stretch'} rows={['auto', '1fr']}>
      {selectedQuestions[1] ? null : (
        <Flex
          columnGap={'size-100'}
          alignItems={'center'}
          justifyContent={'center'}
          width={dimension.width}
          height={dimension.height}
          UNSAFE_style={{
            position: 'absolute',
            backgroundColor: 'rgba(224,255,255,0.25)',
            backdropFilter: 'blur(3px)',
            zIndex: 200,
          }}
        >
          <ChevronLeft size={'L'} />
          <Flex>
            <Text>
              Select the secondary question to view a cross-tab analysis.
            </Text>
          </Flex>
        </Flex>
      )}
      <View position={'fixed'} bottom={'size-600'}>
        <ActionTrigger type={null} />
      </View>
      <LoadedScreen loading={isLoading}>
        <Grid width={'100%'}>
          <div ref={ref}>
            <TwoColumnCard title={'Cross-Tab'}>
              <CrossTabQuestions
                primary={dataPrimary?.question.name}
                secondary={dataSecondary?.question.name}
              />
            </TwoColumnCard>
          </div>
        </Grid>
      </LoadedScreen>
      {dataPrimary !== undefined && dataSecondary !== undefined ? (
        <HeatMapPanel
          primaryElements={dataPrimary.question.elements}
          secondaryElements={[...dataSecondary.question.elements].sort((a, b) =>
            (a.choice.details || a.choice.label) >
            (b.choice.details || b.choice.label)
              ? -1
              : 1
          )}
          primaryFilter={filterVar()}
        />
      ) : null}
    </Grid>
  );
};
