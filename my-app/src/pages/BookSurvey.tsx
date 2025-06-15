import React, { useEffect, useState } from "react";
import '../css/booksurveystyle.css';
import { Link, useNavigate } from "react-router-dom";

const BookSurvey: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  
    useEffect(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.name);
      }
    }, []);

  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDetail, setSelectedDetail] = useState('');


  const isActive = (subject: string) => {
    return selectedSubject === subject || selectedSubject === '';
  };

  return (
    <>
      <header className="survey-header">
        <nav>
          <h2>
            <a href="#">
              Edu<br />Compass
            </a>
          </h2>
          <ul>
            <li><Link to="/planStart">계획 캘린더</Link></li>
            <li><Link to="/makeplanStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/books" className="active">교재 추천</Link></li>
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

      <main className="survey-page">
        <form className="survey-form">
          {/* 1번 질문 */}
          <div className="form-group required">
            <label>1. 추천받고 싶은 과목을 선택해 주세요.</label>
            <select onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">선택</option>
              <option value="국어">국어</option>
              <option value="수학">수학</option>
              <option value="사회">사회</option>
              <option value="과학">과학</option>
              <option value="영어">영어</option>
              <option value="외국어">외국어</option>
            </select>
          </div>

          {/* 국어 */}
          <div className="form-group" style={{ opacity: isActive('국어') ? 1 : 0.4, pointerEvents: isActive('국어') ? 'auto' : 'none' }}>
            <label>1-1. 국어의 선택 과목을 답변해 주세요.</label>
            <p className="sub-label">*1번 항목에서 국어를 선택하신 분만 응답 바랍니다.</p>
            <select onChange={(e) => setSelectedDetail(e.target.value)}>
              <option value="">선택</option>
              <option value="화법과작문">화법과 작문</option>
              <option value="언어와매체">언어와 매체</option>
            </select>
          </div>

          {/* 수학 */}
          <div className="form-group" style={{ 
            opacity: isActive('수학') ? 1 : 0.4, 
            pointerEvents: isActive('수학') ? 'auto' : 'none' }}>
            <label>1-2. 수학의 선택 과목을 답변해 주세요.</label>
            <p className="sub-label">*1번 항목에서 수학을 선택하신 분만 응답 바랍니다.</p>
            <select onChange={(e) => setSelectedDetail(e.target.value)}>
              <option value="">선택</option>
              <option value="확률과통계">확률과 통계</option>
              <option value="미적분">미적분</option>
              <option value="기하">기하</option>
            </select>
          </div>

          {/* 사회 */}
          <div className="form-group" style={{ opacity: isActive('사회') ? 1 : 0.4, pointerEvents: isActive('사회') ? 'auto' : 'none' }}>
            <label>1-3. 사회의 선택 과목을 답변해 주세요.</label>
            <p className="sub-label">*1번 항목에서 사회를 선택하신 분만 응답 바랍니다.</p>
            <select onChange={(e) => setSelectedDetail(e.target.value)}>
              <option value="">선택</option>
              <option value="사회탐구">사회 탐구</option>
              <option value="생활과윤리">생활과 윤리</option>
              <option value="윤리와사상">윤리와 사상</option>
              <option value="한국지리">한국 지리</option>
              <option value="세계지리">세계 지리</option>
              <option value="동아시아사">동아시아사</option>
              <option value="세계사">세계사</option>
              <option value="경제">경제</option>
              <option value="정치와법">정치와 법</option>
              <option value="사회·문화">사회·문화</option>
            </select>
          </div>

          {/* 과학 */}
          <div className="form-group" style={{ opacity: isActive('과학') ? 1 : 0.4, pointerEvents: isActive('과학') ? 'auto' : 'none' }}>
            <label>1-4. 과학의 선택 과목을 답변해 주세요.</label>
            <p className="sub-label">*1번 항목에서 과학을 선택하신 분만 응답 바랍니다.</p>
            <select onChange={(e) => setSelectedDetail(e.target.value)}>
              <option value="">선택</option>
              <option value="물리학I">물리학 I</option>
              <option value="화학I">화학 I</option>
              <option value="생명과학I">생명과학 I</option>
              <option value="지구과학I">지구과학 I</option>
            </select>
          </div>

          {/* 영어 */}
          <div className="form-group" style={{ opacity: isActive('영어') ? 1 : 0.4, pointerEvents: isActive('영어') ? 'auto' : 'none' }}>
            <label>1-5. 영어의 선택 과목을 답변해 주세요.</label>
            <p className="sub-label">*1번 항목에서 영어를 선택하신 분만 응답 바랍니다.</p>
            <select onChange={(e) => setSelectedDetail(e.target.value)}>
              <option value="">선택</option>
              <option value="영어">영어</option>
            </select>
          </div>

          {/* 외국어 */}
          <div className="form-group" style={{ opacity: isActive('외국어') ? 1 : 0.4, pointerEvents: isActive('외국어') ? 'auto' : 'none' }}>
            <label>1-6. 외국어의 선택 과목을 답변해 주세요.</label>
            <p className="sub-label">*1번 항목에서 외국어를 선택하신 분만 응답 바랍니다.</p>
            <select onChange={(e) => setSelectedDetail(e.target.value)}>
              <option value="">선택</option>
              <option value="한문">한문</option>
              <option value="중국어">중국어</option>
              <option value="일본어">일본어</option>
              <option value="프랑스어">프랑스어</option>
              <option value="독일어">독일어</option>
              <option value="스페인어">스페인어</option>
              <option value="러시아어">러시아어</option>
              <option value="베트남어">베트남어</option>
              <option value="아랍어">아랍어</option>
            </select>
          </div>

          {/* 하단 이동 버튼 */}
          <div className="form-footer">
            <span>1/2</span>
            <button type="button" onClick={() => navigate('/survey2')}>
              다음
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default BookSurvey;
