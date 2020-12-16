import React, { useRef } from 'react';
import { Flex, Header, Heading, Text, View } from '@adobe/react-spectrum';
import { useButton, usePress } from 'react-aria';
import {
  isLoadingVar,
  queryForQuestionVar,
  selectedActionVar,
  selectedQuestionForCrossTabVar,
  selectedQuestionVar,
} from '../../localState';
import { useReactiveVar } from '@apollo/client';
import Checkmark from '@spectrum-icons/workflow/Checkmark';

type PropsBase = {
  id?: string;
  size?: number;
  name?: string | null;
  text?: string;
  level?: number;
  children?: Props[];
  isSearched?: boolean;
};
export const defaultValue = {
  id: '',
  size: 12,
  name: 'no name',
  text: 'no text',
  level: 0,
  children: [],
  isSearched: false,
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as listItemDefaultValue };
export type ListItemProps = Props;

export const QuestionListItem: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const ref = useRef(null);
  const { pressProps, isPressed } = usePress({
    onPressEnd: () => {
      if (isSelectingSecondary) {
        selectedQuestionForCrossTabVar(props.id);
        isLoadingVar({ ...isLoadingVar(), crossTab: true });
      } else {
        selectedQuestionVar(props.id);
        isLoadingVar({ ...isLoadingVar(), panel: true });
      }
    },
  });

  const selectedQuestion = useReactiveVar(selectedQuestionVar);
  const selectedQuestionForCrossTab = useReactiveVar(
    selectedQuestionForCrossTabVar
  );
  const selectedAction = useReactiveVar(selectedActionVar);
  const isSelectingSecondary = selectedAction === 'CrossTab';

  return (
    <Flex direction={'column'}>
      <View padding={'size-25'}>
        <View
          backgroundColor={
            selectedQuestion === props.id ||
            selectedQuestionForCrossTab === props.id
              ? 'gray-500'
              : 'transparent'
          }
          borderRadius={'small'}
        >
          <div
            {...pressProps}
            ref={ref}
            style={{
              background: isPressed ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0)',
              padding: '0.2rem',
              paddingLeft: '0.5rem',
              cursor: 'pointer',
            }}
            role={'gridcell'}
          >
            <Flex alignItems={'center'} columnGap={'size-100'}>
              <Header
                margin={0}
                marginStart={`size-${props.level}00`}
                UNSAFE_style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {props.name}
              </Header>
              <Text
                marginStart={`size-${props.level}00`}
                UNSAFE_style={{
                  opacity: 0.6,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.text}
              </Text>
              {selectedQuestion === props.id ? (
                <Flex minWidth={'size-300'}>
                  <Checkmark size={'S'} color={'positive'} />
                </Flex>
              ) : (
                <></>
              )}
              {selectedQuestionForCrossTab === props.id ? (
                <Flex minWidth={'size-300'}>
                  <Checkmark size={'S'} color={'notice'} />
                </Flex>
              ) : (
                <></>
              )}
            </Flex>
          </div>
        </View>
      </View>
    </Flex>
  );
};
QuestionListItem.defaultProps = defaultValue;
