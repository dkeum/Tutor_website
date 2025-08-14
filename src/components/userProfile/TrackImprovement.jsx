import React, { useRef, useEffect, useState } from "react";

import NavbarLoggedIn from "../NavbarLoggedIn";
import { Button } from "@/components/ui/button";

import TrackingDottedGraph from "./TrackData/TrackingDottedGraph";
import TrackingLoggedInActivtiy_Progress from "./TrackData/TrackingLoggedInActivtiy_Progress";
import TopicMastery from "./TrackData/TopicMastery";
import { useDispatch } from "react-redux";
import { setQuestions } from "../../features/auth/personDetails";
import axios from "axios"; // ✅ Make sure this is at the top


const temp_data = [
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
  { date: "2025-09-14T10:00:00Z", grade: "40.00" },
];

const TrackImprovement = () => {
  const graphContainerRef = useRef();
  const [width, setWidth] = useState(600);
  const [filterType, setFilterType] = useState("week");
  const [graphOption, setGraphOption] = useState(1);
  const [data, setData] = useState(temp_data);
  


  const dispatch = useDispatch();

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

    return data.filter(
      (d) => new Date(d.date) >= startDate && new Date(d.date) <= latestDate
    );
  };

  const filteredData = getFilteredData();

  useEffect(() => {
    const getQuestions_Data = async () => {
   
        const response = await axios.get(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? `http://localhost:3000/questions/get-questions`
            : `https://mathamagic-backend.vercel.app/questions/get-questions`,
          { withCredentials: true }
        );
  
        // console.log("get question data");
        // console.log(response.data);
          
        const my_data = response.data?.mark_section
        dispatch(setQuestions(my_data));
        // console.log(my_data)
  
        // For the graph, keep only date & grade
        setData(my_data);
  
    };
  
    getQuestions_Data();
  
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

  const items = [
    {
      item: (
        <div className="h-full">
          <h2 className="mb-4 text-lg font-semibold">
            Grades for {graphTitleMap[filterType]}
          </h2>
          <TrackingDottedGraph
            data={filteredData}
            width={width}
            filterType={filterType}
          />
        </div>
      ),
      topic: "Average Grade Over Time",
      img_src:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAk1BMVEX////x9PT/AAD6+/vZ3N7P09b4ubPu7/DV2NvL0NPj5ef/+vr1l43//fzzgnb3sar6zsr96ef74d7+9fT2oZjzfG/xYVD5x8P97uzybV70h3v729j4vrjxaFjydGb/Z2Crsrf/ubb+h4L2kIb3qaO+w8f/o5/+dnD+jonwWEX/rKr9WVHwTDX/bWf/Jxj/mZb/Rz6Qgu1yAAAD0UlEQVR4nO2bi3KiMBRAxQQJQQUEBAtSW7Bq99H9/69bH3QVN4S81M7uPTOd4hUuZ0IMN0EHAwAAAAAAAAAAAAAAAAAAgH8Ox6HUwgg7jxa5hBKMXWu199q/sCz0aJ8jFiUuJcTGzcvH2rABKVFAShSQEsWw1EtoIotZqdnw1UQao1JFklYm8piUipNoENcGEhmUSg6t5M0j/UzGpGbz4vi/NtBUpqTyeXrayOb6yQxJjebZn82xSgLqUnv/Z1KqTs49yVtmnD27wGtyLvJMSEVJq3GUmsohjm2Rphw2IPX2VrReqzXVJfpS0XBzFdEeQfWlxul1w0wWmndAbanR09+xlBGTQVcqX3iMaDnTSqopNVnmrHA+1cqqKVX57HjScvXCiVRWPamiq0WC5LztBdthIJVWSyqcd45I00YjC56WcbC5n5S3YHaoI7Nyf8Uyf1rGwf6TEO1YH4ebSI15VYqfBmXph42M3CChIRWUvHffh2+X40IpcwHVpcIlt8YM31tXbCZTZqlLlanU7j0VKXKQM3CahSlVqYkfSx7BHmY/ITbFLtZcn9p8kz0iTXjv2i6ha3qUUi7yws11vdLPeMR503IQRbSxUZOafVeo46Kd6OxLSSpQcdrflEQHKxWpdKdY75bcvn5GQWq0UJ0EZ4LTZ3mpmlnWiSG40iAtNa7kaqMWXpWLHN0r9aM9f6r0Zirbocicok8q+rlNkjpo+sIk0Vy+CD5EelWfVFF70ayolol/KGl1nQTpkcrmTa+e+Un8/EuugFSmR6q66FHeq/ytRQ2+VM6t424GVypaGlmBloYrVcvWTBo4yEKWQJEnelcwgbOiZI3JYZNfT0kV+5rgFf4s8rgtpbt2Igca0AHtv3y7x/TyAU+q4lWvt6VTKl/eU6NNpxR/RnRbuqTUlugN0SElNcs2TodU/LhePriUeh/G1Tiu/SIIguHHA5UupPztc54HaVr4dTy6qoHvTSMVLow8ZzXESarY3fE2189BKps+qU/lbsFeKt89tgf9jeVVyrNwk1DbcZF9et4Xvjz5GjNecyBMrBU6PhlFr8MH3uIuIWvqfj5DztKv1cVP/A/fCjIDSIkCUqKAlCggJQpIifKlpKyr/18BBxv9+psZMCWnBSrHYsGOdoSlduY1AqLcX4OwD0XsX2l0nIcd1rgyHb8RYYdN7AwAt+VmfZf5UUUiHR3ZhDU0ILpm7e0SVpSuKSuMV4zz72eczMztsxPKzMhUtdYuU+rzazPtzNhmDEmUYmaOqxMxnRBbtaPtKTNsMS9Bx84AAAAAAACAIr8BvlYlqMfhLeQAAAAASUVORK5CYII=",
      option: 1,
    },
    {
      item: (
        <div className="h-full">
          <h2 className="mb-4 text-lg font-semibold">
            Completion Progress & Time Spent
          </h2>
          <TrackingLoggedInActivtiy_Progress filterType={filterType} />
        </div>
      ),
      topic: "Completion Progress & Time Commitment",
      img_src:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAk1BMVEX////x9PT/AAD6+/vZ3N7P09b4ubPu7/DV2NvL0NPj5ef/+vr1l43//fzzgnb3sar6zsr96ef74d7+9fT2oZjzfG/xYVD5x8P97uzybV70h3v729j4vrjxaFjydGb/Z2Crsrf/ubb+h4L2kIb3qaO+w8f/o5/+dnD+jonwWEX/rKr9WVHwTDX/bWf/Jxj/mZb/Rz6Qgu1yAAAD0UlEQVR4nO2bi3KiMBRAxQQJQQUEBAtSW7Bq99H9/69bH3QVN4S81M7uPTOd4hUuZ0IMN0EHAwAAAAAAAAAAAAAAAAAAgH8Ox6HUwgg7jxa5hBKMXWu199q/sCz0aJ8jFiUuJcTGzcvH2rABKVFAShSQEsWw1EtoIotZqdnw1UQao1JFklYm8piUipNoENcGEhmUSg6t5M0j/UzGpGbz4vi/NtBUpqTyeXrayOb6yQxJjebZn82xSgLqUnv/Z1KqTs49yVtmnD27wGtyLvJMSEVJq3GUmsohjm2Rphw2IPX2VrReqzXVJfpS0XBzFdEeQfWlxul1w0wWmndAbanR09+xlBGTQVcqX3iMaDnTSqopNVnmrHA+1cqqKVX57HjScvXCiVRWPamiq0WC5LztBdthIJVWSyqcd45I00YjC56WcbC5n5S3YHaoI7Nyf8Uyf1rGwf6TEO1YH4ebSI15VYqfBmXph42M3CChIRWUvHffh2+X40IpcwHVpcIlt8YM31tXbCZTZqlLlanU7j0VKXKQM3CahSlVqYkfSx7BHmY/ITbFLtZcn9p8kz0iTXjv2i6ha3qUUi7yws11vdLPeMR503IQRbSxUZOafVeo46Kd6OxLSSpQcdrflEQHKxWpdKdY75bcvn5GQWq0UJ0EZ4LTZ3mpmlnWiSG40iAtNa7kaqMWXpWLHN0r9aM9f6r0Zirbocicok8q+rlNkjpo+sIk0Vy+CD5EelWfVFF70ayolol/KGl1nQTpkcrmTa+e+Un8/EuugFSmR6q66FHeq/ytRQ2+VM6t424GVypaGlmBloYrVcvWTBo4yEKWQJEnelcwgbOiZI3JYZNfT0kV+5rgFf4s8rgtpbt2Igca0AHtv3y7x/TyAU+q4lWvt6VTKl/eU6NNpxR/RnRbuqTUlugN0SElNcs2TodU/LhePriUeh/G1Tiu/SIIguHHA5UupPztc54HaVr4dTy6qoHvTSMVLow8ZzXESarY3fE2189BKps+qU/lbsFeKt89tgf9jeVVyrNwk1DbcZF9et4Xvjz5GjNecyBMrBU6PhlFr8MH3uIuIWvqfj5DztKv1cVP/A/fCjIDSIkCUqKAlCggJQpIifKlpKyr/18BBxv9+psZMCWnBSrHYsGOdoSlduY1AqLcX4OwD0XsX2l0nIcd1rgyHb8RYYdN7AwAt+VmfZf5UUUiHR3ZhDU0ILpm7e0SVpSuKSuMV4zz72eczMztsxPKzMhUtdYuU+rzazPtzNhmDEmUYmaOqxMxnRBbtaPtKTNsMS9Bx84AAAAAAACAIr8BvlYlqMfhLeQAAAAASUVORK5CYII=",
      option: 2,
    },
    {
      item: (
        <div className="h-full">
          <h2 className="mb-4 text-lg font-semibold">Topic Mastery</h2>
          <TopicMastery />
        </div>
      ),
      topic: "Grades for each Topic",
      img_src:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAk1BMVEX////x9PT/AAD6+/vZ3N7P09b4ubPu7/DV2NvL0NPj5ef/+vr1l43//fzzgnb3sar6zsr96ef74d7+9fT2oZjzfG/xYVD5x8P97uzybV70h3v729j4vrjxaFjydGb/Z2Crsrf/ubb+h4L2kIb3qaO+w8f/o5/+dnD+jonwWEX/rKr9WVHwTDX/bWf/Jxj/mZb/Rz6Qgu1yAAAD0UlEQVR4nO2bi3KiMBRAxQQJQQUEBAtSW7Bq99H9/69bH3QVN4S81M7uPTOd4hUuZ0IMN0EHAwAAAAAAAAAAAAAAAAAAgH8Ox6HUwgg7jxa5hBKMXWu199q/sCz0aJ8jFiUuJcTGzcvH2rABKVFAShSQEsWw1EtoIotZqdnw1UQao1JFklYm8piUipNoENcGEhmUSg6t5M0j/UzGpGbz4vi/NtBUpqTyeXrayOb6yQxJjebZn82xSgLqUnv/Z1KqTs49yVtmnD27wGtyLvJMSEVJq3GUmsohjm2Rphw2IPX2VrReqzXVJfpS0XBzFdEeQfWlxul1w0wWmndAbanR09+xlBGTQVcqX3iMaDnTSqopNVnmrHA+1cqqKVX57HjScvXCiVRWPamiq0WC5LztBdthIJVWSyqcd45I00YjC56WcbC5n5S3YHaoI7Nyf8Uyf1rGwf6TEO1YH4ebSI15VYqfBmXph42M3CChIRWUvHffh2+X40IpcwHVpcIlt8YM31tXbCZTZqlLlanU7j0VKXKQM3CahSlVqYkfSx7BHmY/ITbFLtZcn9p8kz0iTXjv2i6ha3qUUi7yws11vdLPeMR503IQRbSxUZOafVeo46Kd6OxLSSpQcdrflEQHKxWpdKdY75bcvn5GQWq0UJ0EZ4LTZ3mpmlnWiSG40iAtNa7kaqMWXpWLHN0r9aM9f6r0Zirbocicok8q+rlNkjpo+sIk0Vy+CD5EelWfVFF70ayolol/KGl1nQTpkcrmTa+e+Un8/EuugFSmR6q66FHeq/ytRQ2+VM6t424GVypaGlmBloYrVcvWTBo4yEKWQJEnelcwgbOiZI3JYZNfT0kV+5rgFf4s8rgtpbt2Igca0AHtv3y7x/TyAU+q4lWvt6VTKl/eU6NNpxR/RnRbuqTUlugN0SElNcs2TodU/LhePriUeh/G1Tiu/SIIguHHA5UupPztc54HaVr4dTy6qoHvTSMVLow8ZzXESarY3fE2189BKps+qU/lbsFeKt89tgf9jeVVyrNwk1DbcZF9et4Xvjz5GjNecyBMrBU6PhlFr8MH3uIuIWvqfj5DztKv1cVP/A/fCjIDSIkCUqKAlCggJQpIifKlpKyr/18BBxv9+psZMCWnBSrHYsGOdoSlduY1AqLcX4OwD0XsX2l0nIcd1rgyHb8RYYdN7AwAt+VmfZf5UUUiHR3ZhDU0ILpm7e0SVpSuKSuMV4zz72eczMztsxPKzMhUtdYuU+rzazPtzNhmDEmUYmaOqxMxnRBbtaPtKTNsMS9Bx84AAAAAAACAIr8BvlYlqMfhLeQAAAAASUVORK5CYII=",
      option: 3,
    },
  ];

  return (
    <div>
      <NavbarLoggedIn />
      <div
        id="divContainer"
        className="grid grid-cols-3 min-h-[500px] gap-4 max-w-6xl mx-auto"
      >
        <div
          ref={graphContainerRef}
          className="col-span-2 border rounded-lg p-10 flex flex-col justify-center items-center"
        >
          {/* Filter Buttons */}
          <div className="flex flex-row justify-end gap-x-4 mb-4">
            {["week", "month", "year"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
              >
                {graphTitleMap[type]}
              </Button>
            ))}
          </div>

          {items
            .filter((i) => i.option === graphOption)
            .map((i) => (
              <div key={i.id +1}>{i.item}</div>
            ))}
        </div>
        <div className="border rounded-lg p-4 flex flex-col justify-around gap-4">
          {items
            .filter((i) => i.option !== graphOption) // keep only non-matching items
            .map((i) => (
              <div
                key={i.option} // or i.id if available
                className="border rounded-lg py-4 items-center flex flex-col"
                onClick={() => setGraphOption(i.option)}
              >
                <p className="text-xl font-bold">Option: {i.option}</p>
                <img src={i.img_src} alt={i.topic} />
                <p>{i.topic}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TrackImprovement;
