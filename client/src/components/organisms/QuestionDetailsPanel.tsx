import { Divider, Flex, Heading, View } from '@adobe/react-spectrum';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { QuestionDetails } from '../../@types/QuestionDetails';
import { selectedQuestionVar } from '../../App';
import { EditButton } from '../atoms/EditButton';
import { BasicStats } from '../molecules/BasicStats';
import { getBasicStats } from '../../utils/getBasicStas';
import { ChoiceList } from '../molecules/ChoiceList';
import { AnswerList } from '../molecules/AnswerList';
import { ActionPanel } from '../molecules/ActionPanel';

type PropsBase = {};
export const defaultValue: QuestionDetails = {
  id: 'no id',
  qid: 'no qid',
  name: 'no name',
  tag: 'no tag',
  text: 'no text',
  type: 'MC',
  elements: [],
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as QuestionDetailsDefaultValue };
export type QuestionDetailsProps = Props;

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

export const QuestionDetailsPanel: React.FC<PropsBase> = (
  _props: PropsBase
) => {
  const selectedQuestion = useReactiveVar(selectedQuestionVar);
  const { data } = useQuery(QUERY, {
    variables: { id: selectedQuestion },
  });
  const [questionDetails, setQuestionDetails] = useState<QuestionDetails>(
    defaultValue
  );

  useEffect(() => {
    if (data) {
      setQuestionDetails(data.question || defaultValue);
    }
  }, [data]);

  return (
    <View>
      <BasicStats {...getBasicStats(questionDetails)} />
      {questionDetails.type === 'MC' ? (
        <AnswerList elements={questionDetails.elements} />
      ) : null}
      {questionDetails.type === 'Matrix' ? (
        <>
          <ChoiceList
            elements={questionDetails.elements.filter((item) => item.isChoice)}
          />
          <AnswerList
            elements={questionDetails.elements.filter((item) => item.isAnswer)}
          />
        </>
      ) : null}
      {questionDetails.type === 'TE' ? (
        <AnswerList elements={questionDetails.elements} isTextEntry />
      ) : null}
      <ActionPanel />
    </View>
  );
};
QuestionDetailsPanel.defaultProps = defaultValue;
