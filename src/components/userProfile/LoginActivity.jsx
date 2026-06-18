import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useSelector } from "react-redux";
import { Tooltip as MuiTooltip } from "@mui/material";

const LoginActivity = () => {
  const rawData = useSelector((state) => state.personDetail.loginInfo);

  const legendLabels = [
    { color: "#ebedf0", label: "0 hr" },
    { color: "#9be9a8", label: "1 hr" },
    { color: "#40c463", label: "3–4 hr" },
    { color: "#30a14e", label: "5–6 hr" },
    { color: "#216e39", label: "7+ hr" },
  ];

  const today = new Date();

  const rangeStart = new Date(today);
  rangeStart.setMonth(rangeStart.getMonth() - 6);
  rangeStart.setHours(0, 0, 0, 0);

  const rangeEnd = new Date(today);
  rangeEnd.setDate(rangeEnd.getDate());
  rangeEnd.setHours(0, 0, 0, 0);

  const toDateString = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const generateFullRange = () => {
    const entries = [];
    const cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      entries.push({ date: toDateString(cursor), count: 0, level: 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    return entries;
  };

  const mergeWithRange = (entries) => {
    const baseMap = {};
    generateFullRange().forEach((e) => (baseMap[e.date] = e));
    entries
      .filter(({ date }) => {
        const d = new Date(date);
        return d >= rangeStart && d <= rangeEnd;
      })
      .forEach((e) => {
        if (baseMap[e.date]) baseMap[e.date] = e;
      });
    return Object.values(baseMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const rawEntries = Array.isArray(rawData) && rawData.length > 0 ? rawData : [];
  const data = mergeWithRange(rawEntries);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-sm dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-3">
      <ActivityCalendar
        data={data}
        blockSize={14}
        blockMargin={4}
        fontSize={12}
        style={{ width: "100%" }}
        theme={{
          light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }}
        colorScheme="light"
        renderBlock={(block, activity) => (
          <MuiTooltip
            title={`${activity.count} hours on ${activity.date}`}
            arrow
            placement="top"
          >
            {block}
          </MuiTooltip>
        )}
        renderColorLegend={(block, level) => {
          const legend = legendLabels[level];
          return (
            <MuiTooltip
              title={legend ? legend.label : `Level ${level}`}
              arrow
              placement="top"
            >
              {block}
            </MuiTooltip>
          );
        }}
      />
    </div>
  );
};

export default LoginActivity;