import { Flex, Heading, Divider } from '@adobe/react-spectrum';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React from 'react';
import { selectedQuestionVar } from '../../App';
import { EditButton } from '../atoms/EditButton';

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
  const { data } = useQuery(QUERY, {
    variables: { id: selectedQuestion },
  });
  return (
    <>
      <Flex direction={'row'} alignItems={'baseline'} height={'size-1000'}>
        <Heading level={1} marginEnd={'size-100'}>
          {data?.question?.name}
        </Heading>
        <EditButton />
      </Flex>
      <Divider size={'M'} />
    </>
  );
};
