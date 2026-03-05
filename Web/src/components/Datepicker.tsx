import { useState, useRef, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import { DateTime } from "luxon";

interface DateFilterProps {
  start_date: string;
  isOpen: boolean;
  onToggle: () => void;
  onDateChange: (date: string) => void;
  onClose: () => void;
}

const DatePicker = ({
  start_date,
  isOpen,
  onToggle,
  onDateChange,
  onClose,
}: DateFilterProps) => {
  const parsedStartDate = useMemo(() => {
    if (start_date) {
      const attemptedParse = DateTime.fromISO(start_date);
      if (attemptedParse.isValid) {
        return attemptedParse;
      }
      console.error(
        `DateFilter expected an ISO string but received: "${start_date}"`,
      );
    }
    return DateTime.now();
  }, [start_date]);

  const [viewDate, setViewDate] = useState<DateTime>(parsedStartDate);

  useEffect(() => {
    setViewDate(parsedStartDate);
  }, [parsedStartDate]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handlePrevMonth = () => setViewDate(viewDate.minus({ months: 1 }));
  const handleNextMonth = () => setViewDate(viewDate.plus({ months: 1 }));

  const handleTodayClick = () => {
    const today = DateTime.now();
    const formattedDate = today.toISODate();

    if (formattedDate) {
      onDateChange(formattedDate);
      onClose();
    }
  };

  const generateCalendarDays = () => {
    const startOfMonth = viewDate.startOf("month");
    const daysInMonth = viewDate.daysInMonth;
    const startOffset = startOfMonth.weekday === 7 ? 0 : startOfMonth.weekday;

    const days = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    if (!daysInMonth) {
      return [
        <div key="no-days" className="col-span-7 text-center text-gray-500">
          No days
        </div>,
      ];
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = viewDate.set({ day: d });
      const isSelected = currentDate.hasSame(parsedStartDate, "day");
      const isToday = currentDate.hasSame(DateTime.now(), "day");

      let btnClass = "p-2 w-10 h-10 rounded-md transition-colors ";

      if (isSelected) {
        btnClass += "bg-indigo-600 text-white font-semibold";
      } else if (isToday) {
        btnClass +=
          "bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100";
      } else {
        btnClass += "hover:bg-gray-100 text-gray-800";
      }

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            const formattedDate = currentDate.toISODate();
            if (formattedDate) {
              onDateChange(formattedDate);
              onClose();
            }
          }}
          className={btnClass}
        >
          {d}
        </button>,
      );
    }

    return days;
  };

  return (
    <div className="space-y-2.5 relative w-[280px]" ref={containerRef}>
      <label className="text-black/70 text-sm font-medium">Select Date</label>

      <div className="relative">
        <div
          onClick={onToggle}
          className="flex items-center border rounded-md py-3 px-3.5 min-w-min border-black/10 bg-white shadow-sm text-black/70 relative cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <input
            type="text"
            value={start_date ? parsedStartDate.toFormat("dd/MM/yyyy") : ""}
            readOnly
            placeholder="DD/MM/YYYY"
            className="w-full bg-transparent outline-none text-black/70 text-base select-none cursor-pointer"
          />
          <div className="bg-gray-100 h-full w-10 flex items-center justify-center rounded-md absolute right-0 border-l border-black/10">
            <Calendar color="#3949AB" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 9h18M4.5 7.5v12.75A2.25 2.25 0 006.75 22.5h10.5a2.25 2.25 0 002.25-2.25V7.5"
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute border border-black/10 z-50 mt-1 bg-white shadow-lg rounded-md min-w-[280px] p-5 top-full left-0">
            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 border border-black/10 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-black/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div className="text-center font-semibold text-black/80 text-base">
                {viewDate.toFormat("MMMM yyyy")}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 border border-black/10 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-black/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-sm font-medium mb-2 text-gray-500">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>

            <div className="grid grid-cols-7 text-center text-sm gap-y-1">
              {generateCalendarDays()}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleTodayClick}
                className="bg-indigo-600 px-3 py-1.5 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
