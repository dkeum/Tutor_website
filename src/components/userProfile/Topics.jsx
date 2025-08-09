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

const Topics = () => {
  const progressArray = useSelector(
    (state) => state.personDetail.progressArray
  );

  const handleClick = async() => {
    const response = await axios.post(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/login"
          : "https://mathamagic-backend.vercel.app/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // ⬅️ very important!
        }
      );
  }

  //  console.log(progressArray)
  return (
    <div>
      {progressArray ? (
        <>
          <Carousel className="w-[80%] mx-auto  min-h-[6rem]">
            <CarouselContent>
              {progressArray.map((topic, key) => (
                <CarouselItem key={key}>
                  <div className="p-1">
                    <Card className="min-h-[200px] lg:min-h-[250px]">
                      <CardContent className="flex items-center justify-center ">
                        <div className="text-center">
                          <span className="block font-semibold text-xl">
                            {topic.topic_name}
                          </span>

                          <div className="mt-3">
                            {topic.sections.slice(0, 6).map((section, key2) => (
                              <button
                                key={key2}
                                className="flex flex-row gap-x-4 justify-between  w-full hover:bg-slate-100 cursor-pointer"
                                onClick={() => {handleClick(section_name)}}
                              >
                                <span className="text-sm">{section.section_name}</span>
                                <span>{section.progress}%</span>
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
        </>
      ) : (
        <p>All topics complete!</p>
      )}
    </div>
  );
};

export default Topics;
