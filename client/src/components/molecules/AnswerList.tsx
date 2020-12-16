import {
  Grid,
  Flex,
  Heading,
  Divider,
  ActionButton,
} from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import ChevronUpDown from '@spectrum-icons/workflow/ChevronUpDown';
import React, { useState } from 'react';
import { Element } from '../../@types';
import { filterVar, sortByVar } from '../../localState';
import { AnswerListItem } from '../atoms/AnswerListItem';
import { TH } from '../atoms/TH';
import { ScrollableList } from '../utils/ScrollableList';
import { TwoColumnCard } from '../utils/TwoColumnCard';

type PropsBase = {
  elements: Element[];
  isTextEntry?: boolean;
};
export const defaultValue = {
  elements: [],
  isTextEntry: false,
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as answerListDefaultValue };
export type AnswerListProps = Props;

export const AnswerList: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const sortBy = useReactiveVar(sortByVar);
  const filter = useReactiveVar(filterVar);

  const max = props.elements.reduce(
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
          columns={['size-1200', 'size-5000', 'auto']}
          columnGap={'size-200'}
        >
          <TH label={'value'} target={'answer'} />
          <TH label={'label'} target={'answer'} />
          <TH label={'records'} target={'answer'} />
          <Divider size={'S'} gridArea={'divider'} />
        </Grid>
        <ScrollableList height={'30rem'}>
          {props.elements.length > 0 ? (
            [...props.elements]
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
              .map((element: Element) =>
                props.isTextEntry ? (
                  <AnswerListItem
                    contents={{
                      ...{
                        ...element,
                        records: element.records.filter((record) =>
                          filter
                            ? record.elements
                                .map((item) => item.id)
                                .includes(filter)
                            : true
                        ),
                      },
                      label: element.details?.text || 'no entry',
                    }}
                    max={max}
                  />
                ) : (
                  <AnswerListItem contents={element} max={max} />
                )
              )
          ) : (
            <></>
          )}
        </ScrollableList>
      </Flex>
    </TwoColumnCard>
  );
};
AnswerList.defaultProps = defaultValue;
