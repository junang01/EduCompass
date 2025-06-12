import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/calendarPage.css";
import { Link } from "react-router-dom";
import axios from "axios";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const CalendarPage = () => {
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        const data = res.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          start: new Date(item.start),
          end: new Date(item.end),
        }));
        setEvents(data);
      } catch (err) {
        console.error("일정 불러오기 실패:", err);
      }
    };

    fetchEvents();

    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.name);
    }
  }, []);

  const handleSave = async () => {
    if (!selectedDate || !title.trim() || !startTime || !endTime) return;

    const dateString = moment(selectedDate).format("YYYY-MM-DD");
    const start = moment(`${dateString}T${startTime}`).toDate();
    const end = moment(`${dateString}T${endTime}`).toDate();
    console.log("추가 이벤트 확인:", { start, end });

    try {
      const res = await axios.post("http://localhost:4000/api/events", { title, start, end });
      console.log("저장된 이벤트:", res.data);
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
            <li><Link to="/calendar">계획 캘린더</Link></li>
            <li><Link to="/planStart">AI 계획 생성</Link></li>
            <li><Link to="/status">학습 현황</Link></li>
            <li><Link to="/books">교재 추천</Link></li>
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

      <div className="calendar_container">
        <div className="sidebar">
          <div className="sidebar-title">계획 캘린더</div>
          <ul className="sidebar-menu">
            <li className="active"><a href="#">캘린더 조회</a></li>
            <hr />
            <li className="active"><a href="#">캘린더 조정</a></li>
            <hr />
            <li className="active"><a href="#">조정 내용 요약</a></li>
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
            onView={(newView) => setView(newView as View)}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            selectable
            onSelectSlot={(slotInfo) => {
              setSelectedDate(slotInfo.start);
              setShowModal(true);
            }}
            onSelectEvent={handleEventClick}
            style={{ height: "100%" }}
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
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <input
                type="date"
                value={moment(editDate).format("YYYY-MM-DD")}
                onChange={(e) => setEditDate(new Date(e.target.value))}
              />
              <div className="detail-time-inputs">
                <input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} /> ~
                <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
              </div>
              <button onClick={handleDelete}>삭제</button>
              <button onClick={handleEditSave}>수정</button>
              <button onClick={() => setShowDetailModal(false)}>완료</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
