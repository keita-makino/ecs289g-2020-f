import { Grid, Flex, Heading, Divider } from '@adobe/react-spectrum';
import React from 'react';
import { Element } from '../../@types';
import { ChoiceListItem } from '../atoms/ChoiceListItem';
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

  return (
    <TwoColumnCard title={'Choices'}>
      <Flex
        gridArea={'contents'}
        direction={'column'}
        marginTop={'size-50'}
        marginBottom={'size-50'}
      >
        <Grid
          areas={['value  label', 'divider  divider']}
          columns={['size-1200', 'auto']}
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
          <Divider size={'S'} gridArea={'divider'} />
        </Grid>
        <ScrollableList height={'25rem'}>
          {props.elements.length > 0 ? (
            props.elements.map((element) => (
              <ChoiceListItem contents={element} />
            ))
          ) : (
            <></>
          )}
        </ScrollableList>
      </Flex>
    </TwoColumnCard>
  );
};
ChoiceList.defaultProps = defaultValue;
