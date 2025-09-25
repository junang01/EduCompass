import React, { useState, useEffect, useCallback } from "react";
import "./studyPlanSurvey2.css";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { gql, useMutation } from "@apollo/client";
import { StudyTime } from "./StudyPlanSurvey1";
import { Navigate, useNavigate } from "react-router-dom";

const CREATE_STUDY_PLAN = gql`
  mutation CreateStudyPlan($createStudyPlanInput: CreateStudyPlanInput!) {
    createStudyPlan(createStudyPlanInput: $createStudyPlanInput) {
      id
      title
    }
  }
`;

interface ExamInput {
  title: string;
  startDate: Dayjs | null;
}

interface BookInput {
  title: string;
  description: string;
  file: File | null;
}

interface SubjectEntry {
  subject: string;
  subSubject: string;
  level: string;
  books: BookInput[];
  exams: ExamInput[];
  prevScore: string;
  goalScore: string;
  bookGoals?: string[];
}

interface SurveyPage2Props {
  onValidationChange: (isValid: boolean) => void;
  onUpdateBooks: (books: BookInput[]) => void;
  onUpdateExams: (exams: ExamInput[]) => void;
  onUpdatePeriod: (period: string) => void;
  onSubmitRequest: (submitFn: () => Promise<void>) => void;
  availableTimes: StudyTime[];
}

const subSubjects: { [key: string]: string[] } = {
  국어: ["해당 없음", "화법과 작문", "언어와 매체"],
  수학: ["해당 없음", "확률과 통계", "미적분", "기하"],
  제2외국어: ["해당 없음", "독일어", "프랑스어", "스페인어", "중국어", "일본어", "러시아어", "아랍어", "한문"],
  사회탐구: ["해당 없음", "생활과 윤리", "윤리와 사상", "한국지리", "세계지리", "동아시아사", "세계사", "정치와 법", "경제", "사회·문화"],
  과학탐구: ["해당 없음", "물리학 I", "물리학 Ⅱ", "화학 I", "화학 Ⅱ", "생명과학 I", "생명과학 Ⅱ", "지구과학 I", "지구과학 Ⅱ"]
};

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

