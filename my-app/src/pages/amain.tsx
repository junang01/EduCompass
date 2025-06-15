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
import React, { useEffect, useState } from "react";
import "../css/mainstyle.css";
import { Link, useNavigate } from "react-router-dom";

const AmainPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData);
  }, []);

  const handleAuthRequired = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      const confirmed = window.confirm("로그인 후 사용 가능한 기능입니다. 로그인하시겠습니까?");
      if (confirmed) {
        navigate("/login");
      }
    }
  };
  
  return (
    <div>
      <header>
        <nav>
          <h2>
            <Link to="/">
              Edu<br />Compass
            </Link>
          </h2>
          <ul>
            <li style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/calendar")}>계획 캘린더</li>
            <li style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/planStart")}>AI 계획 생성</li>
            <li style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/status")}>학습 현황</li>
            <li style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/books")}>교재 추천</li>
            <li style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/mypage")}>마이페이지</li>
          </ul>
          <div className="log">
            <div className="login">
              <Link to="/login">login</Link>
            </div>
            <div className="join">
              <Link to="/join">join</Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="main_container">
        <div className="main_container_wrap">
          <div className="main_container_center">

            <Link to="/" className="main_banner" style={{ cursor: "pointer" }}>
              <img src="/img/compass.png" alt="compass" />
              <h1>
                학습 나침반<br />Edu Compass
              </h1>
              <p>
                학습 나침반 'Edu Compass'는 초·중·고 학생들을 위한<br />
                학습 플래너 사이트입니다.<br />
                'Edu Compass'를 통하여 학생들은 자신의 학습 시간에 맞는<br />
                최적의 학습 계획을 수행할 수 있으며 학습 관리 또한 가능합니다.<br />
                'Edu Compass'를 통해 학습 방향을 결정하고<br />
                자신의 꿈을 널리 펼쳐보세요 !
              </p>
            </Link>

            <div className="grid_maincontainer">
              <Link to="/join" className="grid_join" style={{ cursor: "pointer" }}>
                <h4>
                  학습 관리를 위한 'Edu Compass'<br />시작하러 가기
                </h4>
                <FontAwesomeIcon className="icon" icon={faUser} size="2x" />
                <div className="join_overlay"><h2>회원가입 바로가기</h2></div>
              </Link>

              <Link to="/login" className="grid_login" style={{ cursor: "pointer" }}>
                <h4>
                  이미 회원이신가요?<br />'Edu Compass' 로그인하러 가기
                </h4>
                <FontAwesomeIcon className="icon" icon={faRightToBracket} size="2x" />
                <div className="login_overlay"><h2>로그인 바로가기</h2></div>
              </Link>

              <div className="grid_makeplan" style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/makeplan")}>
                <h4>
                  AI를 통한 최적화 학습 플랜<br />세우러 가기
                </h4>
                <p>
                  아직 계획이 생성되지 않았다면<br />
                  몇가지의 입력을 통해<br />
                  나에게 맞는 학습 플랜을<br />
                  세워보세요 !
                </p>
                <FontAwesomeIcon className="icon" icon={faCalendarPlus} size="2x" />
                <div className="makeplan_overlay"><h2>계획 생성 바로가기</h2></div>
              </div>

              <div className="grid_calendar" style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/calendar")}>
                <h4>나의 캘린더 보러가기</h4>
                <p>
                  생성된 계획을 한눈에 확인할 수 있는<br />
                  캘린더입니다. <br />
                  나의 학습 계획을 확인하고 계획을 수행 후<br />
                  이행률을 채워나가세요 !
                </p>
                <FontAwesomeIcon className="icon" icon={faCalendar} size="2x" />
                <div className="calendar_overlay"><h2>캘린더 바로가기</h2></div>
              </div>
            </div>

            <div className="grid_subcontainer">
              <div className="grid_editplan" style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/editplan")}>
                <h3>학습 계획 조정하러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faPenFancy} size="2x" />
              </div>

              <div className="grid_progress" style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/status")}>
                <h3>학습 현황 확인하러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faChartPie} size="2x" />
              </div>

              <div className="grid_textbook" style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/books")}>
                <h3>교재 추천 받으러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faBookOpen} size="2x" />
              </div>

              <div className="grid_mypage" style={{ cursor: "pointer" }} onClick={() => handleAuthRequired("/mypage")}>
                <h3>내 정보 확인하러 가기</h3>
                <FontAwesomeIcon className="icon" icon={faUserGear} size="2x" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AmainPage;
