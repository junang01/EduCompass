import React, { useEffect, useState } from "react";
import './statusDetails.css';
import { Link, useParams, useLocation } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const GET_STATS_BY_PERIOD = gql`
  query GetStatsByPeriod($start: String!, $end: String!) {
    getStatsByPeriod(start: $start, end: $end) {
      subjectStats {
        subject
        completionRate
        postponeRate
        incompleteRate
      }
    }
  }
`;

const subSubjects: { [key: string]: string[] } = {
  국어: ["화법과 작문", "언어와 매체"],
  수학: ["확률과 통계", "미적분", "기하"],
  영어: [],
  한국사: [],
  제2외국어: ["독일어", "프랑스어", "스페인어", "중국어", "일본어", "러시아어", "아랍어", "한문"],
  사회탐구: ["생활과 윤리", "윤리와 사상", "한국지리", "세계지리", "동아시아사", "세계사", "정치와 법", "경제", "사회·문화"],
  과학탐구: ["물리학 I", "물리학 Ⅱ", "화학 I", "화학 Ⅱ", "생명과학 I", "생명과학 Ⅱ", "지구과학 I", "지구과학 Ⅱ"]
};

const COLORS = ['#2E328C', '#FF6565', '#8FB2FF'];

const StatusDetailsPage: React.FC = () => {
  const { mainSubject } = useParams<{ mainSubject: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const startDate = query.get('start') || '2024-03-01';
  const endDate = query.get('end') || '2024-06-01';

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
    }
  }, []);

  useEffect(() => {
    console.log("🧪 mainSubject:", mainSubject);
    console.log("🧪 조회 기간:", startDate, "~", endDate);
  }, []);

  const [fetchStats, { data, loading, error }] = useLazyQuery(GET_STATS_BY_PERIOD);

  useEffect(() => {
    if (startDate && endDate) {
      console.log("📡 fetchStats 실행됨");
      fetchStats({ variables: { start: startDate, end: endDate } });
    }
  }, [startDate, endDate, fetchStats]);

  useEffect(() => {
    if (data) {
      const subjectStats = data.getStatsByPeriod.subjectStats || [];
      console.log("📊 전체 통계 응답:", subjectStats);
      subjectStats.forEach((stat: any) => {
        console.log("🧾 수신된 과목:", stat.subject);
      });
    }
  }, [data]);

  const subjectStats = data?.getStatsByPeriod?.subjectStats || [];

  const subList = subSubjects[mainSubject || ""] || [];
  const filteredStats = subjectStats.filter((stat: any) => subList.includes(stat.subject));

  return (
    <>
      <header className="survey-header">
        <nav>
          <h2>
          <Link to="/main">
            Edu<br />Compass
          </Link>
          </h2>
          <ul>
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/bookSurveyMain">교재 추천</Link></li>
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
          <div className="sidebar-title">세부 과목 현황</div>
          <ul className="sidebar-menu">
            <li className="active"><a href="#">상위 과목: {mainSubject}</a></li>
            <hr />
          </ul>
        </div>

        <div className="period-wrapper">
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p>에러 발생: {error.message}</p>
          ) : filteredStats.length === 0 ? (
            <p>세부 과목 통계가 없습니다.</p>
          ) : (
            filteredStats.map((stat: any) => {
              const pieData = [
                { name: '이행률', value: Math.round(stat.completionRate) },
                { name: '불이행', value: Math.round(stat.incompleteRate) },
                { name: '연기율', value: Math.round(stat.postponeRate) },
              ];
              return (
                <div className="progress-card" key={stat.subject}>
                  <h3>{stat.subject}</h3>
                  <div className="card-content">
                    <div className="card-left">
                      <table className="plan-table">
                        <tbody>
                          <tr>
                            <th>이행률</th>
                            <td>{Math.round(stat.completionRate)}%</td>
                          </tr>
                          <tr>
                            <th>불이행률</th>
                            <td>{Math.round(stat.incompleteRate)}%</td>
                          </tr>
                          <tr>
                            <th>연기율</th>
                            <td>{Math.round(stat.postponeRate)}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="card-right">
                      <PieChart width={280} height={280}>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
};

export default StatusDetailsPage;
