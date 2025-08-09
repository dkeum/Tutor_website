import React from "react";

import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserInfo = () => {
  const name = useSelector((state) => state.personDetail.name);
  const grade = useSelector((state) => state.personDetail.grade);
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="w-[130px] h-auto">
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div><b>Name:</b> {name}</div>
      <div><b>Grade: </b>{grade}</div>
    </div>
  );
};

export default UserInfo;
