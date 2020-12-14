import {
  ActionButton,
  Content,
  Flex,
  Heading,
  IllustratedMessage,
  Text,
  View,
} from '@adobe/react-spectrum';
import React, { useRef, useState } from 'react';
import { usePress } from 'react-aria';
import { selectedActionVar } from '../../App';

type PropsBase = { type: 'CrossTab' | 'SimilaritySearch' | null };
export const defaultValue = { type: 'CrossTab' as PropsBase['type'] };
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as actionTriggerDefaultValue };
export type ActionTriggerProps = Props;

const getMessage = (props: Props) => {
  let text;
  switch (props.type) {
    case 'CrossTab':
      text = 'Cross-Tab';
      break;
    case 'SimilaritySearch':
      text = 'Explore';
      break;
    default:
      text = 'return';
      break;
  }
  return (
    <IllustratedMessage>
      <Heading>{text}</Heading>
    </IllustratedMessage>
  );
};

export const ActionTrigger: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const ref = useRef(null);
  const { pressProps, isPressed } = usePress({
    onPress: () => {
      selectedActionVar(props.type);
    },
  });

  return (
    <ActionButton
      width={props.type ? 'size-2000' : 'size-1600'}
      height={props.type ? 'size-2000' : 'size-800'}
      position={props.type ? 'relative' : 'fixed'}
      bottom={props.type ? 'unset' : '2rem'}
    >
      <div
        {...pressProps}
        ref={ref}
        style={{
          background: isPressed ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0)',
          cursor: 'pointer',
          padding: '0.2rem',
          width: '100%',
          height: '100%',
        }}
        role={'gridcell'}
        onClick={() => {
          // selectedQuestionVar(props.id);
        }}
      >
        <Flex justifyContent={'center'} alignContent={'center'} height={'100%'}>
          {getMessage(props)}
        </Flex>
      </div>
    </ActionButton>
  );
};
ActionTrigger.defaultProps = defaultValue;
