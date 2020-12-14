import React, { useEffect, useState } from 'react';
import { Flex, Heading, View, Divider } from '@adobe/react-spectrum';
import {
  QuestionListItem,
  listItemDefaultValue,
  ListItemProps,
} from '../atoms/QuestionListItem';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { Scrollbar } from 'react-scrollbars-custom';
import { queryForQuestionVar } from '../../App';
import Axios from 'axios';

type PropsBase = {
  name?: string;
  questions?: ListItemProps[];
  level?: number;
};
export const defaultValue = {
  name: 'no title',
  questions: [listItemDefaultValue],
  level: 0,
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as questionListDefaultValue };
export type QuestionListProps = Props;

const QUERY = gql`
  query {
    sections {
      name
      questions {
        id
        text
        name
      }
    }
  }
`;

export const QuestionList: React.FC<PropsBase> = (_props: PropsBase) => {
  const { data } = useQuery(QUERY);
  const [sections, setSections] = useState([defaultValue]);
  const queryForQuestion = useReactiveVar(queryForQuestionVar);
  const [searchedQuestions, setSearchedQuestions] = useState([] as any[]);

  useEffect(() => {
    if (data) {
      setSections(data.sections);
    }
  }, [data]);

  useEffect(() => {
    if (queryForQuestion && queryForQuestion.length > 0) {
      Axios.get('http://localhost:7071/api/HttpTrigger1', {
        params: {
          query: queryForQuestion,
        },
      }).then((response) => {
        setSearchedQuestions(response.data);
      });
    }
  }, [queryForQuestion]);

  return (
    <View width={'100%'} height={'100%'}>
      <Scrollbar style={{ width: '100%', height: '100%' }}>
        {queryForQuestion && searchedQuestions.length > 0 ? (
          <Flex direction={'column'}>
            <>
              {searchedQuestions.map((item) => (
                <QuestionListItem {...item} />
              ))}
            </>
          </Flex>
        ) : sections ? (
          sections.map((section) => (
            <Flex direction={'column'}>
              <View width={'100%'}>
                {!section.level ? (
                  <Heading level={3} marginBottom={0}>
                    {section.name}
                  </Heading>
                ) : null}
                <Flex>
                  <Flex width={'size-200'}>
                    <Divider
                      orientation={'vertical'}
                      size={'S'}
                      UNSAFE_style={{ marginLeft: '0.35rem' }}
                    />
                  </Flex>
                  <View
                    width={'100%'}
                    paddingStart={'size-50'}
                    paddingEnd={'size-200'}
                  >
                    <Flex direction={'column'} width={'100%'}>
                      {section.questions.map((question: any) => (
                        <QuestionListItem {...question} />
                      ))}
                    </Flex>
                  </View>
                </Flex>
              </View>
            </Flex>
          ))
        ) : null}
      </Scrollbar>
    </View>
  );
};
QuestionList.defaultProps = defaultValue;
