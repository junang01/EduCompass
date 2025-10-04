import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import client from "./ts/apollo";
import AmainPage from './pages/main/Amain';
import LoginPage from './pages/login/Login';
import JoinPage from './pages/join/Join';
import JoinCompletePage from './pages/join/JoinComplete';
import BmainPage from './pages/main/Bmain';
import StudyPlanStartPage from './pages/studyPlan/StudyPlanStart';
import StudyPlanSurveyMainPage from './pages/studyPlan/studyPlanSurvey/StudyPlanSurveyMain';
import MyPage from './pages/myPage/MyPage';
import StatusPage from './pages/status/Status';
import StatusDetailsPage from './pages/status/StatusDetails';
import CalendarPage from './pages/calendar/Calendar';
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
          <Route path="/planStart" element={<StudyPlanStartPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/planPage" element={<StudyPlanSurveyMainPage />}></Route>
          <Route path='/status' element={<StatusPage />}></Route>
          <Route path='/statusDetail' element={<StatusDetailsPage />}></Route>
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
