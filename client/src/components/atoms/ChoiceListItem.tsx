import React from 'react';
import { Flex, Grid, Text } from '@adobe/react-spectrum';
import { Element } from '../../@types';

type Props = {
  contents: Element;
};
export const defaultValue = {
  contents: { id: 'no id', value: 0, label: 'no text', records: [] },
};

export const ChoiceListItem: React.FC<Props> = (props: Props) => {
  return (
    <Grid
      areas={['value  label  responses']}
      columns={['size-1200', 'auto']}
      gap={'size-200'}
    >
      <Flex gridArea={'value'}>
        <Text marginTop={'size-50'} marginBottom={'size-50'}>
          {props.contents.value}
        </Text>
      </Flex>
      <Flex gridArea={'label'}>
        <Text
          marginTop={'size-50'}
          marginBottom={'size-50'}
          UNSAFE_style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {props.contents.label}
        </Text>
      </Flex>
    </Grid>
  );
};
ChoiceListItem.defaultProps = defaultValue;
