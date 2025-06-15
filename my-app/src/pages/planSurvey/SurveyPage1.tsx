import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/surveyPage1.css";

const localizer = momentLocalizer(moment);

// BigCalendarEvent를 확장하는 대신, 필요한 속성만으로 StudyTime 인터페이스를 정의합니다.
// Calendar 컴포넌트에 'events' prop을 전달할 때 'any[]'로 강제 캐스팅하여 타입 오류를 회피합니다.
interface StudyTime {
  start: Date;
  end: Date;
  title: string;
  // 필요에 따라 여기에 다른 react-big-calendar 이벤트 속성을 추가할 수 있습니다.
  // 예: allDay?: boolean; id?: number;
}

interface SurveyPage1Props {
  onValidationChange: (isValid: boolean) => void;
}

const SurveyPage1: React.FC<SurveyPage1Props> = ({ onValidationChange }) => {
  const [events, setEvents] = useState<StudyTime[]>([]);
  const [showTimeForm, setShowTimeForm] = useState(false);

  useEffect(() => {
    onValidationChange(events.length > 0);
  }, [events, onValidationChange]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const newEvent: StudyTime = {
      start,
      end,
      title: "학습 가능",
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleSelectEvent = (event: StudyTime) => {
    if (window.confirm(`"${event.title}" 일정을 삭제하시겠습니까?`)) {
      setEvents((prev) =>
        prev.filter((e) => e.start.getTime() !== event.start.getTime() || e.end.getTime() !== event.end.getTime())
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
                // events prop에 StudyTime[]을 넘기지만, Calendar는 아마 BigCalendarEvent[]를 기대할 것입니다.
                // TypeScript에게 이 배열을 'any' 타입 배열로 취급하도록 지시합니다.
                events={events as any[]} // <-- 여기에 변경 적용
                startAccessor="start"
                endAccessor="end"
                selectable
                views={Object.values(Views)}
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