import React, { useEffect, useState } from "react";
import "./changePlanSurvey2.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, gql, useMutation } from "@apollo/client";

// ✅ StudyPlan 조회 쿼리: schedules + exams + homeworks
const FIND_STUDY_PLAN = gql`
  query ($studyPlanId: Float!) {
    findStudyPlan(studyPlanId: $studyPlanId) {
      id
      title
      studyPeriod
      schedules {
        id
        startTime
        endTime
        content
      }
      # ↓↓↓ 여기는 서버 스키마에 맞게 이름/필드 조정 필요
      exams {
        id
        subjectName
        examcontent
        examStartDay
        examEndDay
      }
      homeworks {
        id
        homeworkName
        homeworkContent
        homeworkStartDay
        homeworkEndDay
      }
    }
  }
`;

const UPDATE_STUDY_PLAN = gql`
  mutation UpdateStudyPlan($input: UpdateStudyPlanInput!) {
    updateStudyPlan(updateStudyPlanInput: $input) {
      id
      title
    }
  }
`;

const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

const commonSlotProps = {
  textField: {
    InputProps: { sx: { height: 30, padding: 0, fontSize: "13px" } },
    InputLabelProps: { shrink: true },
    sx: {
      width: "130px",
      "& .MuiInputBase-root": { height: 30, minHeight: 30, fontSize: "13px" },
      "& input": { padding: "0 6px" },
      "& .MuiSvgIcon-root": { fontSize: "18px", marginRight: "10px" },
    },
  },
};

type StudyCell = { start: Dayjs | null; end: Dayjs | null };
type ExamRow = {
  name: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  range?: string;
};
type HomeworkRow = { name: string; date: Dayjs | null; time: Dayjs | null; memo?: string };

