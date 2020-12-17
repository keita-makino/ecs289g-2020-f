import React from 'react';
import { Main } from '../components/templates/Main';
import { Provider, defaultTheme, darkTheme } from '@adobe/react-spectrum';
import { useReactiveVar } from '@apollo/client';
import { isDarkVar } from '../localState';

type Props = {};

const Index: React.FC<Props> = () => {
  const isDark = useReactiveVar(isDarkVar);
  return (
    <Provider theme={isDark ? darkTheme : defaultTheme}>
      <Main />
    </Provider>
  );
};

export default Index;
