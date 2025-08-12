import React, { useRef, useEffect, useState } from "react";

import NavbarLoggedIn from "../NavbarLoggedIn";
import { Button } from "@/components/ui/button";

import TrackingDottedGraph from "./TrackData/TrackingDottedGraph";

const data = [
  { date: "2025-08-01T10:00:00Z", grade: "0.00" },
  { date: "2025-08-02T10:00:00Z", grade: "33.33" },
  { date: "2025-08-03T10:00:00Z", grade: "15.00" },
  { date: "2025-08-04T10:00:00Z", grade: "100.00" },
  { date: "2025-08-05T10:00:00Z", grade: "72.50" },
  { date: "2025-08-06T10:00:00Z", grade: "10.00" },
  { date: "2025-08-07T10:00:00Z", grade: "88.00" },
  { date: "2025-08-08T10:00:00Z", grade: "55.00" },
  { date: "2025-08-09T10:00:00Z", grade: "65.00" },
  { date: "2025-08-10T10:00:00Z", grade: "78.00" },
  { date: "2025-08-11T10:00:00Z", grade: "45.00" },
  { date: "2025-08-12T10:00:00Z", grade: "90.00" },
  { date: "2025-09-01T10:00:00Z", grade: "90.00" },
  { date: "2025-09-08T10:00:00Z", grade: "60.00" },
  { date: "2025-09-09T10:00:00Z", grade: "90.00" },
  { date: "2025-09-10T10:00:00Z", grade: "70.00" },
  { date: "2025-09-11T10:00:00Z", grade: "100.00" },
  { date: "2025-09-12T10:00:00Z", grade: "90.00" },
  { date: "2025-09-13T10:00:00Z", grade: "70.00" },
  { date: "2025-09-14T10:00:00Z", grade: "40.00" }
];

