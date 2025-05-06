import React from "react";

const MakeplanStartPage = () => {
  return (
    <>
      {/* 상단 네비게이션 */}
      <header>
        <nav>
          <h2>
            <a href="bmain.tsx">
              Edu
              <br />
              Compass
            </a>
          </h2>
          <ul>
            <li><a href="#">계획 캘린더</a></li>
            <li><a href="#">AI 계획 생성</a></li>
            <li><a href="#">학습 현황</a></li>
            <li><a href="#">교재 추천</a></li>
            <li><a href="#">마이페이지</a></li>
          </ul>
          <div className="info">
            <div className="info">
              <a href="#.tsx">OOO님</a>
            </div>
            <div className="logout">
              <a href="amain.tsx">logout</a>
            </div>
          </div>
        </nav>
      </header>

      {/* 본문 영역 */}
      <div className="main_container">
        <div className="main_container_center">
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
              <button>계획 생성 시작</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeplanStartPage;
