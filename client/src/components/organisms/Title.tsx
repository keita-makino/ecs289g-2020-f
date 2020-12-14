import { Flex, Grid, Heading } from '@adobe/react-spectrum';
import React from 'react';

export type TitleProps = {};

export const Title: React.FC<TitleProps> = () => {
  return (
    <Flex position={'absolute'} width={'size-5000'} zIndex={10}>
      <Grid
        width={'100%'}
        areas={['title', 'icon']}
        columns={['5fr', '1fr']}
        alignItems={'start'}
        margin={'size-300'}
      >
        <Flex alignSelf={'center'}>
          <Heading level={1} margin={0} height={'100%'}>
            Q-SeeD
          </Heading>
        </Flex>
      </Grid>
    </Flex>
  );
};
