import { ActionButton, Flex, Grid, Text, View } from '@adobe/react-spectrum';
import { gql, useReactiveVar, useQuery } from '@apollo/client';
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft';
import React from 'react';
import { useMeasure } from 'react-use';
import { selectedQuestionVar, selectedQuestionForCrossTabVar } from '../../App';
import { ActionTrigger } from '../atoms/ActionTrigger';
import { CrossTabQuestions } from '../molecules/CrossTabQuestions';
import { TwoColumnCard } from '../utils/TwoColumnCard';

import { ResponsiveHeatMap } from '@nivo/heatmap';

type PropsBase = {};
export const defaultValue = {};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as crossTabPanelDefaultValue };
export type CrossTabPanelProps = Props;

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
        value
        label
        records {
          id
        }
        details
        isChoice
        isAnswer
      }
    }
  }
`;

export const CrossTabPanel: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const [ref, dimension] = useMeasure<HTMLDivElement>();
  const selectedQuestions = [
    useReactiveVar(selectedQuestionVar),
    useReactiveVar(selectedQuestionForCrossTabVar),
  ];

  const { data: dataPrimary } = useQuery(QUERY, {
    variables: { id: selectedQuestions[0] },
  });
  const { data: dataSecondary } = useQuery(QUERY, {
    variables: { id: selectedQuestions[1] },
  });

  return (
    <View>
      {selectedQuestions[1] ? null : (
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          width={dimension.width}
          height={dimension.height}
          UNSAFE_style={{
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
        >
          <Flex columnGap={'size-100'} alignItems={'center'}>
            <ChevronLeft size={'L'} />
            <Flex>
              <Text>
                Select secondary question to view a cross-tab analysis.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Grid width={'100%'}>
        <div ref={ref}>
          <ActionTrigger type={null} />
          <TwoColumnCard title={'Cross-Tab'}>
            <CrossTabQuestions
              primary={dataPrimary?.question.name}
              secondary={dataSecondary?.question.name}
            />
          </TwoColumnCard>
        </div>
      </Grid>
    </View>
  );
};
CrossTabPanel.defaultProps = defaultValue;
