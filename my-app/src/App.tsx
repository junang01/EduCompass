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
import SurveyMainPage from './pages/planSurvey/SurveyMainPage';
import StatusPage from './pages/Status';
import CalendarPage from './pages/CalendarPage';
import ChangePlanStartPage from './pages/changePlan/ChangePlanStart';
import PlanCallPage from './pages/changePlan/ChangePlanSurvey1';
import ChangePlanSurvey2Page from './pages/changePlan/ChangePlanSurvey2';

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
          <Route path="/planPage" element={<SurveyMainPage />}></Route>
          <Route path='/status' element={<StatusPage />}></Route>
          <Route path='/calendar' element={<CalendarPage />}></Route>
          <Route path='/change' element={<ChangePlanStartPage />}></Route>
          <Route path='/changePlanSurvey1' element={<PlanCallPage />}></Route>
          <Route path='/changePlanSurvey2' element={<ChangePlanSurvey2Page />}></Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