const StudyPlanSurvey2Page: React.FC<SurveyPage2Props> = ({
  onSubmitRequest,
  availableTimes,
  onValidationChange
}) => {
  const [createStudyPlan] = useMutation(CREATE_STUDY_PLAN);
  const [planTitle, setPlanTitle] = useState("");
  const [studyStartDate, setStudyStartDate] = useState<Dayjs | null>(null);
  const [studyEndDate, setStudyEndDate] = useState<Dayjs | null>(null);
  const [subjects, setSubjects] = useState<SubjectEntry[]>([{
    subject: "",
    subSubject: "",
    level: "",
    books: [{ title: "", description: "", file: null }],
    exams: [{ title: "", startDate: null }],
    prevScore: "",
    goalScore: ""
  }]);
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [reviewDays, setReviewDays] = useState<string[]>([]);
  const [catchupDays, setCatchupDays] = useState<string[]>([]);

  const navigate = useNavigate();

  const addSubject = () => {
    setSubjects([...subjects, {
      subject: "",
      subSubject: "",
      level: "",
      books: [{ title: "", description: "", file: null }],
      exams: [{ title: "", startDate: null }],
      prevScore: "",
      goalScore: ""
    }]);
  };

  const removeSubject = (index: number) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const formatDate = (date: Dayjs | null) => date ? date.format("YYYY-MM-DDTHH:mm:ssZ") : "";

  const handleSubmit = useCallback(async () => {
    if (!studyStartDate || !studyEndDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    const variables = {
      createStudyPlanInput: {
        title: planTitle,
        studyPeriod: `${studyStartDate.format("YYYY-MM-DD")} ~ ${studyEndDate.format("YYYY-MM-DD")}`,
        learningStyle: learningStyle || "기본형",
        reviewDays,
        missedPlanDays: catchupDays,
        availableStudyScheduleInput: availableTimes.map((item) => ({
          day: dayjs(item.start).format("dddd"),
          timeRanges: [
            {
              startTime: dayjs(item.start).format("HH:mm"),
              endTime: dayjs(item.end).format("HH:mm"),
            },
          ],
        })),
        subjects: subjects.map((entry) => ({
          subject: entry.subSubject && entry.subSubject !== "해당 없음" ? entry.subSubject : entry.subject,
          studyLevel: entry.level,
          studyBookInput: entry.books.map((book, i) => ({
            bookName: book.title,
            bookIndex: book.description,
            bookReview: entry.bookGoals?.[i] || "1회독",
          })),
          examContentInput: entry.exams.map((exam) => ({
            examcontent: exam.title,
            examStartDay: formatDate(exam.startDate),
            examLastScore: entry.prevScore || "70",
            examGoalScore: entry.goalScore || "90",
          })),
        })),
      },
    };

    console.log("📤 보내는 createStudyPlanInput:", variables.createStudyPlanInput, variables.createStudyPlanInput.availableStudyScheduleInput.map(s=> s.timeRanges.map(t=> `${t.startTime}, ${t.endTime}`).join('\n')));

    try {
      const res = await createStudyPlan({ variables });
      alert("계획 생성 완료!");
      console.log("서버 응답:", res.data);
      navigate("/calendar");
    } catch (error) {
      console.error("계획 생성 실패:", error);
      alert("계획 생성에 실패했습니다.");
    }
  }, [planTitle, studyStartDate, studyEndDate, availableTimes, subjects, learningStyle, reviewDays, catchupDays, createStudyPlan]);

  useEffect(() => {
  const isValid =
    !!planTitle &&
    !!studyStartDate &&
    !!studyEndDate &&
    subjects.length > 0 &&
    subjects.every((subject) =>
      !!(subject.subject || subject.subSubject) &&
      !!subject.level &&
      subject.books.length > 0 &&
      subject.books.every(book => !!book.title && !!book.description) &&
      subject.exams.length > 0 &&
      subject.exams.every(exam => !!exam.title && !!exam.startDate)
    );

    onValidationChange(isValid);
  }, [planTitle, studyStartDate, studyEndDate, subjects]);


  useEffect(() => {
    onSubmitRequest(handleSubmit);
  }, [handleSubmit, onSubmitRequest]);

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
          <div className="section-title">
            계획 기간 입력
          </div>
          <div className="semester-period">
            <div className="semester-label">학습 진행 기간</div>
            <div className="semester-options">
              <DateTimePicker
                label="시작일"
                value={studyStartDate}
                onChange={(newValue) => {
                  console.log("📅 선택한 시작일:", newValue?.format("YYYY-MM-DD HH:mm:ss"));
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
        </section>

        <section className="section-box">
          <div className="section-title">복습할 요일 선택</div>
          <div className="radio-group">
            {DAYS.map(day => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={reviewDays.includes(day)}
                  onChange={() =>
                    setReviewDays(
                      reviewDays.includes(day)
                        ? reviewDays.filter(d => d !== day)
                        : [...reviewDays, day]
                    )
                  }
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
                  onChange={() =>
                    setCatchupDays(
                      catchupDays.includes(day)
                        ? catchupDays.filter(d => d !== day)
                        : [...catchupDays, day]
                    )
                  }
                />
                {day}
              </label>
            ))}
          </div>
        </section>

        {subjects.map((entry, idx) => (
        <section className="section-box">
          <div key={idx}>
            <div className="subject-select-box-first">
              <label htmlFor="subject-select" className="subject-select-label">과목</label>
              <select value={entry.subject} onChange={(e) => {
                const updated = [...subjects];
                updated[idx].subject = e.target.value;
                updated[idx].subSubject = "";
                setSubjects(updated);
              }} className="subject-select">
                <option value="">-- 선택 --</option>
                {Object.keys(subSubjects).map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {subSubjects[entry.subject] && (
                <select value={entry.subSubject} onChange={(e) => {
                  const updated = [...subjects];
                  updated[idx].subSubject = e.target.value;
                  setSubjects(updated);
                }}>
                  <option value="">-- 세부 과목 선택 --</option>
                  {subSubjects[entry.subject].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="subject-select-box">
              <label className="section-title">학업 수준</label>
              <div className="level-options">
                {["상", "중", "하"].map((lvl) => (
                  <label key={lvl}>
                    <input
                      type="radio"
                      name={`level-${idx}`}
                      value={lvl}
                      checked={entry.level === lvl}
                      onChange={(e) => {
                        const updated = [...subjects];
                        updated[idx].level = e.target.value;
                        setSubjects(updated);
                      }}
                    /> {lvl}
                  </label>
                ))}
              </div>
            </div>

            <div className="subject-select-box">
              <label className="section-title">직전학기 성적 및 목표성적 입력</label>
              <div className="grade-row">
                <input
                  type="text"
                  placeholder="직전 성적"
                  value={entry.prevScore}
                  onChange={(e) => {
                    const updated = [...subjects];
                    updated[idx].prevScore = e.target.value;
                    setSubjects(updated);
                  }}
                />
                <input
                  type="text"
                  placeholder="목표 성적"
                  value={entry.goalScore}
                  onChange={(e) => {
                    const updated = [...subjects];
                    updated[idx].goalScore = e.target.value;
                    setSubjects(updated);
                  }}
                />
              </div>
            </div>

            <div className="subject-select-box">
              <label className="section-title">시험 정보</label>
              {entry.exams.map((exam, exIdx) => (
                <div key={exIdx} className="exam-row">
                  <input
                    type="text"
                    placeholder="시험 제목"
                    className="exam-input"
                    value={exam.title}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].exams[exIdx].title = e.target.value;
                      setSubjects(updated);
                    }}
                  />
                  <DateTimePicker
                    className="exam-input"
                    label="시험 날짜"
                    value={exam.startDate}
                    onChange={(date) => {
                      const updated = [...subjects];
                      updated[idx].exams[exIdx].startDate = date;
                      setSubjects(updated);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="subject-select-box">
              <label className="section-title">학습 교재</label>
              {entry.books.map((book, bIdx) => (
                <div key={bIdx} className="book-row">
                  <input
                    type="text"
                    placeholder="교재 이름"
                    className="book-title"
                    value={book.title}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].books[bIdx].title = e.target.value;
                      setSubjects(updated);
                    }}
                  />
                  <textarea
                    placeholder="교재 목차 (예: 1. 독서의 본질 8page~40page)"
                    className="book-description"
                    value={book.description}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].books[bIdx].description = e.target.value;
                      setSubjects(updated);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="subject-select-box">
              <label className="section-title">학습 목표 선택</label>
              {entry.books.map((book, bIdx) => (
                <div key={bIdx} className="goal-row">
                  <input
                    type="text"
                    value={book.title || `등록된 교재 ${bIdx + 1}`}
                    readOnly
                    className="goal-label"
                  />
                  {["1회독", "2회독", "3회독"].map((count) => (
                    <label key={count}>
                      <input
                        type="radio"
                        name={`goal-${idx}-${bIdx}`}
                        value={count}
                        checked={entry.bookGoals?.[bIdx] === count}
                        onChange={(e) => {
                          const updated = [...subjects];
                          if (!updated[idx].bookGoals) updated[idx].bookGoals = [];
                          updated[idx].bookGoals![bIdx] = e.target.value;
                          setSubjects(updated);
                        }}
                      />
                      {count}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <button className="delete-button" onClick={() => removeSubject(idx)}>과목 삭제</button>
          </div>
        </section>
        ))}

        <button className="delete-button" onClick={addSubject}>+ 과목 추가</button>

        <section className="section-box">
          <div className="section-title">
            학습 스타일 선택
            <span className="optional">선택 입력 사항</span>
          </div>
          <div className="radio-group">
            {["암기형", "이해형"].map(style => (
              <label key={style}>
                <input
                  type="radio"
                  name="style"
                  checked={learningStyle === style}
                  onChange={() => setLearningStyle(style)}
                />
                {style}
              </label>
            ))}
          </div>
        </section>
      </LocalizationProvider>
    </div>
  );
};

export default StudyPlanSurvey2Page;
