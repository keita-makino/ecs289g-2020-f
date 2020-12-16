import {
  ActionButton,
  Grid,
  Heading,
  Text,
  repeat,
  Flex,
  Footer,
} from '@adobe/react-spectrum';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { isLoadingVar, selectedQuestionVar } from '../../localState';
import { TwoColumnCard } from '../utils/TwoColumnCard';
import { LoadedScreen } from './LoadedScreen';

export type ExplorePanelProps = { text: string };

export const ExplorePanel: React.FC<ExplorePanelProps> = (
  props: ExplorePanelProps
) => {
  const [searchedQuestions, setSearchedQuestions] = useState([] as any[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Axios.get('http://localhost:7071/api/HttpTrigger1', {
      params: {
        query: props.text,
      },
    }).then((response) => {
      setSearchedQuestions(response.data);
      setIsLoading(false);
    });
  }, [props.text]);

  return (
    <LoadedScreen loading={isLoading}>
      <TwoColumnCard title={'Similar-Questions'}>
        <Grid
          columns={repeat('auto-fit', 'size-6000')}
          autoRows={'size-1200'}
          minHeight={'size-2000'}
          gap={'size-200'}
        >
          {searchedQuestions
            .filter((item) => item.text !== props.text)
            .map((item) => (
              <ActionButton
                height={'size-1200'}
                UNSAFE_style={{ cursor: 'pointer' }}
                onPressEnd={() => {
                  isLoadingVar({ ...isLoadingVar(), panel: true });
                  selectedQuestionVar(item.id);
                }}
              >
                {
                  <Flex
                    columnGap={'size-100'}
                    alignContent={'center'}
                    direction={'column'}
                    margin={'size-200'}
                    UNSAFE_style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Heading level={3} margin={0}>
                      {item.name}
                    </Heading>
                    <Text>{item.text}</Text>
                    <Text UNSAFE_style={{ opacity: 0.6 }}>
                      Similarity: {Number(item.score).toFixed(3)}
                    </Text>
                  </Flex>
                }
              </ActionButton>
            ))}
        </Grid>
      </TwoColumnCard>
    </LoadedScreen>
  );
};
