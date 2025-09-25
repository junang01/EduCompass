import React, { useEffect, useState } from 'react';
import './status.css';
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { gql, useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';

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
  영어: ["영어"],
  한국사: ["한국사"],
  제2외국어: ["독일어", "프랑스어", "스페인어", "중국어", "일본어", "러시아어", "아랍어", "한문"],
  사회탐구: ["생활과 윤리", "윤리와 사상", "한국지리", "세계지리", "동아시아사", "세계사", "정치와 법", "경제", "사회·문화"],
  과학탐구: ["물리학 I", "물리학 Ⅱ", "화학 I", "화학 Ⅱ", "생명과학 I", "생명과학 Ⅱ", "지구과학 I", "지구과학 Ⅱ"]
};

const StatusPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [fetchStats, { data, loading, error }] = useLazyQuery(GET_STATS_BY_PERIOD);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUsername(parsed.user?.name || "");
      } catch (error) {
        console.error("❌ localStorage 파싱 실패:", error);
      }
    }
  }, []);

  const handleQueryClick = () => {
    if (!startDate || !endDate) {
      alert("기간을 설정해주세요!");
      return;
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const maxRange = start.add(6, 'month');

    if (end.isAfter(maxRange)) {
      alert("최대 조회 가능 기간은 6개월입니다.");
      return;
    }

    fetchStats({ variables: { start: startDate, end: endDate } });
  };

  const handleLogout = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const { accessToken } = JSON.parse(userData);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          query: `mutation { logout }`,
        }),
      });

      const result = await response.json();

      if (result?.data?.logout) {
        localStorage.removeItem("user");
        navigate("/");
      } else {
        console.error("❌ 서버 로그아웃 실패", result);
      }
    } catch (error) {
      console.error("❌ 로그아웃 요청 중 오류 발생:", error);
    }
  };

  const subjectStats = data?.getStatsByPeriod?.subjectStats || [];

  // 상위 과목별 통계 집계
  const groupedStats: {
    [key: string]: { completionRate: number; postponeRate: number; incompleteRate: number; count: number }
  } = {};

type SubjectStat = {
  subject: string;
  completionRate: number;
  postponeRate: number;
  incompleteRate: number;
};

(subjectStats as SubjectStat[]).forEach((stat) => {
  for (const [main, subs] of Object.entries(subSubjects)) {
    if (subs.includes(stat.subject) || stat.subject === main) {
      if (!groupedStats[main]) {
        groupedStats[main] = {
          completionRate: 0,
          postponeRate: 0,
          incompleteRate: 0,
          count: 0,
        };
      }
      groupedStats[main].completionRate += stat.completionRate;
      groupedStats[main].postponeRate += stat.postponeRate;
      groupedStats[main].incompleteRate += stat.incompleteRate;
      groupedStats[main].count += 1;
      break;
    }
  }
});

  const isProgressEmpty = Object.keys(groupedStats).length === 0;

  return (
    <>
      <header>
        <nav>
          <h2>
            <Link to="/">
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
              <Link to="/mypage">{username ? `${username}님` : "로그인"}</Link>
            </div>
            <div className="join">
              <button className="logout-btn" onClick={handleLogout}>logout</button>
            </div>
          </div>
        </nav>
      </header>

      <main className="survey-main">
        <div className="sidebar">
          <div className="sidebar-title">학습 현황</div>
          <ul className="sidebar-menu">
            <li className="active"><a href="#">학습 현황</a></li>
            {Object.keys(groupedStats).map((mainSubject) => (
              <li key={mainSubject}>
                <Link to={`/statusDetail/${mainSubject}`} style={{ fontSize: '12px' }}>{mainSubject}</Link>
              </li>
            ))}
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

          {loading ? (
            <div className="no-plan-message">로딩 중...</div>
          ) : error ? (
            <div className="no-plan-message">에러 발생: {error.message}</div>
          ) : isProgressEmpty ? (
            <div className="no-plan-message">생성된 AI 계획이 없습니다.</div>
          ) : (
            <div className="subject-cards">
              {Object.entries(groupedStats).map(([subject, stat]) => {
                const avg = (v: number) => Math.round(v / stat.count);
                const percentData = {
                  이행: avg(stat.completionRate),
                  불이행: avg(stat.incompleteRate),
                  연기: avg(stat.postponeRate),
                };
                return (
                  <div className="subject-card" key={subject}>
                    <h4>{subject}</h4>
                    {(['이행', '불이행', '연기'] as const).map((type) => {
                      const percentValue = percentData[type];
                      return (
                        <div className="progress-bar" key={type}>
                          <span>계획 {type}률</span>
                          <div className="bar-line-wrapper">
                            <div className="bar-background">
                              <div
                                className={`bar-fill ${type === '불이행' ? 'fail' : type === '연기' ? 'delay' : ''}`}
                                style={{ width: `${percentValue}%` }}
                              ></div>
                            </div>
                            <span className="percent-text">{percentValue}%</span>
                          </div>
                        </div>
                      );
                    })}
                    <button
                      className='detail-btn'
                      onClick={() => navigate(`/statusDetail/${subject}?start=${startDate}&end=${endDate}`)}>
                        세부현황
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default StatusPage;
