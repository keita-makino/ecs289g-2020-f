import {
  Form,
  TextField,
  ActionButton,
  Text,
  Flex,
} from '@adobe/react-spectrum';
import React, { useEffect, useState } from 'react';
import { queryForQuestionVar } from '../../App';

export type QuestionSearchProps = {};

export const QuestionSearch: React.FC<QuestionSearchProps> = (
  props: QuestionSearchProps
) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (text === '') {
      queryForQuestionVar(null);
      return;
    }
    const timeout = setTimeout(() => queryForQuestionVar(text), 1250);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <Form width={'100%'}>
      <Flex
        alignItems={'end'}
        justifyContent={'space-between'}
        columnGap={'size-300'}
      >
        <TextField
          label="Search Question"
          placeholder="Query"
          onChange={(e) => {
            setText(e);
          }}
          value={text}
          width={'100%'}
        />
        <ActionButton width={'size-1200'} onPressEnd={() => setText('')}>
          <Text>Clear</Text>
        </ActionButton>
      </Flex>
    </Form>
  );
};
