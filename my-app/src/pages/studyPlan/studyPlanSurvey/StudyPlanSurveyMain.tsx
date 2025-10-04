import React, { useEffect, useState } from "react";
import StudyPlanSurvey1Page from "./StudyPlanSurvey1";
import StudyPlanSurvey2Page from "./StudyPlanSurvey2";
import type { StudyTime } from "./StudyPlanSurvey1";
import { Link, useNavigate } from "react-router-dom";
import "./studyPlanSurveyMain.css";

const StudyPlanSurveyMainPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<StudyTime[]>([]);

  // 유효성
  const [page1Valid, setPage1Valid] = useState(false);
  const [page2Valid, setPage2Valid] = useState(false);

  // 제출 함수
  const [submitFn, setSubmitFn] = useState<() => Promise<void>>(() => async () => {});

  // 🔹 제출 로딩 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log("🧾 parsed.user.name 확인:", parsed.user?.name);
        setUsername(parsed.user?.name || "");
      } catch (error) {
        console.error("❌ localStorage 파싱 실패:", error);
      }
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <StudyPlanSurvey1Page
            onValidationChange={setPage1Valid}
            onUpdateAvailableTimes={setAvailableTimes}
          />
        );
      case 2:
        return (
          <StudyPlanSurvey2Page
            onValidationChange={setPage2Valid}
            onUpdateBooks={(books) => console.log("📚 books:", books)}
            onUpdateExams={(exams) => console.log("📝 exams:", exams)}
            onUpdatePeriod={(period) => console.log("📅 period:", period)}
            availableTimes={availableTimes}
            onSubmitRequest={(fn) => setSubmitFn(() => fn)}
          />
        );
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (isSubmitting) return; // 🔒 중복 클릭 방지

    if (currentPage === 1 && !page1Valid) {
      alert("1페이지는 필수 항목입니다. 내용을 입력해주세요.");
      return;
    }
    if (currentPage === 2 && !page2Valid) {
      alert("2페이지는 필수 항목입니다. 내용을 입력해주세요.");
      return;
    }

    if (currentPage === 2) {
      try {
        setIsSubmitting(true);                // 🔵 로딩 시작
        console.log("[DEBUG] StudyPlan 제출 시도");
        await submitFn();
        console.log("[DEBUG] StudyPlan 제출 성공");
        setCurrentPage((prev) => Math.min(prev + 1, 4)); // 성공 시 다음 페이지
      } catch (err) {
        console.error("[DEBUG] StudyPlan 제출 실패:", err);
        alert("2페이지 계획 생성에 실패했습니다.");
      } finally {
        setIsSubmitting(false);               // 🟢 로딩 종료
      }
      return; // 여기서 종료(아래 공통 이동 로직 실행 안 함)
    }

    if (currentPage < 4) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isSubmitting) return; // 로딩 중엔 이동 금지
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
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
      <header>
        <nav>
          <h2>
            <Link to="/main">
              Edu<br />
              Compass
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
              <button className="logout-btn" onClick={handleLogout}>logout</button>
            </div>
          </div>
        </nav>
      </header>

      <div className="mainContainer_start">
        <div className="pageWrap">
          <div className="pageWrap_wrap">{renderPage()}</div>
          <div className="nextCancleBtn">
            <button
              className="planBtn"
              onClick={handlePrev}
              disabled={currentPage === 1 || isSubmitting}
            >
              이전
            </button>

            {currentPage === 2 ? (
              <button
                className="planBtn"
                onClick={handleNext}
                disabled={isSubmitting || !page2Valid}
              >
                {isSubmitting ? "생성중..." : "제출"}
              </button>
            ) : (
              <button
                className="planBtn"
                onClick={handleNext}
                disabled={isSubmitting || (currentPage === 1 && !page1Valid)}
              >
                다음
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyPlanSurveyMainPage;
