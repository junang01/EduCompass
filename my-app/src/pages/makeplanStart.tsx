import React, { useEffect, useState } from "react";
import "../css/makeplanStartstyle.css";
import { Link, useNavigate } from "react-router-dom";

const MakeplanStartPage = () => {

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
              <Link to="/mypage">{username ? `${username}님` : "로그인"}</Link>
            </div>
            <div className="join">
              <button className="logout-btn" onClick={handleLogout}>logout</button>
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
