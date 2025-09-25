import React, { useEffect, useState } from 'react';
import '../css/statusstyle.css';
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

type ProgressData = {
  결과: string;
  불이행: string;
  연기: string;
};

const StatusPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log("🧾 parsed.user.name 확인:", parsed.user?.name);
        setUsername(parsed.user?.name || ""); // ✅ 핵심 수정
      } catch (error) {
        console.error("❌ localStorage 파싱 실패:", error);
      }
    }
  }, []);

  const subjects = ['국어', '수학', '사회', '과학', '영어', '외국어'];
  const [progress, setProgress] = useState<Record<string, ProgressData>>({});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [fetchStats, { data, loading, error }] = useLazyQuery(GET_STATS_BY_PERIOD);

  useEffect(() => {
    if (data?.getStatsByPeriod?.subjectStats) {
      const newProgress: Record<string, ProgressData> = {};
      data.getStatsByPeriod.subjectStats.forEach((stat: any) => {
        newProgress[stat.subject] = {
          결과: `${Math.round(stat.completionRate)}%`,
          불이행: `${Math.round(stat.incompleteRate)}%`,
          연기: `${Math.round(stat.postponeRate)}%`,
        };
      });
      setProgress(newProgress);
    }
  }, [data]);
  

  const isProgressEmpty = Object.values(progress).every(p =>
    p.결과 === '0%' && p.불이행 === '0%' && p.연기 === '0%'
  );

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

  const navigate = useNavigate();

  const handleLogout = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      console.log("📦 유저 데이터:", JSON.parse(userData));
    } else {
      console.warn("⚠️ localStorage에 'user' 데이터 없음");
    }


    if (!userData) return;

    const { accessToken } = JSON.parse(userData);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 전달
        },
        credentials: "include", // 쿠키 있을 경우 포함
        body: JSON.stringify({
          query: `
            mutation {
              logout
            }
          `,
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

  return (
    <>
      <header className="survey-header">
        <nav>
          <h2>
            <a href="#">
              Edu<br />Compass
            </a>
          </h2>
          <ul>
            <li><Link to="/planStart">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/books">교재 추천</Link></li>
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
            {subjects.map((subject) => (
              <li key={subject}><a href="#" style={{ fontSize: '12px' }}>{subject}</a></li>
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
              {subjects.map((subject) => (
                <div className="subject-card" key={subject}>
                  <h4>{subject}</h4>
                  {(['결과', '불이행', '연기'] as const).map((type) => {
                    const percentStr = progress[subject]?.[type] ?? '0%';
                    const percentValue = parseInt(percentStr.replace('%', ''));

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
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default StatusPage;
