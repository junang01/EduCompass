import React, { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer, View, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const localizer = momentLocalizer(moment);

/** DB 시각 그대로 표시: 'YYYY-MM-DD HH:mm:ss' → 로컬 Date */
const toDbLocalDate = (s: string) => new Date(s.replace(" ", "T"));

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  subjectName?: string;
  completed?: boolean;
  studyPlanId: number; // ✅ 추가
  subjectId: number;   // ✅ 추가
}

const FIND_SCHEDULE_DATE_RANGE = gql`
  mutation FindScheduleDateRange($startTime: String!, $endTime: String!) {
    findScheduleDateRange(startTime: $startTime, endTime: $endTime) {
      id
      startTime
      endTime
      content
      completed
      studyPlan { id }                # ✅ 추가
      subject { id subjectName }      # ✅ 추가
    }
  }
`;

const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule($updateScheduleInput: UpdateScheduleInput!) {
    updateSchedule(updateScheduleInput: $updateScheduleInput) {
      id
      content
      startTime
      endTime
    }
  }
`;

const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: Float!) {
    deleteSchedule(id: $id)
  }
`;

const DELAY_SCHEDULE = gql`
  mutation DelaySchedule($updateScheduleInput: UpdateScheduleInput!) {
    delaySchedule(updateScheduleInput: $updateScheduleInput) {
      id
      content
      startTime
      endTime
    }
  }
`;

const COMPLETE_SCHEDULE = gql`
  mutation UpdateCompleted($id: Float!) {
    updateCompleted(id: $id) {
      id
      completed
    }
  }
`;

const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($createStudyScheduleInput: CreateStudyScheduleInput!) {
    createSchedule(createStudyScheduleInput: $createStudyScheduleInput) {
      id
      content
      startTime
      endTime
    }
  }
`;

/** ✅ 학습 현황 저장(업서트) 트리거 */
const SYNC_STUDY_STATUS_BY_PLAN = gql`
  mutation SyncStudyStatusByPlan($id: Int!) {
    syncStudyStatusByPlan(id: $id) {
      id
      completionRate
      delayRate
      remainingPercent
      subject { id }
      studyPlan { id }
    }
  }
