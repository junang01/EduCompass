import React, { useEffect, useState } from "react";
import '../css/planstyle.css';
import { Link, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';

const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

const commonSlotProps = {
  textField: {
    InputProps: {
      sx: {
        height: 30,
        padding: 0,
        fontSize: '13px',
      },
    },
    InputLabelProps: { shrink: true },
    sx: {
      width: '130px',
      '& .MuiInputBase-root': {
        height: 30,
        minHeight: 30,
        fontSize: '13px',
      },
      '& input': {
        padding: '0 6px',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '18px',
        marginRight: '10px',
      }
    }
  },
};

const PlanPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  
    useEffect(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.name);
      }
    }, []);

  const [timeRows, setTimeRows] = useState<number[]>([0]);
  const [examRows, setExamRows] = useState<number[]>([0]);
  const [assignmentRows] = useState<number[]>([0, 1, 2]);
  const navigate = useNavigate();

  const [examDates, setExamDates] = useState<{ startDate: Dayjs | null, endDate: Dayjs | null, startTime: Dayjs | null, endTime: Dayjs | null }[]>([
    { startDate: null, endDate: null, startTime: null, endTime: null }
  ]);
  const [assignmentDates, setAssignmentDates] = useState<{ date: Dayjs | null; time: Dayjs | null }[]>([
    { date: null, time: null }, { date: null, time: null }, { date: null, time: null }
  ]);
  const [studyTimes, setStudyTimes] = useState<{ start: Dayjs | null, end: Dayjs | null }[][]>([
    days.map(() => ({ start: null, end: null }))
  ]);

  const handleAdd = () => {
    setTimeRows(prev => [...prev, prev.length]);
    setStudyTimes(prev => [...prev, days.map(() => ({ start: null, end: null }))]);
  };

  const handleRemove = () => {
    if (timeRows.length > 1) {
      setTimeRows(prev => prev.slice(0, -1));
      setStudyTimes(prev => prev.slice(0, -1));
    }
  };

  const handleAddExam = () => {
    setExamRows(prev => [...prev, prev.length]);
    setExamDates(prev => [...prev, { startDate: null, endDate: null, startTime: null, endTime: null }]);
  };

  const handleRemoveExam = () => {
    if (examRows.length > 1) {
      setExamRows(prev => prev.slice(0, -1));
      setExamDates(prev => prev.slice(0, -1));
    }
  };

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
            <div className="login">
              <Link to="/login">{username ? `${username}님` : "로그인"}</Link>
            </div>
            <div className="join">
              <Link to="/">logout</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="plan-main">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                  <div className="day-column" key={`${day}-${rowId}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    {rowIndex === 0 && <div className="day-label">{day}</div>}
                    <TimePicker
                      label="시작시간"
                      value={studyTimes[rowIndex][dayIndex].start}
                      onChange={(newValue: Dayjs | null) => {
                        const updated = [...studyTimes];
                        updated[rowIndex][dayIndex].start = newValue;
                        setStudyTimes(updated);
                      }}
                      slotProps={commonSlotProps}
                    />
                    <span className="time-separator">~</span>
                    <TimePicker
                      label="종료시간"
                      value={studyTimes[rowIndex][dayIndex].end}
                      onChange={(newValue: Dayjs | null) => {
                        const updated = [...studyTimes];
                        updated[rowIndex][dayIndex].end = newValue;
                        setStudyTimes(updated);
                      }}
                      slotProps={commonSlotProps}
                    />
                  </div>
                ))}
              </div>
            ))}
          </section>

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
                <input type="text" placeholder="등록된 시험 이름" className="exam-name-input" />
                <div className="date-range">
                  <DatePicker
                    label="시작일"
                    value={examDates[i]?.startDate ?? null}
                    onChange={(newValue: Dayjs | null) => {
                      const updated = [...examDates];
                      updated[i].startDate = newValue;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <TimePicker
                    label="시작시간"
                    value={examDates[i]?.startTime ?? null}
                    onChange={(newValue: Dayjs | null) => {
                      const updated = [...examDates];
                      updated[i].startTime = newValue;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <span className="range-separator">~</span>
                  <DatePicker
                    label="종료일"
                    value={examDates[i]?.endDate ?? null}
                    onChange={(newValue: Dayjs | null) => {
                      const updated = [...examDates];
                      updated[i].endDate = newValue;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <TimePicker
                    label="종료시간"
                    value={examDates[i]?.endTime ?? null}
                    onChange={(newValue: Dayjs | null) => {
                      const updated = [...examDates];
                      updated[i].endTime = newValue;
                      setExamDates(updated);
                    }}
                    slotProps={commonSlotProps}
                  />
                  <input 
                    type="text" 
                    placeholder="시험 범위 입력" 
                    className="range-memo-input" 
                  />
                </div>
              </div>
            ))}
          </section>

          <section className="schedule-section">
  <div className="section-header-flex">
    <h3 className="section-title">과제 일정 변경 및 추가</h3>
    <div className="row-controls">
      <button className="control-btn" onClick={() => {
        setAssignmentDates(prev => [...prev, { date: null, time: null }]);
      }}>+ 추가</button>
      <button className="control-btn" onClick={() => {
        setAssignmentDates(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
      }}>- 삭제</button>
    </div>
  </div>

  {assignmentDates.map((entry, i) => (
    <div className="schedule-row horizontal" key={`assignment-${i}`}>
      <input type="text" placeholder="등록된 과제 이름" className="text-input" style={{ flex: '2' }} />
      <DatePicker
        label="마감일"
        value={entry.date}
        onChange={(newValue) => {
          const updated = [...assignmentDates];
          updated[i].date = newValue;
          setAssignmentDates(updated);
        }}
        slotProps={commonSlotProps}
      />
      <TimePicker
        label="마감시간"
        value={entry.time}
        onChange={(newValue) => {
          const updated = [...assignmentDates];
          updated[i].time = newValue;
          setAssignmentDates(updated);
        }}
        slotProps={commonSlotProps}
      />
      <input
  type="text"
  placeholder="등록된 과제 메모"
  className="text-input"
  style={{ flex: '4' }}
/>

    </div>
  ))}
</section>
        </LocalizationProvider>

        <div className="submit-btn-wrapper">
          <button className="submit-btn">계획 조정하기</button>
        </div>
      </main>
    </>
  );
};

export default PlanPage;
