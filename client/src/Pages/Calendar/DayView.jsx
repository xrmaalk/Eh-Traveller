import React, { useState } from "react";
import { format } from "date-fns";
import DeleteButton from "../../components/ReusableComponents/Delete";
function DayView({ selectedDate }) {
  //replace with actual events
  const [events, setEvents] = useState([
    { id: 1, hour: 9, event: "Meeting with team" },
    { id: 2, hour: 14, event: "Project presentation" },
    // Add more events as needed
  ]);

  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  const addEvent = (hour, event) => {
    const newEvent = { id: Date.now(), hour, event };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const editEvent = (id, updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === id ? updatedEvent : event))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <div className="dayView">
      <h2 className="selectedDate">
        Current Day: {format(selectedDate, "MMMM, d, yyyy")}
      </h2>
      <ol>
        {hours.map((hour) => (
          <li key={hour} className="dayView">
            {hour}:00
            {events
              .filter((event) => event.hour === hour)
              .map((event) => (
                <div key={event.id}>
                  {event.event}
                  <button onClick={() => deleteEvent(event.id)}>Delete</button>
                </div>
              ))}
          </li>
        ))}
      </ol>
      {/* Add form for adding events */}
    </div>
  );
}
export default DayView;
