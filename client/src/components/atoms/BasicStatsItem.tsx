import React from 'react';
import { Flex, Heading, View } from '@adobe/react-spectrum';
import { Body } from './Body';

type PropsBase = {
  heading: string;
  text: string;
};
export const defaultValue = {
  heading: 'no heading',
  text: 'no text',
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as basicStatsItemDefaultValue };
export type BasicStatsItemProps = Props;

export const BasicStatsItem: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;

  return (
    <Flex alignItems={'center'} marginTop={'size-50'} marginBottom={'size-50'}>
      <Flex height={'100%'} alignItems={'baseline'}>
        <Heading level={3} margin={0} marginEnd={'size-50'}>
          {props.heading}:
        </Heading>
        <View marginEnd={'size-50'}>
          <Body>{props.text}</Body>
        </View>
      </Flex>
    </Flex>
  );
};
BasicStatsItem.defaultProps = defaultValue;
