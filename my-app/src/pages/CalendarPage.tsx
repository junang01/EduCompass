import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/calendarPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { useRef } from "react";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  subjectName?: string;
}

const FIND_SCHEDULE_DATE_RANGE = gql`
  mutation FindScheduleDateRange($startTime: String!, $endTime: String!) {
    findScheduleDateRange(startTime: $startTime, endTime: $endTime) {
      id
      startTime
      endTime
      content
      subject {
        subjectName
      }
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
        console.log("🧾 parsed.user.name 확인:", parsed.user?.name);
        setUsername(parsed.user?.name || ""); // ✅ 핵심 수정
      } catch (error) {
        console.error("❌ localStorage 파싱 실패:", error);
      }
    }

    const fetchEvents = async () => {
      const startOfRange = moment(date).startOf(view === "month" ? "month" : "week").toISOString();
      const endOfRange = moment(date).endOf(view === "month" ? "month" : "week").toISOString();

      try {
        const { data } = await fetchSchedules({
          variables: {
            startTime: startOfRange,
            endTime: endOfRange,
          },
        });

        if (data?.findScheduleDateRange) {
          const formatted = data.findScheduleDateRange.map((s: any) => ({
            id: s.id,
            title: `${s.subject?.subjectName || "과목 미정"} - ${s.content}`,
            subjectName: s.subject?.subjectName || "기타",
            start: new Date(s.startTime),
            end: new Date(s.endTime),
          }));
          setEvents(formatted);
        }
      } catch (err) {
        console.error("📛 일정 불러오기 실패:", err);
      }
      const missedPlanDays: string[] = JSON.parse(localStorage.getItem("missedPlanDays") || "[]");
    };

    fetchEvents();
  }, [date, view]);

  const handleSave = async () => {
    if (!selectedDate || !title.trim() || !startTime || !endTime) return;

    const dateString = moment(selectedDate).format("YYYY-MM-DD");
    const start = moment(`${dateString}T${startTime}`).toDate();
    const end = moment(`${dateString}T${endTime}`).toDate();

    try {
      const res = await axios.post("http://localhost:4000/api/events", { title, start, end });
      const newEvent = res.data;
      setEvents([
        ...events,
        {
          id: newEvent.id,
          title: newEvent.title,
          start: moment(newEvent.start).toDate(),
          end: moment(newEvent.end).toDate(),
        },
      ]);
    } catch (err) {
      console.error("일정 추가 실패:", err);
    }

    setShowModal(false);
    setTitle("");
    setStartTime("");
    setEndTime("");
  };
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      console.log("📦 유저 데이터:", JSON.parse(userData));
    } else {
      console.warn("⚠️ localStorage에 'user' 데이터 없음");
    }


    if (!userData) return;

    const { accessToken } = JSON.parse(userData);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 전달
        },
        credentials: "include", // 쿠키 있을 경우 포함
        body: JSON.stringify({
          query: `
            mutation {
              logout
            }
          `,
        }),
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

    const dateString = moment(editDate).format("YYYY-MM-DD");
    const updated = {
      id: selectedEvent.id,
      title: editTitle,
      start: moment(`${dateString}T${editStartTime}`).toDate(),
      end: moment(`${dateString}T${editEndTime}`).toDate(),
    };

    try {
      await axios.put(`/api/events/${selectedEvent.id}`, updated);
      setEvents(events.map(e => (e.id === selectedEvent.id ? updated : e)));
    } catch (err) {
      console.error("수정 실패:", err);
    }

    setShowDetailModal(false);
    setSelectedEvent(null);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      await axios.delete(`/api/events/${selectedEvent.id}`);
      setEvents(events.filter(e => e.id !== selectedEvent.id));
    } catch (err) {
      console.error("삭제 실패:", err);
    }

    setShowDetailModal(false);
    setSelectedEvent(null);
  };

  const handleDelay = () => {
    if (!selectedEvent) return;

    const missedDays = JSON.parse(localStorage.getItem("missedPlanDays") || "[]");
    console.log("----------------------미루기------------------------------", missedDays);

    if (!Array.isArray(missedDays) || missedDays.length === 0) {
      alert("미루기 요일 정보가 없습니다.");
      return;
    }

    // 현재 날짜 이후 중 가장 가까운 missedPlanDay 탐색
    const current = moment(selectedEvent.start);
    let targetDate: moment.Moment | null = null;

    for (let i = 1; i <= 7; i++) {
      const next = current.clone().add(i, 'days');
      const weekdayKor = next.format("dd"); // '월', '화', ...
      if (missedDays.includes(weekdayKor)) {
        targetDate = next;
        break;
      }
    }

    if (!targetDate) {
      alert("미루기 가능한 날짜를 찾을 수 없습니다.");
      return;
    }

    const duration = moment(selectedEvent.end).diff(moment(selectedEvent.start), 'minutes');
    const newStart = targetDate.set({ hour: current.hour(), minute: current.minute() }).toDate();
    const newEnd = moment(newStart).add(duration, 'minutes').toDate();

    const updated = {
      ...selectedEvent,
      start: newStart,
      end: newEnd,
    };

    // axios put 호출
    axios.put(`/api/events/${selectedEvent.id}`, updated)
      .then(() => {
        setEvents(events.map(e => (e.id === selectedEvent.id ? updated : e)));
        setSelectedEvent(updated);
        alert("계획이 미뤄졌습니다.");
      })
      .catch(() => {
        alert("미루기 실패!");
      });
  };

  return (
    <>
      <header className="survey-header">
        <nav>
          <h2><Link to="/">Edu<br />Compass</Link></h2>
          <ul>
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/books">교재 추천</Link></li>
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
            <li className="active"><a href="#">캘린더 조정</a></li>
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
            style={{ height: "100%" }}eventPropGetter={(event) => {
              const subject = event.subjectName || "기타";

              if (!subjectColorMap.current[subject]) {
                subjectColorMap.current[subject] = getRandomColor(); // 처음 등장한 과목에 색 지정
              }

              const bgColor = subjectColorMap.current[subject];

              return {
                style: {
                  backgroundColor: bgColor,
                  color: "black",
                  borderRadius: "4px",
                  padding: "2px 4px",
                  fontSize: "12px",
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
                  value={moment(editDate).format("YYYY-MM-DD")}
                  onChange={(e) => setEditDate(new Date(e.target.value))}
                />
                <div className="detail-time-inputs">
                  <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} /> ~
                  <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
                </div>
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