const TrackImprovement = () => {
  const graphContainerRef = useRef();
  const [width, setWidth] = useState(600);
  const [filterType, setFilterType] = useState("week");

  // Filter data based on selected range
  const getFilteredData = () => {
    if (data.length === 0) return [];

    const latestDate = new Date(data[data.length - 1].date);
    let startDate;

    if (filterType === "week") {
      startDate = new Date(latestDate);
      startDate.setDate(latestDate.getDate() - 6); // past 7 days
    } else if (filterType === "month") {
      startDate = new Date(latestDate);
      startDate.setMonth(latestDate.getMonth() - 1); // past month
    } else if (filterType === "year") {
      startDate = new Date(latestDate);
      startDate.setFullYear(latestDate.getFullYear() - 1); // past year
    }

    return data.filter(d => new Date(d.date) >= startDate && new Date(d.date) <= latestDate);
  };

  const filteredData = getFilteredData();

  useEffect(() => {
    const updateWidth = () => {
      if (graphContainerRef.current) {
        setWidth(Math.min(graphContainerRef.current.offsetWidth, 600));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Dynamic graph title based on filter
  const graphTitleMap = {
    week: "Past Week",
    month: "Past Month",
    year: "Past Year",
  };

  return (
    <div>
      <NavbarLoggedIn />
      <div id="divContainer" className="grid grid-cols-3 min-h-[500px] gap-4 max-w-6xl mx-auto">
        <div ref={graphContainerRef} className="col-span-2 border rounded-lg p-10 flex flex-col justify-center items-center">
          {/* Filter Buttons */}
          <div className="flex flex-row justify-end gap-x-4 mb-4">
            {["week", "month", "year"].map(type => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
              >
                {graphTitleMap[type]}
              </Button>
            ))}
          </div>
          <h2 className="mb-4 text-lg font-semibold">
            Grades for {graphTitleMap[filterType]}
          </h2>
          <TrackingDottedGraph data={filteredData} width={width} filterType={filterType} />
        </div>
        <div className="border rounded-lg p-4 flex flex-col justify-around gap-4">

          <div className="border rounded-lg" >
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAk1BMVEX////x9PT/AAD6+/vZ3N7P09b4ubPu7/DV2NvL0NPj5ef/+vr1l43//fzzgnb3sar6zsr96ef74d7+9fT2oZjzfG/xYVD5x8P97uzybV70h3v729j4vrjxaFjydGb/Z2Crsrf/ubb+h4L2kIb3qaO+w8f/o5/+dnD+jonwWEX/rKr9WVHwTDX/bWf/Jxj/mZb/Rz6Qgu1yAAAD0UlEQVR4nO2bi3KiMBRAxQQJQQUEBAtSW7Bq99H9/69bH3QVN4S81M7uPTOd4hUuZ0IMN0EHAwAAAAAAAAAAAAAAAAAAgH8Ox6HUwgg7jxa5hBKMXWu199q/sCz0aJ8jFiUuJcTGzcvH2rABKVFAShSQEsWw1EtoIotZqdnw1UQao1JFklYm8piUipNoENcGEhmUSg6t5M0j/UzGpGbz4vi/NtBUpqTyeXrayOb6yQxJjebZn82xSgLqUnv/Z1KqTs49yVtmnD27wGtyLvJMSEVJq3GUmsohjm2Rphw2IPX2VrReqzXVJfpS0XBzFdEeQfWlxul1w0wWmndAbanR09+xlBGTQVcqX3iMaDnTSqopNVnmrHA+1cqqKVX57HjScvXCiVRWPamiq0WC5LztBdthIJVWSyqcd45I00YjC56WcbC5n5S3YHaoI7Nyf8Uyf1rGwf6TEO1YH4ebSI15VYqfBmXph42M3CChIRWUvHffh2+X40IpcwHVpcIlt8YM31tXbCZTZqlLlanU7j0VKXKQM3CahSlVqYkfSx7BHmY/ITbFLtZcn9p8kz0iTXjv2i6ha3qUUi7yws11vdLPeMR503IQRbSxUZOafVeo46Kd6OxLSSpQcdrflEQHKxWpdKdY75bcvn5GQWq0UJ0EZ4LTZ3mpmlnWiSG40iAtNa7kaqMWXpWLHN0r9aM9f6r0Zirbocicok8q+rlNkjpo+sIk0Vy+CD5EelWfVFF70ayolol/KGl1nQTpkcrmTa+e+Un8/EuugFSmR6q66FHeq/ytRQ2+VM6t424GVypaGlmBloYrVcvWTBo4yEKWQJEnelcwgbOiZI3JYZNfT0kV+5rgFf4s8rgtpbt2Igca0AHtv3y7x/TyAU+q4lWvt6VTKl/eU6NNpxR/RnRbuqTUlugN0SElNcs2TodU/LhePriUeh/G1Tiu/SIIguHHA5UupPztc54HaVr4dTy6qoHvTSMVLow8ZzXESarY3fE2189BKps+qU/lbsFeKt89tgf9jeVVyrNwk1DbcZF9et4Xvjz5GjNecyBMrBU6PhlFr8MH3uIuIWvqfj5DztKv1cVP/A/fCjIDSIkCUqKAlCggJQpIifKlpKyr/18BBxv9+psZMCWnBSrHYsGOdoSlduY1AqLcX4OwD0XsX2l0nIcd1rgyHb8RYYdN7AwAt+VmfZf5UUUiHR3ZhDU0ILpm7e0SVpSuKSuMV4zz72eczMztsxPKzMhUtdYuU+rzazPtzNhmDEmUYmaOqxMxnRBbtaPtKTNsMS9Bx84AAAAAAACAIr8BvlYlqMfhLeQAAAAASUVORK5CYII=" />
              <p> Track Completion Progress and Time Commitment</p>
          </div>
          <div className="border rounded-lg" >
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAk1BMVEX////x9PT/AAD6+/vZ3N7P09b4ubPu7/DV2NvL0NPj5ef/+vr1l43//fzzgnb3sar6zsr96ef74d7+9fT2oZjzfG/xYVD5x8P97uzybV70h3v729j4vrjxaFjydGb/Z2Crsrf/ubb+h4L2kIb3qaO+w8f/o5/+dnD+jonwWEX/rKr9WVHwTDX/bWf/Jxj/mZb/Rz6Qgu1yAAAD0UlEQVR4nO2bi3KiMBRAxQQJQQUEBAtSW7Bq99H9/69bH3QVN4S81M7uPTOd4hUuZ0IMN0EHAwAAAAAAAAAAAAAAAAAAgH8Ox6HUwgg7jxa5hBKMXWu199q/sCz0aJ8jFiUuJcTGzcvH2rABKVFAShSQEsWw1EtoIotZqdnw1UQao1JFklYm8piUipNoENcGEhmUSg6t5M0j/UzGpGbz4vi/NtBUpqTyeXrayOb6yQxJjebZn82xSgLqUnv/Z1KqTs49yVtmnD27wGtyLvJMSEVJq3GUmsohjm2Rphw2IPX2VrReqzXVJfpS0XBzFdEeQfWlxul1w0wWmndAbanR09+xlBGTQVcqX3iMaDnTSqopNVnmrHA+1cqqKVX57HjScvXCiVRWPamiq0WC5LztBdthIJVWSyqcd45I00YjC56WcbC5n5S3YHaoI7Nyf8Uyf1rGwf6TEO1YH4ebSI15VYqfBmXph42M3CChIRWUvHffh2+X40IpcwHVpcIlt8YM31tXbCZTZqlLlanU7j0VKXKQM3CahSlVqYkfSx7BHmY/ITbFLtZcn9p8kz0iTXjv2i6ha3qUUi7yws11vdLPeMR503IQRbSxUZOafVeo46Kd6OxLSSpQcdrflEQHKxWpdKdY75bcvn5GQWq0UJ0EZ4LTZ3mpmlnWiSG40iAtNa7kaqMWXpWLHN0r9aM9f6r0Zirbocicok8q+rlNkjpo+sIk0Vy+CD5EelWfVFF70ayolol/KGl1nQTpkcrmTa+e+Un8/EuugFSmR6q66FHeq/ytRQ2+VM6t424GVypaGlmBloYrVcvWTBo4yEKWQJEnelcwgbOiZI3JYZNfT0kV+5rgFf4s8rgtpbt2Igca0AHtv3y7x/TyAU+q4lWvt6VTKl/eU6NNpxR/RnRbuqTUlugN0SElNcs2TodU/LhePriUeh/G1Tiu/SIIguHHA5UupPztc54HaVr4dTy6qoHvTSMVLow8ZzXESarY3fE2189BKps+qU/lbsFeKt89tgf9jeVVyrNwk1DbcZF9et4Xvjz5GjNecyBMrBU6PhlFr8MH3uIuIWvqfj5DztKv1cVP/A/fCjIDSIkCUqKAlCggJQpIifKlpKyr/18BBxv9+psZMCWnBSrHYsGOdoSlduY1AqLcX4OwD0XsX2l0nIcd1rgyHb8RYYdN7AwAt+VmfZf5UUUiHR3ZhDU0ILpm7e0SVpSuKSuMV4zz72eczMztsxPKzMhUtdYuU+rzazPtzNhmDEmUYmaOqxMxnRBbtaPtKTNsMS9Bx84AAAAAAACAIr8BvlYlqMfhLeQAAAAASUVORK5CYII=" />
            <p> Track Grades for each Topic</p>
          </div>
        </div>
      </div>
    </div>
  );
};





export default TrackImprovement;


