import React, { useEffect, useState } from 'react';
import { Flex, Heading, View, Divider } from '@adobe/react-spectrum';
import {
  QuestionListItem,
  listItemDefaultValue,
  ListItemProps,
} from '../atoms/QuestionListItem';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { Scrollbar } from 'react-scrollbars-custom';
import Axios from 'axios';
import {
  isEditingVar,
  isLoadingVar,
  queryForQuestionVar,
} from '../../localState';
import { LoadedScreen } from './LoadedScreen';

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
    sections(orderBy: [{ name: asc }]) {
      name
      questions(orderBy: [{ name: asc }]) {
        id
        text
        name
      }
    }
  }
`;

export const QuestionList: React.FC<PropsBase> = (_props: PropsBase) => {
  const { data, loading, refetch } = useQuery(QUERY);
  const [sections, setSections] = useState([defaultValue]);
  const queryForQuestion = useReactiveVar(queryForQuestionVar);
  const [searchedQuestions, setSearchedQuestions] = useState([] as any[]);
  const isEditing = useReactiveVar(isEditingVar);

  useEffect(() => {
    if (data) {
      setSections(data.sections);
      isLoadingVar({ ...isLoadingVar(), questionTitle: false });
    }
  }, [data]);

  useEffect(() => {
    if (!loading) {
      isLoadingVar({ ...isLoadingVar(), main: false });
    }
  }, [loading]);

  useEffect(() => {
    if (!isEditing['questionTitle']) {
      refetch();
    }
  }, [isEditing, refetch]);

  useEffect(() => {
    if (queryForQuestion && queryForQuestion.length > 0) {
      isLoadingVar({ ...isLoadingVar(), search: true });
      Axios.get('http://localhost:7071/api/HttpTrigger1', {
        params: {
          query: queryForQuestion,
        },
      }).then((response) => {
        setSearchedQuestions(response.data);
        isLoadingVar({ ...isLoadingVar(), search: false });
      });
    }
  }, [queryForQuestion]);

  return (
    <View
      width={'100%'}
      height={'100%'}
      paddingTop={'size-200'}
      paddingBottom={'size-200'}
    >
      <Scrollbar style={{ width: '100%', height: '100%' }} noScrollX>
        {queryForQuestion ? (
          <LoadedScreen loading={isLoadingVar()['search']}>
            <Flex direction={'column'} minHeight={'size-5000'}>
              {searchedQuestions.map((item) => (
                <QuestionListItem {...item} />
              ))}
            </Flex>
          </LoadedScreen>
        ) : sections ? (
          <Flex direction={'column'} rowGap={'size-100'}>
            {sections.map((section) => (
              <View width={'100%'}>
                {!section.level ? (
                  <>
                    <Heading level={3} margin={0}>
                      {section.name}
                    </Heading>
                  </>
                ) : (
                  <></>
                )}
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
            ))}
          </Flex>
        ) : (
          <></>
        )}
      </Scrollbar>
    </View>
  );
};
QuestionList.defaultProps = defaultValue;
