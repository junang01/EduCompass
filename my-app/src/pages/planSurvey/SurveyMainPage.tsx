import React, { useEffect, useState } from "react";
import SurveyPage1 from "./SurveyPage1";
import SurveyPage2 from "./SurveyPage2";
import SurveyPage3 from "./SurveyPage3";
import SurveyPage4 from "./SurveyPage4";
import { Link } from "react-router-dom";
import "../../css/surveyMainPage.css";

const SurveyMainPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState<string>("");

  // 유효성 상태 관리
  const [page1Valid, setPage1Valid] = useState(false);
  const [page2Valid, setPage2Valid] = useState(false);
  const [page3Valid, setPage3Valid] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <SurveyPage1 onValidationChange={setPage1Valid} />;
      case 2:
        return (
          <SurveyPage2
            onValidationChange={setPage2Valid}
            onUpdateBooks={(books) => {
              console.log("books:", books);
              // 추후 상태로 저장 가능
            }}
            onUpdateExams={(exams) => {
              console.log("exams:", exams);
            }}
            onUpdatePeriod={(period) => {
              console.log("period:", period);
            }}
          />
        );
      case 3:
        return <SurveyPage3 onValidationChange={setPage3Valid} />;
      case 4:
        return <SurveyPage4 />;
      default:
        return <SurveyPage1 onValidationChange={setPage1Valid} />;
    }
  };

  const handleNext = () => {
    if (currentPage === 1 && !page1Valid) {
      alert("1페이지는 필수 항목입니다. 내용을 입력해주세요.");
      return;
    }
    if (currentPage === 2 && !page2Valid) {
      alert("2페이지는 필수 항목입니다. 내용을 입력해주세요.");
      return;
    }
    if (currentPage === 3 && !page3Valid) {
      alert("3페이지는 필수 항목입니다. 내용을 입력해주세요.");
      return;
    }
    if (currentPage < 4) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

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
            <li><Link to="/planStart">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
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

      <div className="mainContainer_start">
        <div className="pageWrap">
          <div className="pageWrap_wrap">{renderPage()}</div>
          <div className="nextCancleBtn">
            <button className="planBtn" onClick={handlePrev} disabled={currentPage === 1}>
              이전
            </button>
            <button className="planBtn" onClick={handleNext} disabled={currentPage === 4}>
              다음
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyMainPage;
