import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/surveyPage1.css";

const localizer = momentLocalizer(moment);

export interface StudyTime extends Event {
  start: Date;
  end: Date;
  title: string;
}

interface SurveyPage1Props {
  onValidationChange: (isValid: boolean) => void;
  onUpdateAvailableTimes: (data: StudyTime[]) => void;
}

const SurveyPage1: React.FC<SurveyPage1Props> = ({ onValidationChange, onUpdateAvailableTimes }) => {
  const [events, setEvents] = useState<StudyTime[]>([]);

  // 유효성 검증 콜백
  useEffect(() => {
    onValidationChange(events.length > 0);
    onUpdateAvailableTimes(events);
  }, [events]);

  // 시간 선택 시 이벤트 추가
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setEvents((prev) => [
      ...prev,
      {
        title: "학습 가능",
        start,
        end,
      },
    ]);
  };

  // 이벤트 클릭 시 삭제
  const handleSelectEvent = (event: StudyTime) => {
    if (window.confirm(`"${event.title}" 일정을 삭제하시겠습니까?`)) {
      setEvents((prev) =>
        prev.filter(
          (e) =>
            !(e.start.getTime() === event.start.getTime() && e.end.getTime() === event.end.getTime())
        )
      );
    }
  };

  return (
    <div className="mainContainer">
      <div className="mainContainer_body">
        <div className="page1Div">
          <div className="questExplain">
            <h3>학습 가능 시간</h3>
          </div>

          <div className="firstCalendar">
            <div className="calendarWrapper">
              <Calendar
                className="first_calendar"
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                views={['week']}
                defaultView="week"
                step={30}
                timeslots={2}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage1;
