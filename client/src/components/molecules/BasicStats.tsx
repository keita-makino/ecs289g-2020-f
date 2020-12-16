import { Flex } from '@adobe/react-spectrum';
import React from 'react';
import { BasicStatsItem, BasicStatsItemProps } from '../atoms/BasicStatsItem';
import { TwoColumnCard } from '../utils/TwoColumnCard';

type PropsBase = Object;
export const defaultValue = [];
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as basicStatsDefaultValue };
export type BasicStatsProps = Props;

export const BasicStats: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;

  const items = Object.entries(props).map(
    (item: any): BasicStatsItemProps => ({
      heading: item[0],
      text: item[1],
    })
  );

  return items.length > 0 ? (
    <TwoColumnCard title={'Basic Info'}>
      <Flex
        gridArea={'contents'}
        direction={'column'}
        marginTop={'size-50'}
        marginBottom={'size-50'}
      >
        {items.map((item) => (
          <BasicStatsItem {...item} />
        ))}
      </Flex>
    </TwoColumnCard>
  ) : null;
};
BasicStats.defaultProps = defaultValue;
