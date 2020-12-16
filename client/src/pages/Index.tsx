import React from 'react';
import { Main } from '../components/templates/Main';
import { Provider, defaultTheme } from '@adobe/react-spectrum';

type Props = {};

const Index: React.FC<Props> = () => {
  return (
    <Provider theme={defaultTheme}>
      <Main />
    </Provider>
  );
};

export default Index;
