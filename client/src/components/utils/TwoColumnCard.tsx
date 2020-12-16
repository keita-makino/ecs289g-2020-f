import { Divider, Flex, Grid, Heading } from '@adobe/react-spectrum';
import React from 'react';

export type TwoColumnCardProps = React.PropsWithChildren<{
  title: string;
}>;

export const TwoColumnCard: React.FC<TwoColumnCardProps> = (
  props: TwoColumnCardProps
) => {
  return (
    <Grid
      marginTop={'size-300'}
      areas={['header  divider  contents']}
      columns={['size-1600', 'size-400', 'auto']}
      maxHeight={'size-6000'}
      width={'100%'}
    >
      <Flex gridArea={'header'}>
        <Heading
          level={2}
          marginTop={'size-50'}
          marginBottom={'size-50'}
          marginEnd={'size-50'}
        >
          {props.title}
        </Heading>
      </Flex>
      <Divider size={'S'} orientation={'vertical'} />
      {props.children}
    </Grid>
  );
};
