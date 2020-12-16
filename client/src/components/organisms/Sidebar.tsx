import React from 'react';
import {
  Divider,
  Flex,
  Heading,
  View,
  Image,
  ActionButton,
} from '@adobe/react-spectrum';
import { useMeasure, useWindowSize } from 'react-use';
import { QuestionList } from '../molecules/QuestionList';
import { QuestionSearch } from '../atoms/QuestionSearch';
import logo from '../../images/github.png';

export const Sidebar: React.FC = () => {
  const [ref, dimension] = useMeasure<HTMLDivElement>();
  const windowSize = useWindowSize();

  return (
    <View
      backgroundColor={'gray-400'}
      paddingStart={'size-200'}
      paddingEnd={'size-200'}
      width={'size-5000'}
    >
      <Flex direction={'column'} minHeight={'100vh'}>
        <div ref={ref}>
          <View
            UNSAFE_style={{
              boxSizing: 'border-box',
            }}
          >
            <Flex justifyContent={'space-between'} alignItems={'center'}>
              <Heading level={1}>Q-SeeD</Heading>
              <ActionButton
                isQuiet
                UNSAFE_style={{ cursor: 'pointer' }}
                onPressEnd={() =>
                  window.open(
                    'https://github.com/keita-makino/ecs289g-2020-f',
                    '_blank'
                  )
                }
              >
                <Image
                  alt={'GitHub'}
                  src={logo}
                  height={'2rem'}
                  width={'2rem'}
                  UNSAFE_style={{ opacity: 0.6 }}
                />
              </ActionButton>
            </Flex>
            <Divider size={'M'} />
            <QuestionSearch />
          </View>
        </div>
        <View height={windowSize.height - dimension.height}>
          <QuestionList />
        </View>
      </Flex>
    </View>
  );
};
