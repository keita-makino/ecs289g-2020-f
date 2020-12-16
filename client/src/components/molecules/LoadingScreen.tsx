import {
  Grid,
  IllustratedMessage,
  ProgressCircle,
  Heading,
} from '@adobe/react-spectrum';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export type LoadingScreenProps = {
  loading: boolean;
  dimension: Pick<
    DOMRectReadOnly,
    'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
  >;
  size?: 'S' | 'M' | 'L';
};

export const LoadingScreen: React.FC<LoadingScreenProps> = (
  props: LoadingScreenProps
) => {
  const [inTransition, setInTransition] = useState(false);

  useEffect(() => {
    if (!props.loading) {
      setInTransition(true);
    } else {
      setInTransition(false);
    }
  }, [props.loading]);

  return (
    <motion.div
      animate={{
        display: inTransition ? 'none' : 'unset',
        opacity: props.loading ? 1 : 0,
      }}
      initial={{
        opacity: 1,
        display: 'unset',
      }}
    >
      <Grid
        height={props.dimension.height}
        width={props.dimension.width}
        alignContent={'center'}
        justifyContent={'center'}
        position={'absolute'}
      >
        <IllustratedMessage>
          <ProgressCircle
            isIndeterminate
            size={props.size || 'L'}
            aria-label="Loading..."
          />
          <Heading>Loading...</Heading>
        </IllustratedMessage>
      </Grid>
    </motion.div>
  );
};
