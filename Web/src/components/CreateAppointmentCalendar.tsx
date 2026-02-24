import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Appointment } from "../api/types/appointments";
import type { Doctor } from "../api/types/doctors";
import { DateTime } from "luxon";

interface Props {
  doctor?: Doctor;
  treatmentDuration?: number; // in minutes
  onSlotSelect: (startTime: string) => void;
  existingAppointments?: Appointment[];
  excludedDates?: string[];
}

const CreateAppointmentCalendar = ({
  treatmentDuration = 30,
  onSlotSelect,
  existingAppointments = [],
}: Props) => {
  // Handle the click/drag on the calendar
  const handleSelect = (selectionInfo: { startStr: string }) => {
    const isoString = selectionInfo.startStr;
    onSlotSelect(isoString);
    console.log("Selected Start Time:", isoString);
  };

  // Demo events if existingAppointments is empty
  const events =
    existingAppointments.length > 0
      ? existingAppointments.map((app) => ({
          id: app.id,
          start: app.start_time,
          end: app.end_time,
          title: "Busy",
          backgroundColor: "#ef4444",
          borderColor: "#ef4444",
        }))
      : [
          {
            title: "Lunch Break",
            start: DateTime.now().set({ hour: 13, minute: 0 }).toISO(),
            end: DateTime.now().set({ hour: 14, minute: 0 }).toISO(),
            display: "background",
            color: "#ff9f89",
          },
        ];

  const snapMinutes = treatmentDuration > 0 ? treatmentDuration : 30;
  const snapDurationStr =
    snapMinutes >= 60
      ? `${String(Math.floor(snapMinutes / 60)).padStart(2, "0")}:${String(snapMinutes % 60).padStart(2, "0")}:00`
      : `00:${String(snapMinutes).padStart(2, "0")}:00`;

  return (
    <div className="p-1 bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        // --- Layout & Styling ---
        height="550px"
        handleWindowResize={true}
        expandRows={true}
        stickyHeaderDates={true}
        slotEventOverlap={false} // Prevents messy stacking
        // --- Header Customization ---
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today",
        }}
        titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
        // --- Time Grid Logic ---
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        slotDuration="00:15:00"
        snapDuration={snapDurationStr}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: false,
          meridiem: "short",
        }}
        // --- Working Hours & Days ---
        firstDay={0} // Starts the week on Sunday
        hiddenDays={[6]} // Hide Saturday
        businessHours={{
          daysOfWeek: [0, 1, 2, 3, 4, 5],
          startTime: "08:00",
          endTime: "18:00",
        }}
        selectConstraint="businessHours"
        // --- Selection & Interaction ---
        selectable={true}
        selectOverlap={false}
        selectMirror={true}
        unselectAuto={true}
        select={handleSelect}
        // --- Appearance ---
        events={events}
        eventClassNames="rounded-md border-none shadow-sm text-xs font-medium px-1 cursor-not-allowed"
        eventBackgroundColor="#E0E7FF" // Light Indigo for existing apps
        eventTextColor="#4338CA" // Darker Indigo text
        eventDisplay="block"
      />
    </div>
  );
};

export default CreateAppointmentCalendar;
