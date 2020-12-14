import React, { useEffect } from 'react';
import { Main } from '../components/templates/Main';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { useSpring, motion, useTransform } from 'framer-motion';
import { gql, useQuery } from '@apollo/client';

type Props = {};

const QUERY = gql`
  query {
    questions {
      id
    }
  }
`;

const Index: React.FC<Props> = () => {
  const { data } = useQuery(QUERY);
  console.log(data);
  const opacity = useSpring(1, { stiffness: 30, mass: 0.4 });
  const opacityInverse = useTransform(opacity, [0, 1], [1, 0]);

  return (
    <Provider theme={defaultTheme}>
      <Main />
    </Provider>
  );
};

export default Index;
