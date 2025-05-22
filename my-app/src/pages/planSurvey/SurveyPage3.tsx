// SurveyPage3.tsx
import React, { useState, useEffect } from "react";
import "../../css/surveyPage3.css";

const SUBJECTS = [
  "국어 선택",
  "수학 선택",
  "영어",
  "한국사",
  "탐구과목1 선택",
  "탐구과목2 선택",
  "제2 외국어 선택"
];

const SUBJECT_OPTIONS: Record<string, any> = {
  "국어 선택": ["화법과 작문", "언어와 매체"],
  "수학 선택": ["확률과 통계", "미적분", "기하"],
  "제2 외국어 선택": [
    "독일어", "프랑스어", "스페인어",
    "중국어", "일본어", "러시아어",
    "아랍어", "한문"
  ],
  "탐구과목1 선택": {
    "사회탐구": [
      "생활과 윤리", "윤리와 사상", "한국지리",
      "세계지리", "동아시아사", "세계사",
      "정치와 법", "경제", "사회·문화"
    ],
    "과학탐구": [
      "물리학 I", "물리학 Ⅱ", "화학 I", "화학 Ⅱ", "생명과학 I", "생명과학 Ⅱ", "지구과학 I", "지구과학 Ⅱ"
    ]
  },
  "탐구과목2 선택": {
    "사회탐구": [
      "생활과 윤리", "윤리와 사상", "한국지리",
      "세계지리", "동아시아사", "세계사",
      "정치와 법", "경제", "사회·문화"
    ],
    "과학탐구": [
      "물리학 I", "물리학 Ⅱ", "화학 I", "화학 Ⅱ", "생명과학 I", "생명과학 Ⅱ", "지구과학 I", "지구과학 Ⅱ"
    ]
  }
};

interface SurveyPage3Props {
  onValidationChange: (isValid: boolean) => void;
}

const SurveyPage3: React.FC<SurveyPage3Props> = ({ onValidationChange }) => {
  const [grades, setGrades] = useState([{ subject: "", score: "" }]);
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, string>>({});
  const [visibleSubjectBox, setVisibleSubjectBox] = useState<string | null>(null);
  const [mockScores, setMockScores] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [mainCategory, setMainCategory] = useState<string | null>(null);

  const addGradeInput = () => {
    setGrades([...grades, { subject: "", score: "" }]);
  };

  const handleGradeChange = (index: number, field: string, value: string) => {
    const updated = [...grades];
    updated[index][field as "subject" | "score"] = value;
    setGrades(updated);
  };

  const toggleSubjectBox = (subjectLabel: string) => {
    setVisibleSubjectBox(prev => (prev === subjectLabel ? null : subjectLabel));
    setStep(1);
    setMainCategory(null);
  };

  const handleMockScoreChange = (subject: string, value: string) => {
    setMockScores(prev => ({ ...prev, [subject]: value }));
  };

  const selectSubject = (subjectLabel: string, selected: string) => {
    setSelectedSubjects(prev => ({ ...prev, [subjectLabel]: selected }));
    setVisibleSubjectBox(null);
    setStep(1);
    setMainCategory(null);
  };

  useEffect(() => {
    const isValid = grades.some(g => g.subject.trim() && g.score.trim()) || Object.values(mockScores).some(score => score.trim());
    onValidationChange(isValid);
  }, [grades, mockScores, onValidationChange]);

  return (
    <div className="survey-page3-container">
      <section className="section-box">
        <div className="section-title">학업 수준 선택</div>
        <div className="level-options">
          <label><input type="radio" name="level" /> 상</label>
          <label><input type="radio" name="level" /> 중</label>
          <label><input type="radio" name="level" /> 하</label>
        </div>
      </section>

      <section className="section-box">
        <div className="section-title">직전학기 성적 입력 <button onClick={addGradeInput}>＋ 성적 추가</button></div>
        <div className="grade-list">
          {grades.map((grade, index) => (
            <div className="grade-row" key={index}>
              <input type="text" placeholder="과목 이름" value={grade.subject} onChange={e => handleGradeChange(index, "subject", e.target.value)} />
              <input type="text" placeholder="성적 입력" value={grade.score} onChange={e => handleGradeChange(index, "score", e.target.value)} />
              <button className="delete-button" onClick={() => {
                const updated = [...grades];
                updated.splice(index, 1);
                setGrades(updated);
              }}>삭제</button>
            </div>
          ))}
        </div>
      </section>

      <section className="section-box">
        <div className="section-title">모의고사 성적 입력</div>
        <div className="mock-box">
          <div className="mock-buttons">
            {SUBJECTS.map((subject, idx) => (
              <div className="mock-score-row" key={idx}>
                <button
                  className="mock-subject-button"
                  onClick={() => {
                    if (subject === "영어" || subject === "한국사") return;
                    toggleSubjectBox(subject);
                  }}
                  disabled={subject === "영어" || subject === "한국사"}
                  style={subject === "영어" || subject === "한국사" ? {
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid #000",
                  } : undefined}
                >
                  {selectedSubjects[subject] || subject}
                </button>
                <input
                  type="text"
                  className="mock-score-input"
                  placeholder="성적 입력"
                  value={mockScores[subject] || ""}
                  onChange={(e) => handleMockScoreChange(subject, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="mock-popup-wrapper">
            {visibleSubjectBox ? (
              <div className="mock-popup">
                <div className="popup-title">과목을 선택하세요.</div>
                <div className="popup-content">
                  <div className="popup-mintitle">{visibleSubjectBox.replace(" 선택", "")}</div>
                  <div className="popup-button">
                    {(() => {
                      const options = SUBJECT_OPTIONS[visibleSubjectBox];
                      if (Array.isArray(options)) {
                        return options.map((option: string, i: number) => (
                          <button key={i} onClick={() => selectSubject(visibleSubjectBox, option)}>{option}</button>
                        ));
                      } else if (step === 1 && options) {
                        return Object.keys(options).map((category: string, i: number) => (
                          <button key={i} onClick={() => {
                            setMainCategory(category);
                            setStep(2);
                          }}>{category}</button>
                        ));
                      } else if (step === 2 && options && mainCategory) {
                        return options[mainCategory].map((option: string, i: number) => (
                          <button key={i} onClick={() => selectSubject(visibleSubjectBox, option)}>{option}</button>
                        ));
                      }
                      return null;
                    })()}
                  </div>
                  <div className="popup-message">1개 과목을 선택해주세요.</div>
                </div>
              </div>
            ) : (
              <div className="mock-popup-placeholder" />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SurveyPage3;
