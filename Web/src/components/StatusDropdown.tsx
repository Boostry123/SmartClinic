import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import {
  type AppointmentStatus,
  AppointmentStatusEnum,
} from "../api/types/appointments";

interface StatusDropdownProps {
  currentStatus: AppointmentStatus;
  onStatusChange: (newStatus: AppointmentStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const statuses: {
    label: string;
    value: AppointmentStatus;
    icon: any;
    color: string;
  }[] = [
    {
      label: "Scheduled",
      value: AppointmentStatusEnum.SCHEDULED,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Confirmed",
      value: AppointmentStatusEnum.CONFIRMED,
      icon: CalendarCheck,
      color: "text-purple-600",
    },
    {
      label: "Checked In",
      value: AppointmentStatusEnum.CHECKED_IN,
      icon: UserCheck,
      color: "text-orange-600",
    },
    {
      label: "Completed",
      value: AppointmentStatusEnum.COMPLETED,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Cancelled",
      value: AppointmentStatusEnum.CANCELLED,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 160,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="p-1.5 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center border border-slate-200 shadow-sm bg-white"
      >
        <MoreVertical size={16} className="text-slate-500" />
      </button>

      {isOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            <div
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                width: "180px",
              }}
              className="z-[9999] rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5 overflow-hidden animate-in fade-in zoom-in duration-75"
            >
              <div className="py-1 bg-white">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(status.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-sm transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50 ${
                      currentStatus === status.value
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-700"
                    }`}
                  >
                    <status.icon size={16} className={`mr-3 ${status.color}`} />
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default StatusDropdown;
