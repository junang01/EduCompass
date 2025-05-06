import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import client from "./ts/apollo";
import AmainPage from "./pages/amain";
import LoginPage from "./pages/login";
import JoinPage from "./pages/join";
import JoinCompletePage from "./pages/joinComplete";
import BmainPage from "./pages/bmain";
import MakeplanStartPage from './pages/makeplanStart';
import MyPage from './pages/MyPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AmainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/joinComplete" element={<JoinCompletePage />} />
          <Route path="/main" element={<BmainPage />} />
          <Route path="/planStart" element={<MakeplanStartPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
