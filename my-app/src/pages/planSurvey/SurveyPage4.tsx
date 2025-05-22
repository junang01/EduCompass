import React, { useState } from "react";
import "../../css/surveyPage4.css";

const SurveyPage4 = () => {
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [plans, setPlans] = useState([{ id: Date.now(), file: null as File | null }]);
  const [reviewDays, setReviewDays] = useState<string[]>([]);
  const [catchupDays, setCatchupDays] = useState<string[]>([]);

  const handleFileChange = (index: number, file: File | null) => {
    const newPlans = [...plans];
    newPlans[index].file = file;
    setPlans(newPlans);
  };

  const addPlan = () => {
    setPlans([...plans, { id: Date.now(), file: null }]);
  };

  const deletePlan = (index: number) => {
    const newPlans = [...plans];
    newPlans.splice(index, 1);
    setPlans(newPlans);
  };

  const toggleDay = (day: string, target: string[]) => {
    return target.includes(day)
      ? target.filter(d => d !== day)
      : [...target, day];
  };

  const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="survey-page4-container">
      <section className="section-box">
        <div className="section-title">학습 스타일 선택</div>
        <div className="radio-group">
          <label>
            <input type="radio" name="style" onChange={() => setLearningStyle("암기형")} />
            암기형
          </label>
          <label>
            <input type="radio" name="style" onChange={() => setLearningStyle("이해형")} />
            이해형
          </label>
        </div>
      </section>

      <section className="section-box">
        <div className="section-title flex-between">
          강의 계획서 추가
          <button type="button" onClick={addPlan}>＋ 강의 계획서 추가</button>
        </div>
        {plans.map((plan, index) => (
          <div className="plan-box" key={plan.id}>
            <label className="plan-thumbnail">
              {plan.file ? plan.file.name : "파일 또는 이미지 추가"}
              <input
                type="file"
                accept="image/*,.pdf"
                hidden
                onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
              />
            </label>
            <button className="delete-button" onClick={() => deletePlan(index)}>삭제</button>
          </div>
        ))}
      </section>

      <section className="section-box">
        <div className="section-title">복습할 요일 선택</div>
        <div className="radio-group">
          {DAYS.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={reviewDays.includes(day)}
                onChange={() => setReviewDays(toggleDay(day, reviewDays))}
              />
              {day}
            </label>
          ))}
        </div>
      </section>

      <section className="section-box">
        <div className="section-title">미시행 계획 수행 요일 선택</div>
        <div className="radio-group">
          {DAYS.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={catchupDays.includes(day)}
                onChange={() => setCatchupDays(toggleDay(day, catchupDays))}
              />
              {day}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SurveyPage4;
