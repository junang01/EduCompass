import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/calendarPage.css";
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
  const [view, setView] = useState<keyof typeof Views>("week");
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
  }, []);

  const handleSave = async () => {
    if (!selectedDate || !title.trim() || !startTime || !endTime) return;

    const dateString = moment(selectedDate).format("YYYY-MM-DD");
    const start = new Date(`${dateString}T${startTime}`);
    const end = new Date(`${dateString}T${endTime}`);

    try {
      const res = await axios.post("/api/events", { title, start, end });
      const newEvent = res.data;
      setEvents([...events, {
        id: newEvent.id,
        title: newEvent.title,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      }]);
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
    const updated: CalendarEvent = {
      id: selectedEvent.id,
      title: editTitle,
      start: new Date(`${dateString}T${editStartTime}`),
      end: new Date(`${dateString}T${editEndTime}`),
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
      <div className="calendar_center">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={Object.values(Views)}
          defaultView="month"
          view={view}
          onView={(newView: keyof typeof Views) => setView(newView)}
          date={date}
          onNavigate={(newDate: Date) => setDate(newDate)}
          selectable
          // Directly type the parameter with a common object structure if SlotInfo still errors
          onSelectSlot={(slotInfo: { start: Date; end: Date; slots: Date[] }) => {
            setSelectedDate(slotInfo.start);
            setShowModal(true);
          }}
          onSelectEvent={handleEventClick}
          style={{ height: "100%" }}
        />

        {showModal && selectedDate && (
          <div className="calendar-modal-overlay">
            <div className="calendar-modal">
              <input
                placeholder="계획 이름"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="time-range">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />{" "}
                ~
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <button onClick={() => setShowModal(false)}>취소</button>
              <button onClick={handleSave}>저장</button>
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
              <input
                type="time"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
              />{" "}
              ~
              <input
                type="time"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
              />
            </div>
            <button onClick={handleDelete}>삭제</button>
            <button onClick={handleEditSave}>수정</button>
            <button onClick={() => setShowDetailModal(false)}>완료</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarPage;