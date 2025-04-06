// src/ts/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4001/graphql", // 백엔드 주소
  cache: new InMemoryCache(),
});

export default client;