`;

const CalendarPage = () => {
  const subjectColorMap = useRef<Record<string, string>>({});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [username, setUsername] = useState<string>("");
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editDate, setEditDate] = useState<Date | null>(null);

  const [fetchSchedules] = useMutation(FIND_SCHEDULE_DATE_RANGE);
  const [updateSchedule] = useMutation(UPDATE_SCHEDULE);
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE);
  const [delaySchedule] = useMutation(DELAY_SCHEDULE);
  const [completeSchedule] = useMutation(COMPLETE_SCHEDULE);
  const [createSchedule] = useMutation(CREATE_SCHEDULE);
  const [syncStudyStatusByPlan] = useMutation(SYNC_STUDY_STATUS_BY_PLAN); // ✅ 추가

  const getRandomColor = () => {
    const colors = [
      "#FFB6C1", "#FFDAB9", "#E6E6FA", "#FFFACD", "#D8BFD8",
      "#B0E0E6", "#F0E68C", "#E0FFFF", "#F5DEB3", "#FFDEAD",
      "#ADD8E6", "#FAFAD2", "#98FB98", "#F08080", "#AFEEEE",
      "#FFE4E1", "#D3FFCE", "#F9E79F", "#EFD1FF", "#FFEBB5",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUsername(parsed.user?.name || "");
      } catch (error) {
        console.error("❌ localStorage 파싱 실패:", error);
      }
    }

    const fetchEventsFn = async () => {
      const startOfRange = moment(date).startOf(view === "month" ? "month" : "week").toISOString();
      const endOfRange = moment(date).endOf(view === "month" ? "month" : "week").toISOString();

      try {
        const { data } = await fetchSchedules({
          variables: { startTime: startOfRange, endTime: endOfRange },
        });

        if (data?.findScheduleDateRange) {
          const formatted: CalendarEvent[] = data.findScheduleDateRange.map((s: any) => ({
            id: s.id,
            title: `${s.subject?.subjectName || "과목 미정"} - ${s.content}`,
            subjectName: s.subject?.subjectName || "기타",
            start: toDbLocalDate(s.startTime),
            end: toDbLocalDate(s.endTime),
            completed: s.completed,
            studyPlanId: s.studyPlan?.id ?? 0, // ✅ 매핑
            subjectId: s.subject?.id ?? 0,     // ✅ 매핑
          }));
          setEvents(formatted);
        }
      } catch (err) {
        console.error("📛 일정 불러오기 실패:", err);
      }
    };

    fetchEventsFn();
  }, [date, view, fetchSchedules]);

  const handleSave = async () => {
    if (!selectedDate || !title.trim() || !startTime || !endTime) return;

    const dateString = moment(selectedDate).format("YYYY-MM-DD");
    const start = moment(`${dateString}T${startTime}`).toISOString();
    const end = moment(`${dateString}T${endTime}`).toISOString();

    try {
      const { data } = await createSchedule({
        variables: {
          createStudyScheduleInput: { content: title, startTime: start, endTime: end },
        },
      });

      const newEvent = data.createSchedule;

      setEvents(prev => [
        ...prev,
        {
          id: newEvent.id,
          title: newEvent.content,
          start: toDbLocalDate(newEvent.startTime),
          end: toDbLocalDate(newEvent.endTime),
          completed: false,
          // 생성 직후엔 plan/subject id가 응답에 없을 수 있음 → 클릭 편집 시 서버에서 다시 가져오면 채워짐
          studyPlanId: 0,
          subjectId: 0,
        },
      ]);
    } catch (err) {
      console.error("일정 추가 실패:", err);
      alert("일정 추가에 실패했습니다.");
    }

    setShowModal(false);
    setTitle("");
    setStartTime("");
    setEndTime("");
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const { accessToken } = JSON.parse(userData);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ query: `mutation { logout }` }),
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

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditTitle(event.title);
    setEditStartTime(moment(event.start).format("HH:mm"));
    setEditEndTime(moment(event.end).format("HH:mm"));
    setEditDate(new Date(event.start));
    setShowDetailModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedEvent || !editDate || !editStartTime || !editEndTime) return;

    const dateStr = moment(editDate).format("YYYY-MM-DD");
    const start = moment(`${dateStr}T${editStartTime}`).toISOString();
    const end = moment(`${dateStr}T${editEndTime}`).toISOString();

    try {
      await updateSchedule({
        variables: {
          updateScheduleInput: {
            id: Number(selectedEvent.id),
            content: editTitle,
            startTime: start,
            endTime: end,
          },
        },
      });

      setEvents(prev =>
        prev.map(e =>
          e.id === selectedEvent.id
            ? { ...e, title: editTitle, start: toDbLocalDate(start), end: toDbLocalDate(end) }
            : e
        )
      );

      // ✅ 저장(업서트) 트리거
      if (selectedEvent.studyPlanId) {
        await syncStudyStatusByPlan({ variables: { id: selectedEvent.studyPlanId } });
      }

      setShowDetailModal(false);
      alert("계획이 수정되었습니다.");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("계획 수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    const confirmed = window.confirm("정말로 이 계획을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteSchedule({ variables: { id: Number(selectedEvent.id) } });
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));

      // ✅ 삭제도 현황 변화이므로 재집계 트리거
      if (selectedEvent.studyPlanId) {
        await syncStudyStatusByPlan({ variables: { id: selectedEvent.studyPlanId } });
      }

      setShowDetailModal(false);
      alert("계획이 삭제되었습니다.");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("계획 삭제에 실패했습니다.");
    }
  };

  const handleDelay = async () => {
    if (!selectedEvent || !editDate || !editStartTime || !editEndTime) return;

    const dateStr = moment(editDate).format("YYYY-MM-DD");
    const newStart = moment(`${dateStr}T${editStartTime}`).toISOString();
    const newEnd = moment(`${dateStr}T${editEndTime}`).toISOString();

    try {
      await delaySchedule({
        variables: {
          updateScheduleInput: {
            id: Number(selectedEvent.id),
            content: editTitle,
            startTime: newStart,
            endTime: newEnd,
          },
        },
      });

      setEvents(prev =>
        prev.map(e =>
          e.id === selectedEvent.id
            ? { ...e, title: editTitle, start: toDbLocalDate(newStart), end: toDbLocalDate(newEnd) }
            : e
        )
      );

      // ✅ 집계 저장 트리거
      if (selectedEvent.studyPlanId) {
        await syncStudyStatusByPlan({ variables: { id: selectedEvent.studyPlanId } });
      }

      alert("계획이 성공적으로 미뤄졌습니다.");
      setShowDetailModal(false);
    } catch (err) {
      console.error("📛 미루기 실패:", err);
      alert("미루기에 실패했습니다.");
    }
  };

  const handleCompleteToggle = async () => {
    if (!selectedEvent) return;

    try {
      const { data } = await completeSchedule({
        variables: { id: Number(selectedEvent.id) },
      });

      const newStatus = data.updateCompleted.completed;

      setSelectedEvent(prev => (prev ? { ...prev, completed: newStatus } : prev));
      setEvents(prev =>
        prev.map(e => (e.id === selectedEvent.id ? { ...e, completed: newStatus } : e))
      );

      // ✅ 집계 저장 트리거
      if (selectedEvent.studyPlanId) {
        await syncStudyStatusByPlan({ variables: { id: selectedEvent.studyPlanId } });
      }
    } catch (err) {
      console.error("✅ 완료 상태 변경 실패:", err);
      alert("계획 완료 여부 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <header className="survey-header">
        <nav>
          <h2>
            <Link to="/">Edu<br />Compass</Link>
          </h2>
          <ul>
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/bookSurveyMain">교재 추천</Link></li>
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

      <div className="calendar_container">
        <div className="sidebar">
          <div className="sidebar-title">계획 캘린더</div>
          <ul className="sidebar-menu">
            <li className="active"><a href="#">캘린더 조회</a></li>
            <hr />
            <li className="active"><Link to="/change">캘린더 조정</Link></li>
            <hr />
          </ul>
        </div>

        <div className="calendar_center">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            defaultView="month"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            selectable
            onSelectSlot={(slotInfo: SlotInfo) => {
              setSelectedDate(slotInfo.start);
              setShowModal(true);
            }}
            onSelectEvent={handleEventClick}
            style={{ height: "100%" }}
            eventPropGetter={(event) => {
              const subject = event.subjectName || "기타";
              if (!subjectColorMap.current[subject]) {
                subjectColorMap.current[subject] = getRandomColor();
              }
              const bgColor = subjectColorMap.current[subject];
              return {
                style: {
                  backgroundColor: bgColor,
                  color: "black",
                  borderRadius: "4px",
                  padding: "2px 4px",
                  fontSize: "12px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                },
              };
            }}
          />

          {showModal && selectedDate && (
            <div className="calendar-modal-overlay">
              <div className="calendar-modal">
                <div className="modal-header">
                  <span className="modal-header-title">계획 추가</span>
                </div>
                <input
                  type="text"
                  placeholder="계획 이름 입력"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="modal-input"
                />
                <div className="modal-date-display">
                  {moment(selectedDate).format("YYYY-MM-DD ddd").toUpperCase()}
                </div>
                <div className="time-range">
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  <span>~</span>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <div className="calendar-modal-actions">
                  <button onClick={() => setShowModal(false)}>취소</button>
                  <button onClick={handleSave}>저장</button>
                </div>
              </div>
            </div>
          )}

          {showDetailModal && selectedEvent && (
            <div className="calendar-detail-panel">
              <div className="detail-header">
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div className="detail-body">
                <input
                  type="date"
                  value={moment(editDate!).format("YYYY-MM-DD")}
                  onChange={(e) => setEditDate(new Date(e.target.value))}
                />
                <div className="detail-time-inputs">
                  <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} /> ~
                  <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
                </div>
              </div>
              <div className="complete-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={!!selectedEvent.completed}
                    onChange={handleCompleteToggle}
                  />
                  이 계획을 완료했어요!
                </label>
              </div>
              <div className="detail-actions">
                <button className="btn-delay" onClick={handleDelay}>미루기</button>
                <button className="btn-delete" onClick={handleDelete}>삭제</button>
                <button className="btn-edit" onClick={handleEditSave}>수정</button>
                <button className="btn-close" onClick={() => setShowDetailModal(false)}>완료</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
