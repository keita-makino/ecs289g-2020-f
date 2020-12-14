import { Grid, Flex, Heading, Divider } from '@adobe/react-spectrum';
import React from 'react';
import { Element } from '../../@types';
import { AnswerListItem } from '../atoms/AnswerListItem';
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

  console.log(props);

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
          areas={['value  label  response', 'divider  divider  divider']}
          columns={['size-1200', 'size-5000', 'auto']}
          columnGap={'size-200'}
        >
          <Flex gridArea={'value'}>
            <Heading marginTop={'size-50'} marginBottom={'size-50'}>
              Value
            </Heading>
          </Flex>
          <Flex gridArea={'label'}>
            <Heading marginTop={'size-50'} marginBottom={'size-50'}>
              Label
            </Heading>
          </Flex>
          <Flex gridArea={'response'}>
            <Heading marginTop={'size-50'} marginBottom={'size-50'}>
              Response
            </Heading>
          </Flex>
          <Divider size={'S'} gridArea={'divider'} />
        </Grid>
        <ScrollableList height={'30rem'}>
          {props.elements.length > 0 ? (
            props.elements.map((element: Element) =>
              props.isTextEntry ? (
                <AnswerListItem
                  contents={{
                    ...element,
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
