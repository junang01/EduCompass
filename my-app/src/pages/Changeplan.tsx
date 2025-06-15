import React, { useEffect, useState } from "react";
import '../css/changeplanstyle.css';
import { Link, useNavigate } from 'react-router-dom';

const ChangeplanPage: React.FC = () => {
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
      <header>
        <nav>
          <h2><a href="#">Edu<br />Compass</a></h2>
          <ul>
            <li><Link to="/planStart" className="active">계획 캘린더</Link></li>
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
      
      <div className="sidebar">
        <div className="sidebar-title">계획 캘린더</div>
        <ul className="sidebar-menu">
          <li><Link to="/makeplanStart">캘린더 조회</Link></li>
          <li className="active"><Link to="#">계획 조정</Link></li>
          <li><Link to="/makeplanStart">조정 내용 요약</Link></li>
          <hr />
        </ul>
      </div>

      <div className="main_container">
        <div className="main_container_center">
          <div className="container_left">
            <img src="/img/compass.png" alt="compass" />
          </div>

          <div className="container_right">
            <div className="make_explain_box">
              <h2>계획 조정</h2>
              <ul>
                <li>• 생성은 약 5분~10분 정도 소요됩니다.</li>
                <li>• 검사는 여러 번 진행할 수 있습니다.</li>
                <li>• 정확한 정보 입력을 위해 시간적 여유를 가지고 한 번에 검사를 진행해주시길 바랍니다.</li>
              </ul>
            </div>
            <div className="makeBtn_box">
              <button onClick={() => navigate('/survey')}>
                계획 조정 시작
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeplanPage;
