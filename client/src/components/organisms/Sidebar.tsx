import React from 'react';
import { Divider, Flex, Heading, Text, View } from '@adobe/react-spectrum';
import { useSpring, motion, useTransform } from 'framer-motion';
import { useWindowSize } from 'react-use';
import { QuestionList } from '../molecules/QuestionList';
import { QuestionSearch } from '../molecules/QuestionSearch';

export const Sidebar: React.FC = () => {
  const { height } = useWindowSize();

  const y = useSpring(-height, { stiffness: 50, mass: 0.4 });
  const o = useTransform(y, [-height, 0], [0, 0.2]);

  return (
    <motion.div>
      <View minHeight={'100vh'}>
        <Flex direction={'column'}>
          <View
            backgroundColor={'gray-400'}
            height={'100%'}
            width={'size-5000'}
            padding={'size-200'}
            paddingTop={'0'}
            position={'fixed'}
          >
            <Heading level={1}>Q-SeeD</Heading>
            <Divider size={'M'} />
            <QuestionSearch />
            <QuestionList />
          </View>
        </Flex>
      </View>
    </motion.div>
  );
};
