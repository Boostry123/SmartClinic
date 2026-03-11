const UIconfig = {
  //CALENDAR
  //general hours
  slotMinTime: "08:00:00",
  slotMaxTime: "19:00:00",
  slotDuration: "00:10:00",
  BUSINESSHOURS: [
    {
      daysOfWeek: [0, 1, 2, 3, 4],
      startTime: "08:00",
      endTime: "18:00",
    },
    {
      daysOfWeek: [5],
      startTime: "8:00",
      endTime: "14:00",
    },
  ],
  hiddenDays: [6],

  //New Event
  newEvent: {
    id: "new-appointment",
    title: "New Appointment",
    backgroundColor: "#4338CA",
    borderColor: "#4338CA",
    textColor: "white",
    editable: true,
    durationEditable: false,
  },
  //Existing Event
  existingEvent: {
    backgroundColor: "#3949AB",
    borderColor: "#F88379",
    textColor: "white",
    editable: false,
  },
};

export default UIconfig;
