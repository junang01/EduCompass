import React, { useEffect, useState } from 'react';
import './status.css';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { gql, useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';

const GET_STATS_BY_PERIOD = gql`
  query GetStatsByPeriod($start: String!, $end: String!, $planId: Int) {
    getStatsByPeriod(start: $start, end: $end, planId: $planId) {
      completionRate
      postponeRate
      incompleteRate
      subjectStats {
        subject
        completionRate
        postponeRate
        incompleteRate
      }
    }
  }
`;

type SubjectStat = {
  subject: string;
  completionRate: number;
  postponeRate: number;
  incompleteRate: number;
};

const StatusPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [planId, setPlanId] = useState<number | undefined>(undefined);
  const [fetchStats, { data, loading, error }] = useLazyQuery(GET_STATS_BY_PERIOD);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 사용자명, planId 불러오기
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

    const planParam = params.get("planId");
    if (planParam) {
      setPlanId(Number(planParam));
    } else {
      const saved = localStorage.getItem("lastPlanId");
      if (saved) setPlanId(Number(saved));
    }
  }, [params]);

  // 조회 버튼
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

    fetchStats({ variables: { start: startDate, end: endDate, planId } });
  };

  // 로그아웃
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
        body: JSON.stringify({ query: `mutation { logout }` }),
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

  // 서버 응답
  const subjectStats: SubjectStat[] = data?.getStatsByPeriod?.subjectStats ?? [];
  const isEmpty = subjectStats.length === 0;

  // 퍼센트 반올림 헬퍼
  const pct = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  return (
    <>
      <header>
        <nav>
          <h2>
            <Link to="/">Edu<br />Compass</Link>
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
            {/* 세부과목을 바로 사이드바에 노출 */}
            {subjectStats.map((s) => (
              <li key={s.subject}>
                <Link to={`/statusDetail/${encodeURIComponent(s.subject)}?planId=${planId}`} style={{ fontSize: '12px' }}>
                  {s.subject}
                </Link>
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
          ) : isEmpty ? (
            <div className="no-plan-message">해당 기간에 학습 현황이 없습니다.</div>
          ) : (
            <div className="subject-cards">
              {subjectStats.map((s) => {
                const completion = pct(s.completionRate);
                const postpone = pct(s.postponeRate);
                const incomplete = pct(s.incompleteRate);
                return (
                  <div className="subject-card" key={s.subject}>
                    <h4>{s.subject}</h4>

                    {[
                      { label: '계획 이행률', value: completion, cls: '' },
                      { label: '계획 불이행률', value: incomplete, cls: 'fail' },
                      { label: '계획 연기률', value: postpone, cls: 'delay' },
                    ].map((row) => (
                      <div className="progress-bar" key={row.label}>
                        <span>{row.label}</span>
                        <div className="bar-line-wrapper">
                          <div className="bar-background">
                            <div className={`bar-fill ${row.cls}`} style={{ width: `${row.value}%` }}></div>
                          </div>
                          <span className="percent-text">{row.value}%</span>
                        </div>
                      </div>
                    ))}

                    <button
                      className="detail-btn"
                      onClick={() =>
                        navigate(
                          `/statusDetail/${encodeURIComponent(s.subject)}?start=${startDate}&end=${endDate}&planId=${planId}`
                        )
                      }
                    >
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
