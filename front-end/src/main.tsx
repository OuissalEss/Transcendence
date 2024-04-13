import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

import './index.css'
import AuthProvider from './provider/authProvider.tsx';
import client from './apolloClient.ts';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
)