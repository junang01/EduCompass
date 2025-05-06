import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // ← 백엔드 주소 정확히!
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // ✅ 토큰 가져오기
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "", // ✅ Bearer 붙여야 함!
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // ✅ 인증 링크 먼저 연결
  cache: new InMemoryCache(),
});

export default client;
