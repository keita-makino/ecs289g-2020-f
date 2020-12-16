import { Grid, Flex, Heading, Divider } from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import Filter from '@spectrum-icons/workflow/Filter';
import React from 'react';
import { Element } from '../../@types';
import { sortByVar } from '../../localState';
import { ChoiceListItem } from '../atoms/ChoiceListItem';
import { TH } from '../atoms/TH';
import { ScrollableList } from '../utils/ScrollableList';
import { TwoColumnCard } from '../utils/TwoColumnCard';

type PropsBase = { elements: Element[] };
export const defaultValue = { elements: [] };
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as choiceListDefaultValue };
export type ChoiceListProps = Props;

export const ChoiceList: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const sortBy = useReactiveVar(sortByVar);

  return (
    <TwoColumnCard title={'Choices'}>
      <Flex
        gridArea={'contents'}
        direction={'column'}
        marginTop={'size-50'}
        marginBottom={'size-50'}
      >
        <Grid
          areas={['value  label  filter', 'divider  divider divider']}
          columns={['size-1200', 'auto', 'size-2000']}
          columnGap={'size-200'}
        >
          <TH label={'value'} target={'choice'} />
          <TH label={'label'} target={'choice'} />
          <Flex gridArea={'filter'} alignItems={'center'} columnGap={'size-50'}>
            <Heading marginTop={'size-50'} marginBottom={'size-50'}>
              filter
            </Heading>
            <Filter size={'S'} />
          </Flex>
          <Divider size={'S'} gridArea={'divider'} />
        </Grid>
        <ScrollableList height={'25rem'}>
          {props.elements.length > 0 ? (
            props.elements
              .sort((a, b) => {
                if (sortBy['choice']['by']) {
                  const by = sortBy['choice'].by;
                  const asc = sortBy['choice'].asc;
                  return asc
                    ? a[by] < b[by]
                      ? -1
                      : 1
                    : a[by] > b[by]
                    ? -1
                    : 1;
                } else {
                  return 1;
                }
              })
              .map((element) => <ChoiceListItem contents={element} />)
          ) : (
            <></>
          )}
        </ScrollableList>
      </Flex>
    </TwoColumnCard>
  );
};
ChoiceList.defaultProps = defaultValue;
