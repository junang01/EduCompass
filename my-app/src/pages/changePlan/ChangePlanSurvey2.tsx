import React, { useEffect, useState } from "react";
import "./changePlanSurvey2.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, gql, useMutation } from "@apollo/client";

/* ---------------- GraphQL ---------------- */
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
      examSchedules {
        id
        examContent
        examStartDay
        examLastScore
        examGoalScore
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

/* --------------- UI 상수/타입 --------------- */
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

type StudyCell = {
  start: Dayjs | null;
  end: Dayjs | null;
};

type ExamRow = {
  examContent: string;
  startDate: Dayjs | null;
  startTime: Dayjs | null;
  examLastScore?: string;
  examGoalScore?: string;
};

/* 날짜+시간 합치기 */
const combineDateTime = (d: Dayjs | null, t: Dayjs | null): Dayjs | null => {
  if (!d || !t) return null;
  return d.hour(t.hour()).minute(t.minute()).second(0).millisecond(0);
};

const ChangePlanSurvey2Page: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [loadingAdjust, setLoadingAdjust] = useState(false);

  const [timeRows, setTimeRows] = useState<number[]>([0]); // 학습시간 행 수
  const [examRows, setExamRows] = useState<number[]>([0]); // 시험일정 행 수

  const [studyTimes, setStudyTimes] = useState<StudyCell[][]>([
    days.map(() => ({ start: null, end: null })),
  ]);

  const [examDates, setExamDates] = useState<ExamRow[]>([
    { examContent: "", startDate: null, startTime: null, examLastScore: "", examGoalScore: "" },
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

  /* 로그인 이름 표기 */
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
    variables: { studyPlanId: Number.parseInt(String(studyPlanId), 10) },
    skip: !Number.isInteger(Number(studyPlanId)),
    fetchPolicy: "network-only",
  });

  const [updateStudyPlan] = useMutation(UPDATE_STUDY_PLAN);

  /* 초기 로드 */
  useEffect(() => {
    if (!data?.findStudyPlan) return;
    const plan = data.findStudyPlan as any;

    // ---- 학습 시간 ----
    const buckets: StudyCell[][] = Array.from({ length: 7 }, () => []);
    (plan.schedules ?? []).forEach((s: any) => {
      if (!s?.startTime) return;
      const start = dayjs(s.startTime);
      const end = s.endTime ? dayjs(s.endTime) : null;
      const colIdx = (start.day() + 6) % 7; // 일(0)→6, 월(1)→0
      buckets[colIdx].push({ start, end });
    });

    // 시작 시간순 정렬 후, 첫 슬롯만 초깃값으로 반영
    buckets.forEach((b) =>
      b.sort((a, b) => {
        if (!a.start || !b.start) return 0;
        return a.start.valueOf() - b.start.valueOf();
      })
    );

    setTimeRows([0]);
    const grid: StudyCell[][] = [
      days.map((_, c) => buckets[c][0] ?? { start: null, end: null }),
    ];
    setStudyTimes(grid);

    // ---- 시험 일정 ----
    const ex: ExamRow[] = (plan.examSchedules ?? []).map((x: any) => {
      const dt = x.examStartDay ? dayjs(x.examStartDay) : null;
      return {
        examContent: x.examContent ?? "",
        startDate: dt,
        startTime: dt,
        examLastScore: x.examLastScore ?? "",
        examGoalScore: x.examGoalScore ?? "",
      };
    });

    if (ex.length) {
      setExamDates(ex);
      setExamRows(Array.from({ length: ex.length }, (_, i) => i));
    } else {
      setExamDates([
        { examContent: "", startDate: null, startTime: null, examLastScore: "", examGoalScore: "" },
      ]);
      setExamRows([0]);
    }
  }, [data]);

  /* 학습시간 행 추가/삭제 */
  const handleAdd = () => {
    setTimeRows((prev) => [...prev, prev.length]);
    setStudyTimes((prev) => [...prev, days.map(() => ({ start: null, end: null }))]);
  };
  const handleRemove = () => {
    setTimeRows((prev) => (prev.length ? prev.slice(0, -1) : prev));
    setStudyTimes((prev) => (prev.length ? prev.slice(0, -1) : prev));
  };

  /* 시험일정 행 추가/삭제 */
  const handleAddExam = () => {
    setExamRows((prev) => [...prev, prev.length]);
    setExamDates((prev) => [
      ...prev,
      { examContent: "", startDate: null, startTime: null, examLastScore: "", examGoalScore: "" },
    ]);
  };
  const handleRemoveExam = () => {
    setExamRows((prev) => (prev.length ? prev.slice(0, -1) : prev));
    setExamDates((prev) => (prev.length ? prev.slice(0, -1) : prev));
  };

  /* 저장 */
  const handleAdjustPlan = async () => {
    if (!studyPlanId) {
      alert("선택된 계획 ID가 없습니다.");
      return;
    }
    setLoadingAdjust(true);
    try {
      // ✅ GraphQL input에 맞게 day + timeRanges로 변환
      const availableStudyScheduleInput = days
        .map((day, dayIndex) => {
          const timeRanges = studyTimes
            .map((row) => row[dayIndex])
            .filter((c) => c.start && c.end)
            .map((c) => ({
              startTime: c.start!.toISOString(),
              endTime: c.end!.toISOString(),
              // ❌ TimeRangeInput에 content가 없으므로 보내지 않음
              // content: "공부시간",
            }));

          return { day, timeRanges };
        })
        .filter((d) => d.timeRanges.length > 0);

      // ✅ 백엔드 스키마(ExamUpdateContentInput)에 맞춰 필드 보정:
      // subjectName 필수, examContent → examcontent(소문자 c)
      const examUpdateContentInput = examDates
        .filter((e) => e.examContent && e.startDate && e.startTime)
        .map((e) => {
          const start = combineDateTime(e.startDate, e.startTime)!;
          return {
            subjectName: e.examContent, // 임시 매핑(과목명 입력 필드가 따로 없으므로)
            examcontent: e.examContent, // 백엔드 필드명에 맞춤
            examStartDay: start.format("YYYY-MM-DD HH:mm:ss"),
            examLastScore: e.examLastScore ?? "",
            examGoalScore: e.examGoalScore ?? "",
          };
        });

      const variables = {
        input: {
          studyPlanId,
          availableStudyScheduleInput,
          examUpdateContentInput,
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
          <h2>
            <Link to="/">Edu<br />Compass</Link>
          </h2>
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
              </div>
            </div>

            {timeRows.map((rowId, rowIndex) => (
              <div className="weekday-columns" key={`study-${rowId}`}>
                {days.map((day, dayIndex) => (
                  <div className="day-column" key={`${day}-${rowId}`}>
                    {rowIndex === 0 && <div className="day-label">{day}</div>}

                    <div className="cell-inline">
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

                      {/* ✅ 셀(특정 요일의 특정 행)만 삭제 */}
                      <button
                        className="clear-cell-btn"
                        title="이 셀만 삭제"
                        onClick={() => {
                          const updated = [...studyTimes];
                          updated[rowIndex][dayIndex] = { start: null, end: null };
                          setStudyTimes(updated);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* 시험 일정 */}
          <section className="schedule-section">
            <div className="section-header-flex">
              <h3 className="section-title">시험 일정</h3>
              <div className="row-controls">
                <button className="control-btn" onClick={handleAddExam}>+ 추가</button>
                <button className="control-btn" onClick={handleRemoveExam}>- 삭제</button>
              </div>
            </div>

            {examRows.map((i) => (
              <div className="schedule-row" key={`exam-${i}`}>
                <input
                  type="text"
                  placeholder="시험 이름 (examContent)"
                  className="exam-name-input"
                  value={examDates[i]?.examContent || ""}
                  onChange={(e) => {
                    const updated = [...examDates];
                    updated[i].examContent = e.target.value;
                    setExamDates(updated);
                  }}
                />
                <div className="date-range">
                  <DatePicker
                    label="시험 날짜"
                    value={examDates[i]?.startDate ?? null}
                    onChange={(v) => {
                      const updated = [...examDates];
                      updated[i].startDate = v;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <TimePicker
                    label="시험 시간"
                    value={examDates[i]?.startTime ?? null}
                    onChange={(v) => {
                      const updated = [...examDates];
                      updated[i].startTime = v;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <input
                    type="text"
                    placeholder="직전 점수 (예: 85)"
                    className="range-memo-input"
                    value={examDates[i]?.examLastScore ?? ""}
                    onChange={(e) => {
                      const updated = [...examDates];
                      updated[i].examLastScore = e.target.value;
                      setExamDates(updated);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="목표 점수 (예: 95)"
                    className="range-memo-input"
                    value={examDates[i]?.examGoalScore ?? ""}
                    onChange={(e) => {
                      const updated = [...examDates];
                      updated[i].examGoalScore = e.target.value;
                      setExamDates(updated);
                    }}
                  />
                </div>
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
