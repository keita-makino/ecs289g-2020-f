import { Grid, Flex, Divider } from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Element } from '../../@types';
import {
  filterVar,
  isLoadingVar,
  queryForChoiceVar,
  sortByVar,
} from '../../localState';
import { AnswerListItem } from '../atoms/AnswerListItem';
import { TH } from '../atoms/TH';
import { ScrollableList } from '../utils/ScrollableList';
import { TwoColumnCard } from '../utils/TwoColumnCard';
import { LoadedScreen } from './LoadedScreen';

type PropsBase = {
  id: string | null;
  elements: Element[];
  isChoiceBased?: boolean;
  isTextEntry?: boolean;
};
export const defaultValue = {
  id: null,
  elements: [],
  isChoiceBased: false,
  isTextEntry: false,
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as answerListDefaultValue };
export type AnswerListProps = Props;

export const getItemDetails = (item: any) =>
  JSON.stringify({
    value: item.value,
    label: item.label,
    details: item.details,
  });

export const AnswerList: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const sortBy = useReactiveVar(sortByVar);
  const filter = useReactiveVar(filterVar);
  const searchQuery = useReactiveVar(queryForChoiceVar);
  const [searchedQuestions, setSearchedQuestions] = useState([] as any[]);

  useEffect(() => {
    if (searchQuery) {
      isLoadingVar({ ...isLoadingVar(), choiceSearch: true });
      Axios.get('http://localhost:7071/api/HttpTrigger3', {
        params: {
          id: props.id,
          query: searchQuery,
          isChoiceBased: props.isChoiceBased,
          isTextEntry: props.isTextEntry,
        },
      }).then((response) => {
        setSearchedQuestions(
          response.data.map(
            (item: any) =>
              item[props.isChoiceBased ? 'choice' : 'answer'][
                props.isTextEntry ? 'details' : 'label'
              ]
          )
        );
        isLoadingVar({ ...isLoadingVar(), choiceSearch: false });
      });
    }
  }, [props.id, props.isChoiceBased, props.isTextEntry, searchQuery]);

  const uniqueArray =
    props.elements.length > 0
      ? props.elements
          .filter((item) => (props.isChoiceBased ? item.choice : item.answer))
          .map((item) => (props.isChoiceBased ? item.choice : item.answer))
          .filter(
            (item, index, array) =>
              array
                .map((item) => getItemDetails(item))
                .indexOf(getItemDetails(item)) === index
          )
          .map((item) => ({
            ...item,
            records: props.elements
              .filter((item) =>
                props.isChoiceBased ? item.choice : item.answer
              )
              .filter((element) =>
                filter
                  ? getItemDetails(
                      props.isChoiceBased ? element.choice : element.answer
                    ) === getItemDetails(item) &&
                    element.choice.label === filter
                  : getItemDetails(
                      props.isChoiceBased ? element.choice : element.answer
                    ) === getItemDetails(item)
              )
              .reduce((prev, curr) => [...prev, ...curr.records], [] as any[]),
          }))
          .filter((item) =>
            searchedQuestions.length > 0
              ? searchedQuestions.includes(
                  props.isTextEntry ? item.details : item.label
                )
              : 1
          )
      : [];

  const max = uniqueArray.reduce(
    (prev: number, curr: { records: string | any[] }) =>
      curr.records.length > prev ? curr.records.length : prev,
    0
  );

  return (
    <TwoColumnCard title={'Answers'}>
      <Flex
        gridArea={'contents'}
        direction={'column'}
        marginTop={'size-50'}
        marginBottom={'size-50'}
      >
        <Grid
          areas={['value  label  records', 'divider  divider  divider']}
          columns={['size-1200', 'size-6000', 'auto']}
          columnGap={'size-200'}
        >
          <TH label={'value'} target={'answer'} />
          <TH label={'label'} target={'answer'} search />
          <TH label={'records'} target={'answer'} />
          <Divider size={'S'} gridArea={'divider'} />
        </Grid>
        <LoadedScreen loading={isLoadingVar()['choiceSearch']}>
          <ScrollableList height={'30rem'}>
            {uniqueArray.length > 0 ? (
              uniqueArray
                .sort((a, b) => {
                  if (sortBy['answer']['by']) {
                    const by = sortBy['answer'].by;
                    const asc = sortBy['answer'].asc;
                    if (by === 'value' || by === 'label') {
                      return asc
                        ? a[by] < b[by]
                          ? -1
                          : 1
                        : a[by] > b[by]
                        ? -1
                        : 1;
                    } else {
                      return asc
                        ? a['records'].length < b['records'].length
                          ? -1
                          : 1
                        : a['records'].length > b['records'].length
                        ? -1
                        : 1;
                    }
                  } else {
                    return 1;
                  }
                })
                .map((answer) =>
                  props.isTextEntry ? (
                    <AnswerListItem
                      contents={{
                        ...answer,
                        label: answer.details || 'no entry',
                      }}
                      max={max}
                    />
                  ) : (
                    <AnswerListItem contents={answer} max={max} />
                  )
                )
            ) : (
              <></>
            )}
          </ScrollableList>
        </LoadedScreen>
      </Flex>
    </TwoColumnCard>
  );
};
AnswerList.defaultProps = defaultValue;
