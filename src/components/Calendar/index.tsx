/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import type { ScheduleInstance } from "../../models/schedule";
import type { UserInstance } from "../../models/user";

import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import type { EventInput } from "@fullcalendar/core/index.js";

import "../profileCalendar.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

type CalendarContainerProps = {
  schedule: ScheduleInstance;
  auth: UserInstance;
};

const classes = [
  "bg-one",
  "bg-two",
  "bg-three",
  "bg-four",
  "bg-five",
  "bg-six",
  "bg-seven",
  "bg-eight",
  "bg-nine",
  "bg-ten",
  "bg-eleven",
  "bg-twelve",
  "bg-thirteen",
  "bg-fourteen",
  "bg-fifteen",
  "bg-sixteen",
  "bg-seventeen",
  "bg-eighteen",
  "bg-nineteen",
  "bg-twenty",
  "bg-twenty-one",
  "bg-twenty-two",
  "bg-twenty-three",
  "bg-twenty-four",
  "bg-twenty-five",
  "bg-twenty-six",
  "bg-twenty-seven",
  "bg-twenty-eight",
  "bg-twenty-nine",
  "bg-thirty",
  "bg-thirty-one",
  "bg-thirty-two",
  "bg-thirty-three",
  "bg-thirty-four",
  "bg-thirty-five",
  "bg-thirty-six",
  "bg-thirty-seven",
  "bg-thirty-eight",
  "bg-thirty-nine",
  "bg-forty",
];

const staffColors = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "brown",
  "cyan",
  "magenta",
  "teal",
  "lime",
  "indigo",
  "gold",
  "salmon",
  "navy",
  "turquoise",
];


