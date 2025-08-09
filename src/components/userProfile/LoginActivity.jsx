import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useSelector } from "react-redux";

const LoginActivity = () => {
  const rawData = useSelector((state) => state.personDetail.loginInfo);
  const data =
    Array.isArray(rawData) && rawData.length > 0
      ? rawData
      : [
          {
            date: "2025-08-23",
            count: 2,
            level: 1,
          },
          {
            date: "2025-01-23",
            count: 2,
            level: 1,
          },
        ];

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-sm  dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-3">
      <ActivityCalendar
        data={data}
        theme={{
          light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }}
        colorScheme="light" // or "dark" based on your app theme
      />
    </div>
  );
};

export default LoginActivity;
