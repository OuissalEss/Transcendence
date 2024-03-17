import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import './styles/global.css'; // Import global styles
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import client from './apolloClient';
import { ApolloProvider } from '@apollo/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)

