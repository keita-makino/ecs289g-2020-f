import { Flex } from '@adobe/react-spectrum';
import EditIn from '@spectrum-icons/workflow/EditIn';
import React, { useRef, useState } from 'react';
import { usePress } from 'react-aria';

export type EditButtonProps = {};

export const EditButton: React.FC<EditButtonProps> = (
  props: EditButtonProps
) => {
  const ref = useRef(null);
  const [events, setEvents] = useState([] as string[]);
  const { pressProps, isPressed } = usePress({});

  return (
    <div
      {...pressProps}
      ref={ref}
      style={{
        background: isPressed ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0)',
        cursor: 'pointer',
        padding: '0.2rem',
      }}
      role={'gridcell'}
      onClick={() => {
        // selectedQuestionVar(props.id);
      }}
    >
      <Flex>
        <EditIn aria-label={'EditIn'} size={'S'} />
      </Flex>
    </div>
  );
};
