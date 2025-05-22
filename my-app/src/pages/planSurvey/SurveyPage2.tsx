import React, { useState, useEffect } from "react";
import "../../css/surveyPage2.css";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface ExamInput {
  title: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface BookInput {
  title: string;
  description: string;
  file: File | null;
}

interface SurveyPage2Props {
  onValidationChange: (isValid: boolean) => void;
  onUpdateBooks: (books: BookInput[]) => void;
  onUpdateExams: (exams: ExamInput[]) => void;
  onUpdatePeriod: (period: string) => void;
}

const SurveyPage2: React.FC<SurveyPage2Props> = ({
  onValidationChange,
  onUpdateBooks,
  onUpdateExams,
  onUpdatePeriod,
}) => {
  const [planTitle, setPlanTitle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>("");
  const [studyStartDate, setStudyStartDate] = useState<Dayjs | null>(null);
  const [studyEndDate, setStudyEndDate] = useState<Dayjs | null>(null);
  const [exams, setExams] = useState<ExamInput[]>([
    { title: "", startDate: null, endDate: null },
  ]);
  const [books, setBooks] = useState<BookInput[]>([
    { title: "", description: "", file: null },
  ]);

  const subSubjects: { [key: string]: string[] } = {
    국어: ["해당 없음", "화법과 작문", "언어와 매체"],
    수학: ["해당 없음", "확률과 통계", "미적분", "기하"],
    제2외국어: ["해당 없음", "독일어", "프랑스어", "스페인어", "중국어", "일본어", "러시아어", "아랍어", "한문"],
    사회탐구: [
      "해당 없음", "생활과 윤리", "윤리와 사상", "한국지리",
      "세계지리", "동아시아사", "세계사",
      "정치와 법", "경제", "사회·문화"
    ],
    과학탐구: [
      "해당 없음", "물리학 I", "물리학 Ⅱ", "화학 I", "화학 Ⅱ",
      "생명과학 I", "생명과학 Ⅱ", "지구과학 I", "지구과학 Ⅱ"
    ]
  };

  useEffect(() => {
    const hasExamDates = exams.some(
      (exam) => exam.startDate !== null && exam.endDate !== null
    );
    const hasPlanTitle = planTitle.trim() !== "";
    const isValid = hasExamDates && hasPlanTitle;
    onValidationChange(isValid);
    onUpdateBooks(books);
    onUpdateExams(exams);

    if (studyStartDate && studyEndDate) {
      const formatted = `${studyStartDate.format("YYYY-MM-DD")} to ${studyEndDate.format("YYYY-MM-DD")}`;
      onUpdatePeriod(formatted);
    }
  }, [planTitle, exams, books, studyStartDate, studyEndDate]);

  const addExam = () => {
    setExams([...exams, { title: "", startDate: null, endDate: null }]);
  };

  const removeExam = (index: number) => {
    const newExams = [...exams];
    newExams.splice(index, 1);
    setExams(newExams);
  };

  const addBook = () => {
    setBooks([...books, { title: "", description: "", file: null }]);
  };

  const removeBook = (index: number) => {
    const newBooks = [...books];
    newBooks.splice(index, 1);
    setBooks(newBooks);
  };

  const handleBookFileChange = (index: number, file: File | null) => {
    const updated = [...books];
    updated[index].file = file;
    setBooks(updated);
  };

  return (
    <div className="survey-page2-container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <section className="section-box">
          <div className="plan-title-box">
            <label htmlFor="plan-title" className="plan-title-label">
              계획 이름
            </label>
            <input
              id="plan-title"
              type="text"
              className="plan-title-input"
              placeholder="예: 중간고사 대비 계획"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
            />
          </div>
        </section>

        <section className="section-box">
          <div className="subject-row">
            <div className="subject-select-box">
              <label htmlFor="subject-select" className="subject-select-label">과목 선택</label>
              <select
                id="subject-select"
                value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedSubSubject("");
                  }}
                className="subject-select"
              >
                <option value="">-- 선택 --</option>
                <option value="국어">국어</option>
                <option value="수학">수학</option>
                <option value="영어">영어</option>
                <option value="과학">과학</option>
                <option value="사회">사회</option>
                <option value="제2외국어">제2외국어</option>
                <option value="사회탐구">사회탐구</option>
                <option value="과학탐구">과학탐구</option>
              </select>
              {subSubjects[selectedSubject] && (
                <select
                  id="sub-subject"
                  value={selectedSubSubject}
                  onChange={(e) => setSelectedSubSubject(e.target.value)}
                  className="sub-subject-select"
                >
                  <option value="">-- 선택 --</option>
                  {subSubjects[selectedSubject].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </section>

        <section className="section-box">
          <div className="section-title">
            계획 기간 입력
            <button onClick={addExam}>+ 시험 추가</button>
          </div>
          <div className="semester-period">
            <div className="semester-label">학습 진행 기간</div>
            <div className="semester-options">
              <DateTimePicker
                label="시작일"
                value={studyStartDate}
                onChange={(newValue) => {
                  if (
                    newValue &&
                    studyEndDate &&
                    dayjs(newValue).isAfter(studyEndDate)
                  ) {
                    alert("시작일은 종료일보다 앞서야 합니다.");
                    return;
                  }
                  setStudyStartDate(newValue);
                }}
              />
              <span>~</span>
              <DateTimePicker
                label="종료일"
                value={studyEndDate}
                onChange={(newValue) => {
                  if (
                    newValue &&
                    studyStartDate &&
                    dayjs(newValue).diff(studyStartDate, "day") > 92
                  ) {
                    alert("학습 기간은 최대 3개월까지만 설정할 수 있습니다.");
                    return;
                  }
                  setStudyEndDate(newValue);
                }}
              />
            </div>
          </div>

          {exams.map((exam, index) => (
            <div key={index} className="exam-row">
              <input
                type="text"
                placeholder="시험 내용"
                className="exam-input"
                value={exam.title}
                onChange={(e) => {
                  const updated = [...exams];
                  updated[index].title = e.target.value;
                  setExams(updated);
                }}
              />
              <DateTimePicker
                className="exam-input"
                label="시작일"
                value={exam.startDate}
                onChange={(date) => {
                  const updated = [...exams];
                  updated[index].startDate = date;
                  setExams(updated);
                }}
              />
              <span>~</span>
              <DateTimePicker
                className="exam-input"
                label="종료일"
                value={exam.endDate}
                onChange={(date) => {
                  const updated = [...exams];
                  updated[index].endDate = date;
                  setExams(updated);
                }}
              />
              <button className="delete-button" onClick={() => removeExam(index)}>
                삭제
              </button>
            </div>
          ))}
        </section>

        <section className="section-box">
          <div className="section-title">
            학습 교재 입력
            <button onClick={addBook}>+ 교재 추가</button>
          </div>
          {books.map((book, index) => (
            <div key={index} className="book-row">
              <input
                type="text"
                placeholder="학습 교재 이름"
                className="book-title"
                value={book.title}
                onChange={(e) => {
                  const updated = [...books];
                  updated[index].title = e.target.value;
                  setBooks(updated);
                }}
              />
              <textarea
                placeholder="인식된 목차 내용 표시"
                className="book-description"
                value={book.description}
                onChange={(e) => {
                  const updated = [...books];
                  updated[index].description = e.target.value;
                  setBooks(updated);
                }}
              />
              <label className="book-upload">
                교재 목차 등록
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    handleBookFileChange(
                      index,
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
              </label>
              <button
                className="delete-button"
                onClick={() => removeBook(index)}
              >
                삭제
              </button>
            </div>
          ))}
        </section>

        <section className="section-box">
          <div className="section-title">학습 목표 선택</div>
          {books.map((book, index) => (
            <div key={index} className="goal-row">
              <input
                type="text"
                value={`등록된 교재 ${index + 1}`}
                readOnly
                className="goal-label"
              />
              <label>
                <input type="radio" name={`goal${index}`} /> 1회독
              </label>
              <label>
                <input type="radio" name={`goal${index}`} /> 2회독
              </label>
              <label>
                <input type="radio" name={`goal${index}`} /> 3회독
              </label>
            </div>
          ))}
        </section>
      </LocalizationProvider>
    </div>
  );
};

export default SurveyPage2;
