import React, { useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  INITIAL_EVENTS,
  createEventId,
  formatHourNoDots,
  generateWeekendAvailability,
  generateWeekdayAvailability,
} from "../helperFunctions/event-utils";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import { Button } from "../components/ui/button";
import "../custom_css/fullcalendar.css";

// I would like this calendar to show my availablity live
// have people be able to book me on here
// have all the information be recorded
// a big fan of modals that pop up and shows the schedule for that day and the time slot selection
// a confirm booking. That sends an emails to me and them.

//https://github.com/yassir-jeraidi/full-calendar

// using this
//https://fullcalendar.io/docs

/*
My current schedulde is mondays to Friday im busy from 9am to 730pm. 
If im available on the weekdays from 730pm to 11pm 
and on the weekend im availabe from 3pm -11 pm on saturdays
and 12pm to 11pm on sundays. 

*/

// Tasks

//Completed 
// Display start and end times on the calendar
// fix the css for text overflow  
// make the events for work non-draggable and non overlapped with new events



// TODO: 
// a click will open a modal that will take in information
// Send info to backend and send email to Daniel

const MySchedule = () => {
  const [currentEvents, setCurrentEvents] = useState([]);

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    const { event } = clickInfo;

    if (event?.extendedProps?.locked) {
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  return (
    <div>
      <NavbarLoggedIn />

      <h1 className="mx-auto text-3xl font-medium my-10 ">Book a Tutor </h1>

      <div className="demo-app">
        <Sidebar currentEvents={currentEvents} />
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={false}
            dayMaxEventRows={2} // 👈 show exactly 2 rows
            weekends={true}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
          />
        </div>
      </div>
    </div>
  );
};

function renderEventContent(eventInfo) {
  const { event } = eventInfo;

  const startTime = event.start ? formatHourNoDots(event.start) : "";
  const endTime = event.end ? formatHourNoDots(event.end) : "";

  return (
    <div className="fc-custom-event mx-auto">
      <div className="fc-custom-time">
        {startTime}
        {endTime && ` – ${endTime}`}
      </div>

      {event.title === "Book me" ? (
        <div className="text-center mt-1">
          <span className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            {event.title}
          </span>
        </div>
      ) : (
        <div className="fc-custom-title text-center">{event.title}</div>
      )}
    </div>
  );
}


function Sidebar({ currentEvents }) {
  return (
    <div className="demo-app-sidebar">
      <div className="w-full flex flex-col justify-items-center mt-10">
        <img src="/smile_tutor.jpeg" className="mx-auto rounded-full w-20" />
        <h3 className="text-lg font-semibold">Daniel Keum</h3>
        <h3>Computer Engineer & Stem Tutor</h3>
      </div>

      <div className="demo-app-sidebar-section">
        <h2>Confirmed Bookings ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>

      <Button>Confirm Booking</Button>
    </div>
  );
}

function SidebarEvent({ event }) {
  const startTime = formatDate(event.start, {
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
  });

  const endTime = event.end
    ? formatDate(event.end, {
        hour: "numeric",
        minute: "2-digit",
        meridiem: "short",
      })
    : null;

  return (
    <li className="mb-2">
      <div className="font-semibold">
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>

      <div className="text-sm text-gray-700">
        {startTime}
        {endTime && ` – ${endTime}`}
      </div>

      <div className="italic">{event.title}</div>
    </li>
  );
}

export default MySchedule;
