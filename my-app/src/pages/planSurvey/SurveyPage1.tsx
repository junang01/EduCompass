import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Event, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/surveyPage1.css";

const localizer = momentLocalizer(moment);

interface StudyTime extends Event {
  start: Date;
  end: Date;
  title: string;
}

interface SurveyPage1Props {
  onValidationChange: (isValid: boolean) => void;
}

const SurveyPage1: React.FC<SurveyPage1Props> = ({ onValidationChange }) => {
  const [events, setEvents] = useState<StudyTime[]>([]);
  const [showTimeForm, setShowTimeForm] = useState(false);

  useEffect(() => {
    onValidationChange(events.length > 0);
  }, [events]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setEvents((prev) => [...prev, { start, end, title: "학습 가능" }]);
  };

  const handleSelectEvent = (event: StudyTime) => {
    if (window.confirm(`"${event.title}" 일정을 삭제하시겠습니까?`)) {
      setEvents((prev) =>
        prev.filter((e) => e.start !== event.start || e.end !== event.end)
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

          {showTimeForm && (
            <div className="mt-6 p-4 border rounded-md bg-gray-100">
              <p className="mb-2 text-sm text-gray-700">
                아직 저장된 시간이 없어요. 학습 가능 시간을 설정해 주세요.
              </p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setShowTimeForm(false);
                }}
              >
                설정 완료
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage1;
