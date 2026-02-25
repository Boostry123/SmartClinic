import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Doctor } from "../api/types/doctors";
import { useAppointmentsForDoctor } from "../hooks/useAppointments";
import type { DateSelectArg, DateUnselectArg } from "@fullcalendar/core";
import type { EventDragStopArg } from "@fullcalendar/interaction";

interface Props {
  doctor?: Doctor;
  treatmentDuration?: number; // in minutes
  onSlotSelect: (startTime: string) => void;
  excludedDates?: string[];
  selectAble: boolean;
}

const CreateAppointmentCalendar = ({
  doctor,
  treatmentDuration = 30,
  onSlotSelect,
  selectAble = false,
}: Props) => {
  //get the future appointments of the given doctor

  const {
    data: existingAppointments,
    isLoading,
    isError,
  } = useAppointmentsForDoctor({ doctor_id: doctor ? doctor.id : undefined });

  const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  const handleSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    const startTime = selectInfo.start;
    const endTime = addMinutes(startTime, treatmentDuration);

    // Check for overlaps with the forced duration
    const isOverlapping = calendarApi.getEvents().some((event) => {
      if (event.id === "new-appointment" || event.display === "background")
        return false;
      const eventStart = event.start;
      const eventEnd = event.end || event.start;
      if (!eventStart || !eventEnd) return false;
      return startTime < eventEnd && endTime > eventStart;
    });

    if (isOverlapping) {
      calendarApi.unselect();
      return;
    }

    // Clear previous selection highlight (triggers handleUnselect)
    calendarApi.unselect();

    calendarApi.addEvent({
      id: "new-appointment",
      title: "New Appointment",
      start: startTime,
      end: endTime,
      allDay: false,
      backgroundColor: "#4338CA",
      borderColor: "#4338CA",
      textColor: "#ffffff",
      editable: true,
      durationEditable: false,
    });

    onSlotSelect(selectInfo.startStr);
  };

  const handleUnselect = (arg: DateUnselectArg) => {
    const calendarApi = arg.view.calendar;
    const existingEvent = calendarApi.getEventById("new-appointment");
    if (existingEvent) {
      existingEvent.remove();
      onSlotSelect("");
    }
  };

  const handleEventDrop = (arg: EventDragStopArg) => {
    if (arg.event.id === "new-appointment") {
      onSlotSelect(arg.event.start?.toISOString() || "");
    }
  };

  const snapMinutes = treatmentDuration > 0 ? treatmentDuration : 30;
  const snapDurationStr =
    snapMinutes >= 60
      ? `${String(Math.floor(snapMinutes / 60)).padStart(2, "0")}:${String(snapMinutes % 60).padStart(2, "0")}:00`
      : `00:${String(snapMinutes).padStart(2, "0")}:00`;
  // 1. Handle the state where no doctor is selected yet
  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-[550px] bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">
          Please select a doctor to view their availability.
        </p>
      </div>
    );
  }

  // 2. Handle the loading state while fetching the selected doctor's schedule
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[550px] bg-slate-50 rounded-xl">
        <p className="text-slate-500">Loading schedule...</p>
      </div>
    );
  }

  // 3. Handle any API errors
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[550px] bg-red-50 rounded-xl">
        <p className="text-red-500">Failed to load schedule.</p>
      </div>
    );
  } else {
    return (
      <div className="p-1 bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          height="550px"
          handleWindowResize={true}
          expandRows={true}
          stickyHeaderDates={true}
          slotEventOverlap={false}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today",
          }}
          titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
          // --- Key Duration Logic ---
          slotDuration="00:10:00"
          snapDuration={snapDurationStr}
          defaultTimedEventDuration="00:20:00" // Default for quick clicks
          forceEventDuration={true} // Prevents events from shrinking to slot size
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            omitZeroMinute: false,
            meridiem: "short",
          }}
          firstDay={0}
          hiddenDays={[6]}
          businessHours={{
            daysOfWeek: [0, 1, 2, 3, 4, 5],
            startTime: "08:00",
            endTime: "18:00",
          }}
          selectConstraint="businessHours"
          selectable={selectAble}
          selectOverlap={false}
          eventOverlap={false}
          selectMirror={true} // Shows a "ghost" event of the correct size while dragging
          unselectAuto={true}
          select={handleSelect}
          unselect={handleUnselect}
          eventDrop={handleEventDrop}
          events={existingAppointments}
          eventClassNames="rounded-md border-none shadow-sm text-xs font-medium px-1 cursor-pointer"
          eventBackgroundColor="#E0E7FF"
          eventTextColor="#4338CA"
          eventDisplay="block"
          editable={true} // Allows dragging existing apps
          eventDurationEditable={false} // Allows resizing existing apps
        />
      </div>
    );
  }
};

export default CreateAppointmentCalendar;
