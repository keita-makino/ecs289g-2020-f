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

export const selectedQuestionVar = makeVar<string | null>(null);
export const selectedQuestionForCrossTabVar = makeVar<string | null>(null);
export const selectedActionVar = makeVar<string | null>(null);
export const queryForQuestionVar = makeVar<string | null>(null);

const cache = new InMemoryCache({
  resultCaching: true,
  typePolicies: {
    Query: {
      fields: {
        selectedQuestion: {
          read() {
            return selectedQuestionVar();
          },
        },
        selectedQuestionForCrossTab: {
          read() {
            return selectedQuestionForCrossTabVar();
          },
        },
        selectedAction: {
          read() {
            return selectedActionVar();
          },
        },
        queryForQuestion: {
          read() {
            return queryForQuestionVar();
          },
        },
      },
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
