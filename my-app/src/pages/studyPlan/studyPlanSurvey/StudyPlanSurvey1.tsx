import React, { useEffect, useMemo, useRef, useState } from "react";
import "./studyPlanSurvey1.css";

interface TimeRange {
  startTime: string; // "09:00"
  endTime: string;   // "12:00"
}

export interface AvailableStudySchedule {
  day: string;
  timeRanges: { startTime: string; endTime: string }[];
}

/** 기존 코드들과의 호환을 위해 alias 유지 */
export type StudyTime = AvailableStudySchedule;

interface SurveyPage1Props {
  onValidationChange: (isValid: boolean) => void;
  onUpdateAvailableTimes: React.Dispatch<React.SetStateAction<StudyTime[]>>;
}

const DAYS: string[] = ["월", "화", "수", "목", "금", "토", "일"];

/** ---- 커스텀 타임피커 ---- */
type ConfirmTimeInputProps = {
  value: string; // "HH:mm"
  onChange: (v: string) => void;
  width?: number; // px
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const parseTime = (v: string) => {
  const [h, m] = (v || "00:00").split(":").map((x) => parseInt(x || "0", 10));
  return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
};
const formatLabelKo = (v: string) => {
  const { h, m } = parseTime(v);
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${am ? "오전" : "오후"} ${pad2(h12)}:${pad2(m)}`;
};

const ConfirmTimeInput: React.FC<ConfirmTimeInputProps> = ({ value, onChange, width = 118 }) => {
  const [open, setOpen] = useState(false);
  const [draftH, setDraftH] = useState(parseTime(value).h);
  const [draftM, setDraftM] = useState(parseTime(value).m);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // value가 바뀌면 드래프트 초기화
  useEffect(() => {
    const { h, m } = parseTime(value);
    setDraftH(h);
    setDraftM(m);
  }, [value]);

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      if (!wrapRef.current) return;
      const target = e.target as Node;
      if (!wrapRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // 팝오버 키보드
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter") {
      onChange(`${pad2(draftH)}:${pad2(draftM)}`);
      setOpen(false);
    }
  };

  const apply = () => {
    onChange(`${pad2(draftH)}:${pad2(draftM)}`);
    setOpen(false);
  };

  const toggleAM = () => {
    // 오전/오후 토글
    if (draftH < 12) setDraftH((draftH + 12) % 24);
    else setDraftH(draftH - 12);
  };

  return (
    <div className="confirm-time" ref={wrapRef}>
      {/* 표시부: 입력처럼 보이는 readOnly input */}
      <input
        className="ct-display"
        style={{ width }}
        readOnly
        value={formatLabelKo(`${pad2(draftH)}:${pad2(draftM)}`)}
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div
          className="ct-popover"
          ref={popRef}
          tabIndex={-1}
          onKeyDown={handleKey}
        >
          <div className="ct-row">
            <button type="button" className="ct-ampm" onClick={toggleAM}>
              {draftH < 12 ? "오전" : "오후"}
            </button>
            <select
              className="ct-select"
              value={draftH}
              onChange={(e) => setDraftH(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {pad2(h)}시
                </option>
              ))}
            </select>

            <select
              className="ct-select"
              value={draftM}
              onChange={(e) => setDraftM(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 60 }, (_, m) => (
                <option key={m} value={m}>
                  {pad2(m)}분
                </option>
              ))}
            </select>
          </div>

          <div className="ct-actions">
            <button type="button" className="ct-btn cancel" onClick={() => setOpen(false)}>
              취소
            </button>
            <button type="button" className="ct-btn confirm" onClick={apply}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
/** ---- 커스텀 타임피커 끝 ---- */

const StudyPlanSurvey1Page: React.FC<SurveyPage1Props> = ({
  onValidationChange,
  onUpdateAvailableTimes,
}) => {
  const [availableTimes, setAvailableTimes] = useState<AvailableStudySchedule[]>([]);

  // 전체 timeRange 개수 (유효성 검사용)
  const totalRanges = useMemo(
    () => availableTimes.reduce((acc, d) => acc + d.timeRanges.length, 0),
    [availableTimes]
  );

  // 상위로 값 전달 + 유효성 반영
  useEffect(() => {
    onUpdateAvailableTimes(availableTimes as StudyTime[]);
    onValidationChange(totalRanges > 0);
  }, [availableTimes, totalRanges, onUpdateAvailableTimes, onValidationChange]);

  const ensureDay = (day: string) => {
    setAvailableTimes((prev) => {
      if (prev.some((d) => d.day === day)) return prev;
      return [...prev, { day, timeRanges: [] }];
    });
  };

  const handleAddTime = (day: string) => {
    setAvailableTimes((prev) => {
      const exists = prev.find((d) => d.day === day);
      if (!exists) {
        return [...prev, { day, timeRanges: [{ startTime: "09:00", endTime: "10:00" }] }];
      }
      return prev.map((d) =>
        d.day === day
          ? {
              ...d,
              timeRanges: [...d.timeRanges, { startTime: "09:00", endTime: "10:00" }],
            }
          : d
      );
    });
  };

  const handleChangeTime = (
    day: string,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setAvailableTimes((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              timeRanges: d.timeRanges.map((t, i) =>
                i === index ? { ...t, [field]: value } : t
              ),
            }
          : d
      )
    );
  };

  const handleRemoveTime = (day: string, index: number) => {
    setAvailableTimes((prev) =>
      prev
        .map((d) =>
          d.day === day
            ? { ...d, timeRanges: d.timeRanges.filter((_, i) => i !== index) }
            : d
        )
        .filter((d) => d.timeRanges.length > 0)
    );
  };

  const handleClearDay = (day: string) => {
    setAvailableTimes((prev) => prev.filter((d) => d.day !== day));
  };

  return (
    <div className="mainContainer">
      <div className="mainContainer_body">
        <div className="page1Div">
          <div className="questExplain">
            <h3>학습 가능 시간</h3>
            <p>요일별로 + 버튼을 눌러 시간대를 추가하세요.</p>
          </div>

          <div className="availableTimeForm">
            {DAYS.map((day) => {
              const dayData = availableTimes.find((d) => d.day === day);
              return (
                <div key={day} className="dayRow" style={{ marginBottom: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ width: 24 }}>{day}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        ensureDay(day);
                        handleAddTime(day);
                      }}
                    >
                      +
                    </button>
                    {dayData && dayData.timeRanges.length > 0 && (
                      <button type="button" onClick={() => handleClearDay(day)}>
                        전체삭제
                      </button>
                    )}
                  </div>

                  <div className="timeInputs">
                    {dayData?.timeRanges.map((tr, i) => (
                      <div key={i} className="timeRange">
                        <ConfirmTimeInput
                          value={tr.startTime}
                          onChange={(v) => handleChangeTime(day, i, "startTime", v)}
                        />
                        <span>~</span>
                        <ConfirmTimeInput
                          value={tr.endTime}
                          onChange={(v) => handleChangeTime(day, i, "endTime", v)}
                        />
                        <button type="button" onClick={() => handleRemoveTime(day, i)}>
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 12 }}>
            {totalRanges === 0 ? (
              <small style={{ color: "#d00" }}>최소 1개 이상의 학습 가능 시간을 추가해주세요.</small>
            ) : (
              <small>총 {totalRanges}개의 시간대를 선택했습니다.</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanSurvey1Page;
