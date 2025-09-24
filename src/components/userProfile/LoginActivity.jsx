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

  const data =
    Array.isArray(rawData) && rawData.length > 0
      ? rawData
      : [
          { date: "2025-08-23", count: 2, level: 1 },
          { date: "2025-01-23", count: 2, level: 1 },
        ];

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-sm dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-3">
      <ActivityCalendar
        data={data}
        theme={{
          light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }}
        colorScheme="light"
        // Tooltip for each activity square
        renderBlock={(block, activity) => (
          <MuiTooltip
            title={`${activity.count} hours on ${activity.date}`}
            arrow
            placement="top"
          >
            {block}
          </MuiTooltip>
        )}
        // Tooltip for each legend square
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
