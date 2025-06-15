import React, { useEffect, useState } from "react";
import '../css/statusdetailsstyle.css';
import { Link } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { gql, useQuery } from '@apollo/client';

// 타입 정의
type PlanData = {
  Title: string;
  planRate: number;
  totalPlan: { days: number; time: number };
  achievedPlan: { days: number; time: number };
  deferredPlan: { days: number; time: number };
};

// GraphQL 쿼리 
const GET_STATS_BY_STUDY_PLAN = gql`
  query {
    getStatsByStudyPlan {
      Title
      planRate
      totalPlan { days time }
      achievedPlan { days time }
      deferredPlan { days time }
    }
  }
`;

// ProgressCard 컴포넌트
const ProgressCard = ({ Title, planRate, totalPlan, achievedPlan, deferredPlan }: PlanData) => {
  const COLORS = ['#2E328C', '#6B74DB', '#A0A8F7'];
  const data = [
    { name: '이행률', value: achievedPlan.time },
    { name: '미이행', value: totalPlan.time - achievedPlan.time - deferredPlan.time },
    { name: '연기율', value: deferredPlan.time }
  ];

  return (
    <div className="progress-card">
      <h3>{Title} <span className="small-text">전체 계획의 {planRate}%</span></h3>
      <div className="card-content">
        <div className="card-left">
          <table className="plan-table">
            <tbody>
              <tr>
                <th rowSpan={2}>이행률</th>
                <td>전체 계획</td>
                <td>계획 일수: {totalPlan.days}일</td>
                <td>계획 시간: {totalPlan.time}시간</td>
              </tr>
              <tr>
                <td>이행한 계획</td>
                <td>계획 일수: {achievedPlan.days}일</td>
                <td>계획 시간: {achievedPlan.time}시간</td>
              </tr>

              <tr>
                <th rowSpan={2}>연기율</th>
                <td>이행한 계획</td>
                <td>계획 일수: {achievedPlan.days}일</td>
                <td>계획 시간: {achievedPlan.time}시간</td>
              </tr>
              <tr>
                <td>연기한 계획</td>
                <td>계획 일수: {deferredPlan.days}일</td>
                <td>계획 시간: {deferredPlan.time}시간</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-right">
          <PieChart width={280} height={280}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${value}시간`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

const StatusdetailsPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
    }
  }, []);

  const [startDate, setStartDate] = useState<string>('2024-03-01');
  const [endDate, setEndDate] = useState<string>('2024-06-01');

  // 더미데이터
  const [plans, setPlans] = useState<PlanData[]>([
    {
      Title: "6월 모의고사 대비 계획",
      planRate: 60,
      totalPlan: { days: 50, time: 100 },
      achievedPlan: { days: 40, time: 81 },
      deferredPlan: { days: 4, time: 8 }
    },
    {
      Title: "내신대비 1차 계획",
      planRate: 30,
      totalPlan: { days: 33, time: 67 },
      achievedPlan: { days: 25, time: 51 },
      deferredPlan: { days: 2, time: 5 }
    }
  ]);

  // API 호출
  const { data, loading, error } = useQuery(GET_STATS_BY_STUDY_PLAN, {
    onCompleted: (apiData) => {
      setPlans(apiData.getStatsByStudyPlan);
    }
  });

  const handleQueryClick = async () => {
    console.log("조회 버튼 클릭됨 - 나중에 API 연결 예정");
  };

  return (
    <>
      <header className="survey-header">
        <nav>
          <h2><a href="/main">Edu<br />Compass</a></h2>
          <ul>
            <li><Link to="/planStart">계획 캘린더</Link></li>
            <li><Link to="/makeplanStart">AI 계획 생성</Link></li>
            <li><Link to="/status" className="active">학습 현황</Link></li>
            <li><Link to="/books">교재 추천</Link></li>
            <li><Link to="/mypage">마이페이지</Link></li>
          </ul>
          <div className="log">
            <div className="login">
              <Link to="/login">{username ? `${username}님` : "로그인"}</Link>
            </div>
            <div className="join">
              <Link to="/">logout</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="survey-main">
        <div className="sidebar">
          <div className="sidebar-title">학습 현황</div>
          <ul className="sidebar-menu">
            <li><a href="#">학습 현황</a></li>
            <li className="active"><a href="#">계획별 학습 현황</a></li>
            <hr />
          </ul>
        </div>

        <div className="period-wrapper">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="period-bar">
              <div className="label">기간 설정</div>
              <DatePicker
                label="시작일"
                value={startDate ? dayjs(startDate) : null}
                onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : '')}
                slotProps={{ textField: { size: 'small' } }}
              />
              <span className="separator">~</span>
              <DatePicker
                label="종료일"
                value={endDate ? dayjs(endDate) : null}
                onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : '')}
                slotProps={{ textField: { size: 'small' } }}
              />
              <button className="query-btn" onClick={handleQueryClick}>현황 조회</button>
            </div>
          </LocalizationProvider>

          {/* 반복 렌더링 */}
          {plans.map(plan => (
            <ProgressCard
              key={plan.Title}
              {...plan}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default StatusdetailsPage;
