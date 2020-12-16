import { Flex, Heading, ActionButton } from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import ChevronUpDown from '@spectrum-icons/workflow/ChevronUpDown';
import React from 'react';
import { sortByVar } from '../../localState';

export const TH = (props: {
  label: 'value' | 'label' | 'records';
  target: 'choice' | 'answer';
}) => {
  const sortBy = useReactiveVar(sortByVar);
  return (
    <Flex gridArea={props.label}>
      <Heading marginTop={'size-50'} marginBottom={'size-50'}>
        {props.label}
        <ActionButton
          isQuiet
          UNSAFE_style={{ cursor: 'pointer' }}
          onPressEnd={() => {
            const current = sortBy[props.target];
            sortByVar({
              ...sortByVar(),
              [props.target]: {
                by: props.label,
                asc: !current.asc,
              },
            });
          }}
        >
          {sortBy[props.target]['by'] === props.label ? (
            sortBy[props.target]['asc'] ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )
          ) : (
            <ChevronUpDown />
          )}
        </ActionButton>
      </Heading>
    </Flex>
  );
};
