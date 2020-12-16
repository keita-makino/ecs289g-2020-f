import { ActionButton, Content, Heading } from '@adobe/react-spectrum';
import Magnify from '@spectrum-icons/workflow/Magnify';
import ModernGridView from '@spectrum-icons/workflow/ModernGridView';
import React from 'react';
import { selectedActionVar } from '../../localState';

type PropsBase = { type: 'CrossTab' | 'SimilaritySearch' | null };
export const defaultValue = { type: 'CrossTab' as PropsBase['type'] };
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as actionTriggerDefaultValue };
export type ActionTriggerProps = Props;

const getMessage = (props: Props) => {
  const content = { text: 'return', icon: () => <></> };

  switch (props.type) {
    case 'CrossTab':
      content.text = 'Cross-Tab';
      content.icon = () => <ModernGridView />;
      break;
    case 'SimilaritySearch':
      content.text = 'Explore';
      content.icon = () => <Magnify />;
      break;
    default:
      content.text = 'return';
      break;
  }
  return (
    <Content>
      {content.icon()}
      <Heading level={4} margin={0}>
        {content.text}
      </Heading>
    </Content>
  );
};

export const ActionTrigger: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const isExploring = selectedActionVar() === 'SimilaritySearch';

  return (
    <ActionButton
      width={props.type ? '100%' : 'size-1600'}
      height={props.type ? '100%' : 'size-800'}
      position={props.type ? 'relative' : 'fixed'}
      bottom={props.type ? 'unset' : '2rem'}
      onPressEnd={() => {
        if (props.type === selectedActionVar()) {
          selectedActionVar(null);
        } else {
          selectedActionVar(props.type);
        }
      }}
      UNSAFE_style={{
        backgroundColor:
          isExploring && props.type === 'SimilaritySearch'
            ? 'rgba(200,255,255,0.4)'
            : 'unset',
        cursor: 'pointer',
      }}
    >
      {getMessage(props)}
    </ActionButton>
  );
};
ActionTrigger.defaultProps = defaultValue;
