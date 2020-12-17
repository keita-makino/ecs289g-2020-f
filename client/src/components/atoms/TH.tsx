import { Flex, Heading, ActionButton, TextField } from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import ChevronUpDown from '@spectrum-icons/workflow/ChevronUpDown';
import React, { useEffect, useState } from 'react';
import { queryForChoiceVar, sortByVar } from '../../localState';

export const TH = (props: {
  label: 'value' | 'label' | 'records';
  target: 'choice' | 'answer';
  search?: boolean;
}) => {
  const sortBy = useReactiveVar(sortByVar);
  const [text, setText] = useState('');

  useEffect(() => {
    if (text === '') {
      queryForChoiceVar(null);
      return;
    }
    const timeout = setTimeout(() => queryForChoiceVar(text), 1250);
    return () => clearTimeout(timeout);
  }, [text]);
  return (
    <Flex gridArea={props.label}>
      <Heading marginTop={'size-50'} marginBottom={'size-50'}>
        {props.label}
        {props.search ? (
          <TextField
            marginStart={'size-100'}
            placeholder="Search labels"
            onChange={(e) => {
              setText(e);
            }}
            value={text}
          />
        ) : (
          <></>
        )}
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