const CalendarContainer = ({ schedule, auth }: CalendarContainerProps) => {
  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<EventInput[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  const [pairedDates, setPairedDates] = useState<{date: string, color: string}[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getPlugins = () => {
    const plugins = [dayGridPlugin];

    plugins.push(interactionPlugin);
    return plugins;
  };

  const getShiftById = (id: string) => {
    return schedule?.shifts?.find((shift: { id: string }) => id === shift.id);
  };

  const getAssigmentById = (id: string) => {
    return schedule?.assignments?.find((assign) => id === assign.id);
  };

  const validDates = () => {
    const dates = [];
    let currentDate = dayjs(schedule.scheduleStartDate);
    while (
      currentDate.isBefore(schedule.scheduleEndDate) ||
      currentDate.isSame(schedule.scheduleEndDate)
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    let current = dayjs(startDate);
    const end = dayjs(endDate);

    while (current.isSameOrBefore(end)) {
      dates.push(current.format("DD.MM.YYYY"));
      current = current.add(1, "day");
    }
  
    return dates;
  };

  const generateStaffBasedCalendar = () => {
    const works: EventInput[] = [];

    for (let i = 0; i < schedule?.assignments?.length; i++) {
      if (schedule?.assignments?.[i]?.staffId !== selectedStaffId) continue;

      const className = schedule?.shifts?.findIndex(
        (shift) => shift.id === schedule?.assignments?.[i]?.shiftId
      );

      const assignmentDate = dayjs
        .utc(schedule?.assignments?.[i]?.shiftStart)
        .format("YYYY-MM-DD");
      const isValidDate = validDates().includes(assignmentDate);

      const work = {
        id: schedule?.assignments?.[i]?.id,
        title: getShiftById(schedule?.assignments?.[i]?.shiftId)?.name,
        duration: "01:00",
        date: assignmentDate,
        staffId: schedule?.assignments?.[i]?.staffId,
        shiftId: schedule?.assignments?.[i]?.shiftId,
        className: `event ${classes[className]} ${
          getAssigmentById(schedule?.assignments?.[i]?.id)?.isUpdated
            ? "highlight"
            : ""
        } ${!isValidDate ? "invalid-date" : ""}`,
      };
      works.push(work);
    }

    const offDays = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    )?.offDays;

    const pairList = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    )?.pairList;


      const dates = getDatesBetween(schedule.scheduleStartDate,schedule.scheduleEndDate);

      let highlightedDates: string[] = [];
      let pairedDates: { date: string; color: string }[] = [];

      dates.forEach((date) => {
        const current = dayjs(date, "DD.MM.YYYY", true);
        const transformedDate = current.format("DD.MM.YYYY");

        // Off day kontrolü
        if (offDays?.includes(transformedDate)) {
          highlightedDates.push(transformedDate);
        }
      
        // Pair kontrolü
        pairList?.forEach((pair) => {
          const start = dayjs(pair.startDate, "DD.MM.YYYY", true);
          const end = dayjs(pair.endDate, "DD.MM.YYYY", true);
      
          if (current.isSameOrAfter(start) && current.isSameOrBefore(end)) {
            const staffIndex = schedule?.staffs?.findIndex(staff => staff.id === pair.staffId) ?? 0;
            const color = staffColors[staffIndex];
      
            pairedDates.push({
              date: transformedDate,
              color: color
            });
          }
        });
      });
      
    setHighlightedDates(highlightedDates);
    setPairedDates(pairedDates);
    setEvents(works);
  };

  useEffect(() => {
    setSelectedStaffId(schedule?.staffs?.[0]?.id);
    generateStaffBasedCalendar();
  }, [schedule]);

  useEffect(() => {
    generateStaffBasedCalendar();
  }, [selectedStaffId]);

  const RenderEventContent = ({ eventInfo }: any) => {
    return (
      <div className="event-content">
        <p>{eventInfo.event.title}</p>
      </div>
    );
  };

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      const staff = schedule?.staffs?.find(s => s.id === event.staffId);
      const shift = schedule?.shifts?.find(s => s.id === event.shiftId);

      setSelectedEvent({
        ...event,
        staffName: staff?.name,
        shiftName: shift?.name,
        startTime: dayjs(event.date as string).format('HH:mm'),
        endTime: dayjs(event.date as string).add(1, 'hour').format('HH:mm')
      });
      setShowEventDetails(true);
    }
  };

  const filteredStaffs = schedule?.staffs?.filter((staff: any) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="calendar-section">
      <div className="calendar-wrapper">
        <div className="staff-search">
          <input
            type="text"
            placeholder="Personel ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="staff-search-input"
          />
        </div>
        <div className="staff-list">
          {filteredStaffs?.map((staff: any, index: number) => (
            <div
              key={staff.id}
              onClick={() => setSelectedStaffId(staff.id)}
              className={`staff ${
                staff.id === selectedStaffId ? "active" : ""
              }`}
              style={{ borderLeft: `4px solid ${staffColors[index]}` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17-62.5t47-43.5q60-30 124.5-46T480-440q67 0 131.5 16T736-378q30 15 47 43.5t17 62.5v112H160Zm320-400q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm160 228v92h80v-32q0-11-5-20t-15-14q-14-8-29.5-14.5T640-332Zm-240-21v53h160v-53q-20-4-40-5.5t-40-1.5q-20 0-40 1.5t-40 5.5ZM240-240h80v-92q-15 5-30.5 11.5T260-306q-10 5-15 14t-5 20v32Zm400 0H320h320ZM480-640Z" />
              </svg>
              <span>{staff.name}</span>
            </div>
          ))}
        </div>
        {schedule?.scheduleStartDate && (
                  <FullCalendar
                  ref={calendarRef}
                  locale={auth.language}
                  plugins={getPlugins()}
                  contentHeight={400}
                  handleWindowResize={true}
                  selectable={true}
                  editable={false}
                  eventOverlap={true}
                  eventDurationEditable={false}
                  initialView="dayGridMonth"
                  initialDate={schedule?.scheduleStartDate}
                  events={events}
                  firstDay={1}
                  dayMaxEventRows={4}
                  fixedWeekCount={true}
                  showNonCurrentDates={true}
                  eventClick={handleEventClick}
                  eventContent={(eventInfo: any) => (
                    <RenderEventContent eventInfo={eventInfo} />
                  )}
                  datesSet={(info: any) => {
                    const prevButton = document.querySelector(
                      ".fc-prev-button"
                    ) as HTMLButtonElement;
                    const nextButton = document.querySelector(
                      ".fc-next-button"
                    ) as HTMLButtonElement;
        
                    const startDiff = dayjs(info.start)
                      .utc()
                      .diff(
                        dayjs(schedule.scheduleStartDate).subtract(1, "day").utc(),
                        "days"
                      );
                    const endDiff = dayjs(dayjs(schedule.scheduleEndDate)).diff(
                      info.end,
                      "days"
                    );
                    if (startDiff < 0 && startDiff > -35) prevButton.disabled = true;
                    else prevButton.disabled = false;
        
                    if (endDiff < 0 && endDiff > -32) nextButton.disabled = true;
                    else nextButton.disabled = false;
                  }}
                  dayCellContent={({ date }) => {
                    const found = validDates().includes(
                      dayjs(date).format("YYYY-MM-DD")
                    );
                    const isHighlighted = highlightedDates.includes(
                      dayjs(date).format("DD.MM.YYYY")
                    );

                    const currentDate = dayjs(date).format("DD.MM.YYYY");
                    const pairedDate = pairedDates.find(
                      pd => pd.date === currentDate
                    );

                    return (
                      <div
                        className={`${found ? "" : "date-range-disabled"} ${
                          isHighlighted ? "highlighted-date-orange" : ""
                        }`}
                        style={{
                          borderBottom: pairedDate ? `2px solid ${pairedDate.color}` : 'none'
                        }}
                      >
                        {dayjs(date).date()}
                      </div>
                    );
                  }}
                />
        )}
      </div>

      {showEventDetails && selectedEvent && (
        <div className="event-details-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowEventDetails(false)}>×</button>
            <h3 className="event-details-title">Etkinlik Detayları</h3>
            <div className="event-details">
              <p><strong>Personel:</strong> {selectedEvent.staffName}</p>
              <p><strong>Vardiya:</strong> {selectedEvent.shiftName}</p>
              <p><strong>Tarih:</strong> {dayjs(selectedEvent.date).format('MM.DD.YYYY')}</p>
              <p><strong>Başlangıç:</strong> {selectedEvent.startTime}</p>
              <p><strong>Bitiş:</strong> {selectedEvent.endTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarContainer;
