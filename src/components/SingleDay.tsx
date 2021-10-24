import React, { useState, useContext, useEffect, FC } from "react";
import DayDetails from "./DayDetails";
import { DateContext } from "../context/dateContext";
import { TasksContext, defaultTasks } from "../context/tasksContext";

interface Props {
  day: number;
  month: number;
  year: number;
}

interface Task {
  id: number;
  title: string;
  text: string;
  time: string;
  priority: boolean;
}

const SingleDay: FC<Props> = ({ day, month, year }: Props) => {
  const [tasks, setTasks] = useState<Array<Task>>(defaultTasks.tasks);
  const [showDayDetails, setShowDayDetails] = useState<boolean>(
    defaultTasks.showDayDetails
  );
  const [freeDay, setFreeDay] = useState(defaultTasks.freeDay);
  const { date, width } = useContext(DateContext);

  const customId = month === 10 || month === 11 || month === 12 ? "ab" : "";

  let newDate: Date = new Date();
  let actualMonth: number = newDate.getMonth() + 1;
  let actualYear: number = newDate.getFullYear();

  const sortedTasks: Array<Task> = tasks.filter((task: Task) => !task.priority);
  const prioTasks: Array<Task> = tasks.filter((task: Task) => task.priority);
  for (let i = 0; i < prioTasks.length; i++) {
    sortedTasks.unshift(prioTasks[i]);
  }

  useEffect(() => {
    const data = localStorage.getItem(`tasks${day}${month}${year}`);
    if (data) {
      setTasks(JSON.parse(data));
    }
  }, [day, month, year]);

  useEffect(() => {
    localStorage.setItem(`tasks${day}${month}${year}`, JSON.stringify(tasks));
  });

  useEffect(() => {
    const data = localStorage.getItem(`free${day}${month}${year}`);
    if (data) {
      setFreeDay(JSON.parse(data));
    }
  }, [day, month, year]);

  useEffect(() => {
    localStorage.setItem(`free${day}${month}${year}`, JSON.stringify(freeDay));
  });

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        showDayDetails,
        setShowDayDetails,
        freeDay,
        setFreeDay,
      }}
    >
      <div
        className="day-wrapper"
        onClick={() => setShowDayDetails((prevState: boolean) => !prevState)}
        id={`a${day}${month}${customId}`}
        style={{
          backgroundColor:
            (freeDay ? "#5BD442" : "") || (tasks.length >= 1 ? "#4287D4" : ""),
        }}
      >
        <div className="day-number">
          <h2
            className={
              day === date.date &&
              month === actualMonth &&
              actualYear === date.year
                ? "today"
                : ""
            }
          >
            {day}
          </h2>
        </div>
        <div className="tasks">
          {width > 650 &&
            sortedTasks.length > 0 &&
            sortedTasks.slice(0, width < 800 ? 1 : 2).map((task: Task) => (
              <p
                key={task.id}
                style={{ color: task.priority ? "#E72020" : "" }}
              >
                {width < 865 ? "" : task.time} {task.title}
              </p>
            ))}
          {width > 650 && tasks.length > (width < 800 ? 1 : 2) ? (
            <p>{tasks.length - (width <= 800 ? 1 : 2)} więcej zadania...</p>
          ) : null}
          {width <= 650 && tasks.length >= 1 ? (
            <p className="tasksNum">Ilość zadań: {tasks.length}</p>
          ) : null}
        </div>
      </div>
      {showDayDetails && <DayDetails day={day} month={month} />}
    </TasksContext.Provider>
  );
};

export default SingleDay;
