import React from 'react';

export type BodyProps = React.PropsWithChildren<{}>;

export const Body: React.FC<BodyProps> = (props: BodyProps) => {
  return (
    <p className={'spectrum-Body spectrum-Body--sizeM'}>{props.children}</p>
  );
};
