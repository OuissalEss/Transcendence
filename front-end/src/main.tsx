import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import Cookies from "js-cookie";
import './index.css'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)