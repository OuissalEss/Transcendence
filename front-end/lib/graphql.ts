// lib/graphql.ts
import { useMemo } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';

let apolloClient: ApolloClient<any>;

function createApolloClient() {
    const httpLink = createHttpLink({
        uri: 'http://localhost:3000/api/graphql', // Adjust the URL based on your GraphQL server
    });

    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }

    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState: any) {
    const client = useMemo(() => initializeApollo(initialState), [initialState]);
    return client;
}
