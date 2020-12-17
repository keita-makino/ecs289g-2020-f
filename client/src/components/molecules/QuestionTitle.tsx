import { Flex, Heading, Divider, TextField } from '@adobe/react-spectrum';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import {
  isEditingVar,
  isLoadingVar,
  selectedQuestionVar,
} from '../../localState';
import { EditButton } from '../atoms/EditButton';
import { LoadedScreen } from './LoadedScreen';

export type QuestionTitleProps = {};

const QUERY = gql`
  query GET_QUESTION($id: String!) {
    question(where: { id: $id }) {
      id
      name
    }
  }
`;

export const QuestionTitle: React.FC<QuestionTitleProps> = (
  props: QuestionTitleProps
) => {
  const selectedQuestion = useReactiveVar(selectedQuestionVar);
  const isEditing = useReactiveVar(isEditingVar)['questionTitle'];
  const isLoading = useReactiveVar(isLoadingVar)['questionTitle'];

  const { data } = useQuery(QUERY, {
    variables: { id: selectedQuestion },
  });

  const [text, setText] = useState<string | undefined>(undefined);

  return (
    <>
      <Flex justifyContent={'start'} minWidth={'size-3600'}>
        <LoadedScreen loading={isLoading} size={'M'}>
          <Flex
            direction={'row'}
            alignItems={'center'}
            minWidth={'size-3600'}
            height={'size-1000'}
          >
            {isEditing ? (
              <TextField
                label={null}
                value={text}
                placeholder={'New Name'}
                onChange={(e) => {
                  setText(e);
                }}
              />
            ) : (
              <Heading level={1} margin={0}>
                {data?.question?.name}
              </Heading>
            )}
            <EditButton text={text} id={data?.question?.id} />
          </Flex>
        </LoadedScreen>
      </Flex>
      <Divider size={'M'} />
    </>
  );
};
