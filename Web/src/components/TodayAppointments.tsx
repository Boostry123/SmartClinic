import { DateTime } from "luxon";
import { Loader } from "lucide-react";
import useAppointments from "../hooks/useAppointments";
import type { Appointment } from "../api/types/appointments";

const TodayAppointments = () => {
  const startOfDay = DateTime.now().startOf("day").toISO();
  const endOfDay = DateTime.now().endOf("day").toISO();

  const {
    data: appointments,
    isLoading,
    isError,
  } = useAppointments({
    start_time: startOfDay,
    end_time: endOfDay,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500 font-medium">
        Error loading appointments.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
              Time
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
              Patient
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
              Doctor
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
              Treatment
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {appointments?.map((apt: Appointment) => (
            <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                {apt.start_time
                  ? DateTime.fromISO(apt.start_time).toFormat("HH:mm")
                  : "N/A"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {apt.patients?.first_name} {apt.patients?.last_name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 italic">
                {apt.doctors?.users
                  ? `Dr. ${apt.doctors.users.last_name}`
                  : "N/A"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                  {apt.notes || "General Checkup"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    apt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : apt.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {apt.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}

          {(!appointments || appointments.length === 0) && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-gray-500 text-sm"
              >
                No appointments for today. Take a coffee break! ☕
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAppointments;
