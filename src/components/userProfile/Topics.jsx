import React from "react";
import { useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Topics = () => {
  const progressArray = useSelector(
    (state) => state.personDetail.progressArray
  );

  const navigate = useNavigate();

  const handleClick = (topic, section) => {
    navigate(
      `/question/${encodeURIComponent(topic)}?section=${encodeURIComponent(
        section
      )}`
    );
  };

  return (
    <div>
      {progressArray && progressArray.length > 0 ? (
        <Carousel className="w-[80%] mx-auto min-h-[6rem]">
          <CarouselContent>
            {progressArray.map((topic, key) => (
              <CarouselItem key={key}>
                <div className="p-1">
                  <Card className="min-h-[200px] lg:min-h-[250px]">
                    <CardContent className="flex items-center justify-center">
                      <div className="text-center">
                        <span className="block font-semibold text-xl">
                          {topic.topic_name}
                        </span>

                        <div className="mt-3">
                          {topic.sections.slice(0, 6).map((section, key2) => (
                            <button
                              key={key2}
                              className="flex flex-row gap-x-4 justify-between w-full hover:bg-slate-100 cursor-pointer"
                              onClick={() =>
                                handleClick(
                                  topic.topic_name,
                                  section.section_name
                                )
                              }
                            >
                              <span className="text-sm">
                                {section.section_name}
                              </span>
                              <span
                                className={
                                  section?.latest_grade != null
                                    ? section.latest_grade < 50
                                      ? "text-red-500"
                                      : section.latest_grade < 75
                                      ? "text-yellow-500"
                                      : "text-green-500"
                                    : "text-gray-500"
                                }
                              >
                                {section?.latest_grade != null
                                  ? Math.round(section.latest_grade)
                                  : 0}
                                %
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p>All topics complete!</p>
      )}
    </div>
  );
};

export default Topics;
