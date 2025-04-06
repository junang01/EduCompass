import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import "../css/joinComplete.css"; // ✅ CSS 연결

const JoinCompletePage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // ✅ React Router로 홈 이동
  };

  const handleLogin = () => {
    navigate("/login"); // ✅ 로그인 페이지 이동
  };

  return (
    <div className="container">
      <div className="com_container">
        {/* 상단 문구 */}
        <h1 className="joinCompleteMessage">Edu Compass 회원가입 완료 !</h1>

        {/* 완료 안내 및 버튼 */}
        <h3 className="joinCompleteSubMess">이제 Edu Compass의 서비스를 이용하실 수 있습니다.</h3>
         <div className="buttonBox">
           <button className="backhomeBtn" onClick={handleGoHome}>홈으로 돌아가기</button>
           <button className="gologinBtn" onClick={handleLogin}>로그인 하러가기</button>
         </div>
      </div>
    </div>
  );
};

export default JoinCompletePage;
