import { Flex, Grid, Heading } from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import ArrowLeft from '@spectrum-icons/workflow/ArrowLeft';
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft';
import Close from '@spectrum-icons/workflow/Close';
import React from 'react';
import { filterVar, selectedQuestionForCrossTabVar } from '../../localState';
import { Body } from '../atoms/Body';

export type CrossTabQuestionsProps = { primary?: string; secondary?: string };

export const CrossTabQuestions: React.FC<CrossTabQuestionsProps> = (
  props: CrossTabQuestionsProps
) => {
  const filter = useReactiveVar(filterVar);
  return (
    <Grid areas={['primary', 'cross', 'secondary']}>
      <Flex direction={'row'} alignItems={'baseline'}>
        <Heading
          marginTop={'size-50'}
          marginBottom={'size-50'}
          marginEnd={'size-100'}
          level={3}
        >
          Primary:
        </Heading>
        <Body>{props.primary}</Body>
        <Body>{'   ---   '}</Body>
        <Body>{filter}</Body>
      </Flex>
      <Flex marginTop={'size-50'} marginBottom={'size-50'}>
        <Close UNSAFE_style={{ opacity: 0.3 }} size={'L'} />
      </Flex>
      <Flex direction={'row'} alignItems={'baseline'} position={'relative'}>
        <Heading
          marginTop={'size-50'}
          marginBottom={'size-50'}
          marginEnd={'size-100'}
          level={3}
        >
          Secondary:
        </Heading>
        <Body>{props.secondary}</Body>
      </Flex>
    </Grid>
  );
};