const ChangePlanSurvey2Page: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [loadingAdjust, setLoadingAdjust] = useState(false);

  const [timeRows, setTimeRows] = useState<number[]>([0]);
  const [examRows, setExamRows] = useState<number[]>([0]);

  const [studyTimes, setStudyTimes] = useState<StudyCell[][]>([
    days.map(() => ({ start: null, end: null })),
  ]);

  const [examDates, setExamDates] = useState<ExamRow[]>([
    { name: "", startDate: null, endDate: null, startTime: null, endTime: null, range: "" },
  ]);

  const [assignmentDates, setAssignmentDates] = useState<HomeworkRow[]>([
    { name: "", date: null, time: null, memo: "" },
  ]);

  const navigate = useNavigate();
  const location = useLocation() as any;

  const selectedPlan = location?.state?.selectedPlan;
  const studyPlanId: number | undefined =
    selectedPlan?.id !== undefined
      ? Number(selectedPlan.id)
      : location?.state?.studyPlanId
      ? Number(location.state.studyPlanId)
      : undefined;

  const toISO = (date: Dayjs | null, time: Dayjs | null) => {
    if (!date) return null;
    const base = date
      .hour(time ? time.hour() : 0)
      .minute(time ? time.minute() : 0)
      .second(0)
      .millisecond(0);
    return base.toISOString();
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    try {
      const parsed = JSON.parse(userData);
      const name = parsed?.user?.name ?? parsed?.name ?? "";
      setUsername(name);
    } catch (e) {
      console.error("user parse error:", e);
    }
  }, []);

  const { data, loading, error } = useQuery(FIND_STUDY_PLAN, {
    variables: { studyPlanId: studyPlanId as number },
    skip: !studyPlanId,
    fetchPolicy: "network-only",
  });

  const [updateStudyPlan] = useMutation(UPDATE_STUDY_PLAN);

  // ✅ 서버 응답 → 화면 상태로 변환
  useEffect(() => {
    if (!data?.findStudyPlan) return;
    const plan = data.findStudyPlan as any;

    // --- 스케줄 요일 매핑 ---
    const row0: StudyCell[] = days.map(() => ({ start: null, end: null }));
    plan.schedules?.forEach((s: any) => {
      if (!s?.startTime) return;
      const start = dayjs(s.startTime);
      const end = s.endTime ? dayjs(s.endTime) : null;
      const jsDay = start.day();            // 0(Sun)~6(Sat)
      const colIdx = jsDay === 0 ? 6 : jsDay - 1; // Mon=0,...,Sun=6
      row0[colIdx] = { start, end };
    });
    setStudyTimes([row0]);
    setTimeRows([0]);

    // --- 시험 채우기 ---
    if (Array.isArray(plan.exams) && plan.exams.length) {
      setExamRows(plan.exams.map((_: any, i: number) => i));
      setExamDates(
        plan.exams.map((e: any) => ({
          name: e.subjectName ?? "",
          startDate: e.examStartDay ? dayjs(e.examStartDay) : null,
          startTime: e.examStartDay ? dayjs(e.examStartDay) : null,
          endDate: e.examEndDay ? dayjs(e.examEndDay) : null,
          endTime: e.examEndDay ? dayjs(e.examEndDay) : null,
          range: e.examcontent ?? "",
        }))
      );
    } else {
      setExamRows([0]);
      setExamDates([{ name: "", startDate: null, endDate: null, startTime: null, endTime: null, range: "" }]);
    }

    // --- 과제 채우기 ---
    if (Array.isArray(plan.homeworks) && plan.homeworks.length) {
      setAssignmentDates(
        plan.homeworks.map((h: any) => {
          const due = h.homeworkEndDay ?? h.homeworkStartDay;
          return {
            name: h.homeworkName ?? "",
            date: due ? dayjs(due) : null,
            time: due ? dayjs(due) : null,
            memo: h.homeworkContent ?? "",
          };
        })
      );
    } else {
      setAssignmentDates([{ name: "", date: null, time: null, memo: "" }]);
    }
  }, [data]);

  // 행 추가/삭제
  const handleAdd = () => {
    setTimeRows((prev) => [...prev, prev.length]);
    setStudyTimes((prev) => [...prev, days.map(() => ({ start: null, end: null }))]);
  };
  const handleRemove = () => {
    if (timeRows.length > 1) {
      setTimeRows((prev) => prev.slice(0, -1));
      setStudyTimes((prev) => prev.slice(0, -1));
    }
  };
  const handleAddExam = () => {
    setExamRows((prev) => [...prev, prev.length]);
    setExamDates((prev) => [...prev, { name: "", startDate: null, endDate: null, startTime: null, endTime: null, range: "" }]);
  };
  const handleRemoveExam = () => {
    if (examRows.length > 1) {
      setExamRows((prev) => prev.slice(0, -1));
      setExamDates((prev) => prev.slice(0, -1));
    }
  };

  // ✅ 저장
  const handleAdjustPlan = async () => {
    if (!studyPlanId) {
      alert("선택된 계획 ID가 없습니다.");
      return;
    }
    setLoadingAdjust(true);
    try {
      const availableStudyScheduleInput = studyTimes.flatMap((row) =>
        row
          .filter((c) => c.start && c.end)
          .map((c) => ({
            startTime: c.start!.toISOString(),
            endTime: c.end!.toISOString(),
            content: "공부시간",
          }))
      );

      const examUpdateContentInput = examDates
        .filter((e) => e.name && e.startDate)
        .map((e) => {
          const startAt = toISO(e.startDate, e.startTime);
          const endAt = toISO(e.endDate, e.endTime);
          return {
            subjectName: e.name,
            examcontent: e.range || "",
            examStartDay: startAt ?? "",
            examEndDay: endAt ?? "",
          };
        });

      const homeworkUpdateInput = assignmentDates
        .filter((h) => h.name && h.date)
        .map((h) => {
          const due = toISO(h.date, h.time) ?? "";
          return {
            homeworkName: h.name,
            homeworkStartDay: due,
            homeworkEndDay: due,
            homeworkContent: h.memo || "",
          };
        });

      const variables = {
        input: {
          studyPlanId,
          availableStudyScheduleInput,
          examUpdateContentInput,
          homeworkUpdateInput,
        },
      };

      const { data } = await updateStudyPlan({ variables });
      if (data?.updateStudyPlan?.id) {
        alert("계획 조정이 완료되었습니다.");
        navigate("/calendar");
      }
    } catch (e) {
      console.error("계획 조정 중 오류:", e);
      alert("계획 조정에 실패했습니다.");
    } finally {
      setLoadingAdjust(false);
    }
  };

  if (!studyPlanId) return <div style={{ padding: 20 }}>선택된 계획이 없습니다. 먼저 계획을 선택해 주세요.</div>;
  if (loading) return <div style={{ padding: 20 }}>불러오는 중...</div>;
  if (error) return <div style={{ padding: 20 }}>불러오기 실패: {error.message}</div>;

  return (
    <>
      <header>
        <nav>
          <h2><Link to="/">Edu<br />Compass</Link></h2>
          <ul>
            <li><Link to="/planStart" className="active">계획 캘린더</Link></li>
            <li><Link to="/makeplanStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/books">교재 추천</Link></li>
            <li><Link to="/mypage">마이페이지</Link></li>
          </ul>
          <div className="log">
            <div className="login"><Link to="/login">{username ? `${username}님` : "로그인"}</Link></div>
            {username && <div className="join"><Link to="/">logout</Link></div>}
          </div>
        </nav>
      </header>

      <main className="plan-main">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* 학습 시간 */}
          <section className="study-time-section">
            <div className="section-header-flex">
              <h3 className="section-title">학습 가능 시간 변경 및 추가</h3>
              <div className="row-controls">
                <button className="control-btn" onClick={handleAdd}>+ 추가</button>
                <button className="control-btn" onClick={handleRemove}>- 삭제</button>
                <button className="control-btn" onClick={() => navigate("/plancall")}>내 일정 불러오기</button>
                <button className="control-btn">직접 수정</button>
              </div>
            </div>

            {timeRows.map((rowId, rowIndex) => (
              <div className="weekday-columns" key={`study-${rowId}`}>
                {days.map((day, dayIndex) => (
                  <div className="day-column" key={`${day}-${rowId}`}>
                    {rowIndex === 0 && <div className="day-label">{day}</div>}
                    <TimePicker
                      label="시작시간"
                      value={studyTimes[rowIndex][dayIndex].start}
                      onChange={(nv) => {
                        const updated = [...studyTimes];
                        const prev = updated[rowIndex][dayIndex].start;
                        updated[rowIndex][dayIndex].start =
                          prev && nv ? prev.hour(nv.hour()).minute(nv.minute()).second(0).millisecond(0) : nv;
                        setStudyTimes(updated);
                      }}
                      slotProps={commonSlotProps}
                    />
                    <span className="time-separator">~</span>
                    <TimePicker
                      label="종료시간"
                      value={studyTimes[rowIndex][dayIndex].end}
                      onChange={(nv) => {
                        const updated = [...studyTimes];
                        const prev = updated[rowIndex][dayIndex].end;
                        updated[rowIndex][dayIndex].end =
                          prev && nv ? prev.hour(nv.hour()).minute(nv.minute()).second(0).millisecond(0) : nv;
                        setStudyTimes(updated);
                      }}
                      slotProps={commonSlotProps}
                    />
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* 시험 일정 */}
          <section className="schedule-section">
            <div className="section-header-flex">
              <h3 className="section-title">시험 일정 변경 및 추가</h3>
              <div className="row-controls">
                <button className="control-btn" onClick={handleAddExam}>+ 추가</button>
                <button className="control-btn" onClick={handleRemoveExam}>- 삭제</button>
              </div>
            </div>

            {examRows.map((i) => (
              <div className="schedule-row" key={`exam-${i}`}>
                <input
                  type="text"
                  placeholder="시험 이름"
                  className="exam-name-input"
                  value={examDates[i]?.name || ""}
                  onChange={(e) => {
                    const updated = [...examDates];
                    updated[i].name = e.target.value;
                    setExamDates(updated);
                  }}
                />
                <div className="date-range">
                  <DatePicker
                    label="시작일"
                    value={examDates[i]?.startDate ?? null}
                    onChange={(v) => {
                      const updated = [...examDates];
                      updated[i].startDate = v;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <TimePicker
                    label="시작시간"
                    value={examDates[i]?.startTime ?? null}
                    onChange={(v) => {
                      const updated = [...examDates];
                      updated[i].startTime = v;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <span className="range-separator">~</span>
                  <DatePicker
                    label="종료일"
                    value={examDates[i]?.endDate ?? null}
                    onChange={(v) => {
                      const updated = [...examDates];
                      updated[i].endDate = v;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <TimePicker
                    label="종료시간"
                    value={examDates[i]?.endTime ?? null}
                    onChange={(v) => {
                      const updated = [...examDates];
                      updated[i].endTime = v;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <input
                    type="text"
                    placeholder="시험 범위 입력"
                    className="range-memo-input"
                    value={examDates[i]?.range ?? ""}
                    onChange={(e) => {
                      const updated = [...examDates];
                      updated[i].range = e.target.value;
                      setExamDates(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* 과제 일정 */}
          <section className="schedule-section">
            <div className="section-header-flex">
              <h3 className="section-title">과제 일정 변경 및 추가</h3>
              <div className="row-controls">
                <button
                  className="control-btn"
                  onClick={() => setAssignmentDates((prev) => [...prev, { name: "", date: null, time: null, memo: "" }])}
                >
                  + 추가
                </button>
                <button
                  className="control-btn"
                  onClick={() => setAssignmentDates((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))}
                >
                  - 삭제
                </button>
              </div>
            </div>

            {assignmentDates.map((entry, i) => (
              <div className="schedule-row horizontal" key={`assignment-${i}`}>
                <input
                  type="text"
                  placeholder="과제 이름"
                  className="text-input"
                  style={{ flex: "2" }}
                  value={entry.name}
                  onChange={(e) => {
                    const updated = [...assignmentDates];
                    updated[i].name = e.target.value;
                    setAssignmentDates(updated);
                  }}
                />
                <DatePicker
                  label="마감일"
                  value={entry.date}
                  onChange={(v) => {
                    const updated = [...assignmentDates];
                    updated[i].date = v;
                    setAssignmentDates(updated);
                  }}
                  slotProps={commonSlotProps}
                />
                <TimePicker
                  label="마감시간"
                  value={entry.time}
                  onChange={(v) => {
                    const updated = [...assignmentDates];
                    updated[i].time = v;
                    setAssignmentDates(updated);
                  }}
                  slotProps={commonSlotProps}
                />
                <input
                  type="text"
                  placeholder="과제 메모"
                  className="text-input"
                  style={{ flex: "4" }}
                  value={entry.memo}
                  onChange={(e) => {
                    const updated = [...assignmentDates];
                    updated[i].memo = e.target.value;
                    setAssignmentDates(updated);
                  }}
                />
              </div>
            ))}
          </section>
        </LocalizationProvider>

        <div className="submit-btn-wrapper">
          <button className="submit-btn" onClick={handleAdjustPlan} disabled={loadingAdjust}>
            {loadingAdjust ? "조정 중..." : "계획 조정하기"}
          </button>
        </div>
      </main>
    </>
  );
};

export default ChangePlanSurvey2Page;
