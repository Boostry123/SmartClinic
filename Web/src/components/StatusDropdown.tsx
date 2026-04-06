import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  CalendarCheck,
  Loader,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../api/appointments";
import {
  type AppointmentStatus,
  AppointmentStatusEnum,
} from "../api/types/appointments";

interface StatusDropdownProps {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  appointmentId,
  currentStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const statuses = [
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

  useLayoutEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();

        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.right - 192 + window.scrollX,
        });
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = async (
    e: React.MouseEvent,
    newStatus: AppointmentStatus,
  ) => {
    e.stopPropagation();

    try {
      setIsLoading(true);

      await updateAppointment({
        id: appointmentId,
        status: newStatus,
      });

      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextOpen = !isOpen;

    if (nextOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192 + window.scrollX,
      });
    }

    setIsOpen(nextOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        disabled={isLoading}
        onClick={toggleDropdown}
        className={`p-1 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center ${isLoading ? "cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <Loader size={16} className="text-indigo-500 animate-spin" />
        ) : (
          <MoreVertical size={16} className="text-slate-400" />
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: dropdownPos.top,
              left: dropdownPos.left,
            }}
            className="mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-in fade-in zoom-in duration-75"
          >
            <div className="py-1">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => handleStatusChange(e, status.value)}
                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                    currentStatus === status.value
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-700 hover:text-indigo-600"
                  }`}
                >
                  <status.icon size={14} className={`mr-3 ${status.color}`} />
                  {status.label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default StatusDropdown;
