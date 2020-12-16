import React from 'react';
import {
  Flex,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Text,
} from '@adobe/react-spectrum';
import { Element } from '../../@types';
import { filterVar } from '../../localState';

type Props = {
  contents: Element;
};
export const defaultValue = {
  contents: { id: 'no id', value: 0, label: 'no text', records: [] },
};

export const ChoiceListItem: React.FC<Props> = (props: Props) => {
  return (
    <Grid
      areas={['value  label  filter']}
      columns={['size-1200', 'auto', 'size-2000']}
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
      <Flex gridArea={'filter'} UNSAFE_style={{ cursor: 'pointer' }}>
        <Switch
          aria-label={props.contents.label}
          onChange={(isSelected: boolean) => {
            if (isSelected) {
              filterVar(null);
            } else {
              filterVar(props.contents.id);
            }
          }}
        />
      </Flex>
    </Grid>
  );
};
ChoiceListItem.defaultProps = defaultValue;
