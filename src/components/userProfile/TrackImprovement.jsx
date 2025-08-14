import React, { useRef, useEffect, useState } from "react";

import NavbarLoggedIn from "../NavbarLoggedIn";
import { Button } from "@/components/ui/button";

import TrackingDottedGraph from "./TrackData/TrackingDottedGraph";
import TrackingLoggedInActivtiy_Progress from "./TrackData/TrackingLoggedInActivtiy_Progress";
import TopicMastery from "./TrackData/TopicMastery";
import { useSelector } from "react-redux";



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
  const data = useSelector((state) => state.personDetail.marks_section) || temp_data;
   


  // const dispatch = useDispatch();

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
        "https://github.com/dkeum/Tutor_website/blob/main/src/assets/track_improvement_1.png?raw=true",
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
        "https://github.com/dkeum/Tutor_website/blob/main/src/assets/track_improvement_2.png?raw=true",
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
        "https://github.com/dkeum/Tutor_website/blob/main/src/assets/track_improvement_3.png?raw=true",
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
          className="col-span-2 border rounded-lg p-10 flex flex-col justify-center items-center mt-10"
        >
          {/* Filter Buttons */}
          <div className="flex flex-row justify-end gap-x-4 mb-5">
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
              <div   key={i.id +1}>{i.item}</div>
            ))}
        </div>
        <div className="border rounded-lg p-4 flex flex-col justify-around gap-4 mt-10">
          {items
            .filter((i) => i.option !== graphOption) // keep only non-matching items
            .map((i) => (
              <div
                key={i.option} // or i.id if available
                className="border rounded-lg py-4 items-center flex flex-col"
                onClick={() => setGraphOption(i.option)}
              >
                <p className="text-xl font-bold">Option: {i.option}</p>
                <img src={i.img_src} alt={i.topic} className="max-h-[200px]"/>
                <p>{i.topic}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TrackImprovement;
