import React from 'react';
import Scrollbar from 'react-scrollbars-custom';
import { useMeasure } from 'react-use';

export type ScrollableListProps = React.PropsWithChildren<{
  height: string;
}>;

export const ScrollableList: React.FC<ScrollableListProps> = (
  props: ScrollableListProps
) => {
  const [ref, dimension] = useMeasure<HTMLDivElement>();
  return (
    <Scrollbar
      style={{
        width: '100%',
        height: dimension.height,
        maxHeight: `calc(${props.height} - 48px)`,
      }}
    >
      <div ref={ref} style={{ maxHeight: props.height }}>
        {props.children}
      </div>
    </Scrollbar>
  );
};
