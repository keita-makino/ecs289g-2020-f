import React from 'react';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
  ApolloProvider,
  makeVar,
} from '@apollo/client';
import Index from './pages/Index';
import { hot } from 'react-hot-loader';
import { fields } from './localState';

const cache = new InMemoryCache({
  resultCaching: true,
  typePolicies: {
    Query: {
      fields,
    },
  },
});
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  resolvers: {},
  link,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Index />
    </ApolloProvider>
  );
};

export default hot(module)(App);
