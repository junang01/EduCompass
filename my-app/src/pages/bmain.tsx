import React, { useEffect, useState } from "react";
import "../css/logmainstyle.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightToBracket,
  faCalendarPlus,
  faCalendar,
  faPenFancy,
  faChartPie,
  faBookOpen,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";

const BmainPage = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <>
      {/* 회원 가입 후 메인 화면 */}
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

      <div className="main_container">
        <div className="main_container_wrap">
          <div className="main_container_center">
            <div
              className="main_log_banner"
              onClick={() => (window.location.href = "bmain.tsx")}
              style={{ cursor: "pointer" }}
            >
              <img src="../img/compass.png" alt="" />
              <h1>
                학습 나침반<br />Edu Compass
              </h1>
              <p>
                학습 나침반 'Edu Compass'는 초·중·고 학생들을 위한
                <br />학습 플래너 사이트입니다.
                <br />'Edu Compass'를 통하여 학생들은 자신의 학습 시간에 맞는
                <br />최적의 학습 계획을 수행할 수 있으며 학습 관리 또한 가능합니다.
                <br />'Edu Compass'를 통해 학습 방향을 결정하고
                <br />자신의 꿈을 널리 펼쳐보세요 !
              </p>
            </div>

            <div className="grid_log_maincontainer">
              <div
                className="grid_log_editplan"
                onClick={() => (window.location.href = "bmain.tsx")}
                style={{ cursor: "pointer" }}
              >
                <h3>학습 계획 조정하러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faPenFancy} size="2x" />
              </div>

              <div
                className="grid_log_progress"
                onClick={() => (window.location.href = "bmain.tsx")}
                style={{ cursor: "pointer" }}
              >
                <h3>학습 현황 확인하러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faChartPie} size="2x" />
              </div>

              <div
                className="grid_log_makeplan"
                onClick={() => navigate("/planStart")}
                style={{ cursor: "pointer" }}
              >
                <h4>
                  AI를 통한 최적화 학습 플랜
                  <br />세우러 가기
                </h4>
                <p>
                  아직 계획이 생성되지 않았다면
                  <br />몇가지의 입력을 통해
                  <br />나에게 맞는 학습 플랜을
                  <br />세워보세요 !
                </p>
                <FontAwesomeIcon className="icon" icon={faCalendarPlus} size="2x" />
                <div 
                  className="makeplan_overlay"
                  onClick={() => (window.location.href = "makeplan.tsx")}
                >
                  <h2>계획 생성 바로가기</h2>
                </div>
              </div>

              <div
                className="grid_log_calendar"
                onClick={() => (window.location.href = "bmain.tsx")}
                style={{ cursor: "pointer" }}
              >
                <h4>나의 캘린더 보러가기</h4>
                <p>
                  생성된 계획을 한눈에 확인할 수 있는
                  <br />캘린더입니다. <br />나의 학습 계획을 확인하고 계획을 수행 후
                  <br />이행률을 채워나가세요 !
                </p>
                <FontAwesomeIcon className="icon" icon={faCalendar} size="2x" />
                <div className="calendar_overlay">
                  <h2>캘린더 바로가기</h2>
                </div>
              </div>

              <div
                className="grid_log_textbook"
                onClick={() => (window.location.href = "bmain.tsx")}
                style={{ cursor: "pointer" }}
              >
                <h3>교재 추천 받으러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faBookOpen} size="2x" />
              </div>

              <div
                className="grid_log_mypage"
                onClick={() => (window.location.href = "bmain.tsx")}
                style={{ cursor: "pointer" }}
              >
                <h3>내 정보 확인하러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faUserGear} size="2x" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BmainPage;
