import React, { useEffect, useState } from "react";
import '../css/booksurvey2style.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { request, gql } from 'graphql-request';  // graphql-request 설치 필요

const BookSurvey2: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  // SurveyPage1에서 넘겨받은 값
  const { selectedSubject, selectedDetail } = location.state || {};

  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [studyTime, setStudyTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedPurpose || !selectedLevel || !selectedStyle || !selectedDifficulty || !studyTime) {
      alert("모든 항목을 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = 'http://localhost:3000/graphql';  // ← 실제 서버 주소로 변경!
      const mutation = gql`
        mutation CreateSurvey($createBookSurveyDto: CreateBookSurveyDto!) {
          createBookSurvey(createBookSurveyDto: $createBookSurveyDto) {
            id
            answers
            createdAt
          }
        }
      `;

      const variables = {
        createBookSurveyDto: {
          answers: {
            subject: selectedSubject,
            detail: selectedDetail,
            purpose: selectedPurpose,
            level: selectedLevel,
            style: selectedStyle,
            difficulty: selectedDifficulty,
            time: studyTime
          }
        }
      };

      await request(endpoint, mutation, variables);
      navigate('/surveyResult');
    } catch (error) {
      console.error('설문 저장 실패:', error);
      alert("설문 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
          {/* 2 질문 */}
          <div className="form-group required">
            <label>2. 이 과목을 학습하는 주된 목적은 무엇인가요?</label>
            <select onChange={(e) => setSelectedPurpose(e.target.value)}>
              <option value="">선택</option>
              <option value="내신">내신 준비</option>
              <option value="수능">수능 준비</option>
              <option value="기초">기초 개념 이해</option>
              <option value="심화">심화 문제 풀이</option>
              <option value="자격증">자격증 대비</option>
              <option value="보완">진도 보완</option>
            </select>
          </div>

          {/* 3 질문 */}
          <div className="form-group required">
            <label>3. 하루 평균 이 과목에 투자할 수 있는 시간은?</label>
            <select onChange={(e) => setStudyTime(e.target.value)}>
              <option value="">선택</option>
              <option value="30분 이하">30분 이하</option>
              <option value="1시간 내외">1시간 내외</option>
              <option value="2시간 이상">2시간 이상</option>
            </select>
          </div>

          {/* 4 질문 */}
          <div className="form-group required">
            <label>4. 본인의 해당 과목 실력을 어떻게 평가하시나요?</label>
            <select onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="">선택</option>
              <option value="상">상 (자신 있음)</option>
              <option value="중">중 (보통)</option>
              <option value="하">하 (기초 부족)</option>
            </select>
          </div>


          {/* 5 질문 */}
          <div className="form-group required">
            <label>5. 어떤 스타일의 교재를 선호하나요?</label>
            <select onChange={(e) => setSelectedStyle(e.target.value)}>
              <option value="">선택</option>
              <option value="개념">개념 위주 설명형</option>
              <option value="문제">문제 중심 훈련형</option>
              <option value="얇고핵심">얇고 핵심 요약형</option>
              <option value="혼합">이론 + 문제 혼합형</option>
            </select>
          </div>

           {/* 6번 질문 */}
           <div className="form-group required">
            <label>6. 문제 난이도 선호도는?</label>
            <select onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="">선택</option>
              <option value="쉬움">쉬운 문제 위주</option>
              <option value="중간">중간 난이도</option>
              <option value="어려움">고난도 문제 포함</option>
            </select>
          </div>

          <div className="form-footer">
            <button type="button" onClick={() => navigate('/survey')}>
              이전
            </button>
            <button
  type="button"
  onClick={handleSubmit}
  disabled={
    !selectedPurpose || 
    !selectedLevel || 
    !selectedStyle || 
    !selectedDifficulty || 
    !studyTime
  }
>
  제출
</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default BookSurvey2;
