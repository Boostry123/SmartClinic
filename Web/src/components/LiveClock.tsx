import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Clock } from "lucide-react";
import { dateTimeStructure } from "../helpers/Dates";

const LiveClock = () => {
  const [formattedDate, setFormattedDate] = useState(
    DateTime.now().toFormat(dateTimeStructure),
  );

  useEffect(() => {
    let timeoutId: number | undefined;

    const syncTime = () => {
      const now = DateTime.now();
      setFormattedDate(now.toFormat(dateTimeStructure));

      // Calculate milliseconds until the exact start of the next minute
      const msUntilNextMinute = 60000 - (Date.now() % 60000);
      timeoutId = setTimeout(syncTime, msUntilNextMinute);
    };

    syncTime();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex items-center gap-2 text-indigo-700 transition-all duration-500 ease-in-out">
      {/* Small pulsing dot or icon adds to the "Live" feel */}
      <Clock className="w-5 h-5 opacity-80" />

      <h3 className="text-lg font-semibold tracking-tight mb-0">
        {formattedDate}
      </h3>

      {/* Optional: A tiny 'Live' indicator */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
      </span>
    </div>
  );
};

export default LiveClock;
