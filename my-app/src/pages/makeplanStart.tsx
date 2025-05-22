import React, { useEffect, useState } from "react";
import "../css/makeplanStartstyle.css";
import { Link, useNavigate } from "react-router-dom";

const MakeplanStartPage = () => {

  const [username, setUsername] = useState<string>("");
  
    useEffect(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.name);
      }
    }, []);

  return (
    <>
      {/* 상단 네비게이션 */}
      <header>
        <nav>
          <h2>
            <Link to = "/main">
              Edu
              <br />
              Compass
            </Link>
          </h2>
          <ul>
            <li><Link to="/planStart">계획 캘린더</Link></li>
            <li><Link to="/makeplanStart">AI 계획 생성</Link></li>
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

      {/* 본문 영역 */}
      <div className="planstart_container">
        <div className="planstart_center">
          <div className="container_left">
            <img src="../img/compass.png" alt="compass" />
          </div>

          <div className="container_right">
            <div className="make_explain_box">
              <h2>계획 생성</h2>
              <ul>
                <li>생성은 약 5분~10분 정도 소요됩니다.</li>
                <li>검사는 여러 번 진행할 수 있습니다.</li>
                <li>
                  정확한 정보 입력을 위해 시간적 여유를 가지고 한 번에
                  검사를<br />
                  진행해주시길 바랍니다.
                </li>
              </ul>
            </div>

            <div className="makeBtn_box">
              <button className="makeStartBtn"><Link to="/planPage">계획 생성 시작</Link></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeplanStartPage;
