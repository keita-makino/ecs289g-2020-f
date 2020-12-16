import {
  Grid,
  IllustratedMessage,
  ProgressCircle,
  Heading,
} from '@adobe/react-spectrum';
import { motion } from 'framer-motion';
import React from 'react';
import { useMeasure } from 'react-use';
import { LoadingScreen } from './LoadingScreen';

export type LoadedScreenProps = React.PropsWithChildren<{
  loading: boolean;
  size?: string;
}>;

export const LoadedScreen: React.FC<LoadedScreenProps> = (
  props: LoadedScreenProps
) => {
  const [ref, dimension] = useMeasure<HTMLDivElement>();
  return (
    <>
      <LoadingScreen
        loading={props.loading}
        dimension={dimension}
        size={props.size as 'S' | 'M' | 'L'}
      />
      <motion.div
        animate={{
          opacity: -((props.loading ? 1 : 0) - 1),
        }}
        initial={{
          opacity: 0,
        }}
      >
        <div ref={ref}>{props.children}</div>
      </motion.div>
    </>
  );
};
