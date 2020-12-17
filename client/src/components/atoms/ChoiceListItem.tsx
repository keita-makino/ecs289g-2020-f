import React, { useEffect } from 'react';
import {
  Flex,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Text,
} from '@adobe/react-spectrum';
import { Choice, Element } from '../../@types';
import { filterVar } from '../../localState';
import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';

type Props = {
  contents: Choice;
};
export const defaultValue = {
  contents: { id: 'no id', value: 0, label: 'no text', records: [] },
};

export const ChoiceListItem: React.FC<Props> = (props: Props) => {
  const filter = useReactiveVar(filterVar);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => setIsSelected(filter === props.contents.label), [
    filter,
    props.contents.label,
  ]);

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
          isSelected={isSelected}
          onChange={() => {
            filterVar(
              filter === props.contents.label ? null : props.contents.label
            );
          }}
        />
      </Flex>
    </Grid>
  );
};
ChoiceListItem.defaultProps = defaultValue;
