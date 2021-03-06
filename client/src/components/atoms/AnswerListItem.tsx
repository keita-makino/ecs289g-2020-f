import React from 'react';
import { Flex, Grid, Text, View } from '@adobe/react-spectrum';
import { Element, Choice } from '../../@types';
import { useMeasure } from 'react-use';
import { motion } from 'framer-motion';
import { isLoadingVar } from '../../localState';
import { useReactiveVar } from '@apollo/client';

type Props = {
  contents: Choice & { records: Element['records'] };
  max: number;
};
export const defaultValue = {
  contents: { id: 'no id', value: 0, label: 'no text', records: [] },
  max: 100,
};

export const AnswerListItem: React.FC<Props> = (props: Props) => {
  const [ref, dimension] = useMeasure<HTMLDivElement>();
  const isLoading = useReactiveVar(isLoadingVar)['panel'];

  return (
    <Grid
      areas={['value  label  response', 'divider  divider  divider']}
      columns={['size-1200', 'size-6000', 'auto']}
      columnGap={'size-200'}
    >
      <Flex gridArea={'value'}>
        <Text marginTop={'size-50'} marginBottom={'size-50'}>
          {props.contents.value}
        </Text>
      </Flex>
      <Flex gridArea={'label'}>
        <Text
          marginTop={'size-50'}
          marginBottom={'size-50'}
          UNSAFE_style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {props.contents.label}
        </Text>
      </Flex>
      <Flex gridArea={'response'}>
        <div style={{ width: '100%' }} ref={ref}>
          <Flex columnGap={'size-100'} alignItems={'center'}>
            <motion.div
              initial={{ scaleX: 0, transformOrigin: 'center left' }}
              animate={{ scaleX: isLoading ? 0 : 1 }}
              transition={{ ease: 'easeOut', duration: 1 }}
            >
              <View
                backgroundColor={'blue-400'}
                UNSAFE_style={{
                  height: dimension.height - 12,
                  width: `${
                    ((dimension.width - 160) * props.contents.records.length) /
                    props.max
                  }px`,
                }}
              >
                <></>
              </View>
            </motion.div>
            <Text marginTop={'size-50'} marginBottom={'size-50'}>
              {props.contents.records.length}
            </Text>
          </Flex>
        </div>
      </Flex>
    </Grid>
  );
};
AnswerListItem.defaultProps = defaultValue;
