import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSelector, useDispatch } from "react-redux";
import { setName } from "../features/auth/personDetails";
import { setQuestions } from "../features/auth/personDetails";
import axios from "axios"; // ✅ Make sure this is at the top

import { useNavigate } from "react-router-dom";

import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";

import { setProfileInfo } from "../features/auth/personDetails";
import LoginActivity from "../components/userProfile/LoginActivity";
import Profile from "../components/userProfile/Profile";
import UserInfo from "../components/userProfile/UserInfo";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import Topics from "../components/userProfile/Topics";

import bookEngineering from "../assets/book-engineering-svgrepo-com.svg";
import correct_mistakes from  "../assets/correct_mistake_logo.png";

// Show a bento grid from acternity https://ui.aceternity.com/components/bento-grid

const ShowPersonalData = () => {
  const name = useSelector((state) => state.personDetail.name);
  const email = useSelector((state) => state.personDetail.email);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!name || name.trim() === "") {
      setOpen(true);
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
            ? `http://localhost:3000/${email}/getprofile`
            : `https://mathamagic-backend.vercel.app/${email}/getprofile`,
          {
            withCredentials: true, // ⬅️ very important!
          }
        );

        dispatch(setProfileInfo(response?.data));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const getQuestions_Data = async () => {
      const response = await axios.get(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? `http://localhost:3000/questions/get-questions`
          : `https://mathamagic-backend.vercel.app/questions/get-questions`,
        { withCredentials: true }
      );

      // console.log("get question data");
      // console.log(response.data);

      const my_data = response.data?.mark_section;
      dispatch(setQuestions(my_data));
      // console.log(my_data)

      // For the graph, keep only date & grade
      // setData(my_data);
    };

    getQuestions_Data();

    fetchProfile();
  }, [name, email]);

  // The goal of the data is to show the student's current progress (in a pie graph) on the particular topic
  // and to show what they should work on next to improve. (next section that's not completed)

  // a circle graph showing the completed progress on topic/ class

  // suggested topics and questions to solve for improvement

  const data = [{}];

  return (
    <div>
      <DialogBox open={open} setOpen={setOpen} />
      <NavbarLoggedIn />
      <BentoGrid className="max-w-4xl mx-auto mt-10">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={i === 0 || i === 2 ? "md:col-span-2" : ""}
            path={item.path} // just pass it, even if undefined
            style={{ cursor: item.path ? "pointer" : "default" }}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default ShowPersonalData;


const items = [
  {
    title: "Login Activity",
    description: "",
    header: <LoginActivity />,
  },
  {
    title: "Profile",
    description: "",
    header: <UserInfo />,
  },
  {
    title: "",
    description: "",
    header: <Topics />,
  },
  {
    title: "Current Progress",
    description: "",
    header: <Profile />,
  },
  {
    title: "Track Improvement",
    description: "Bar graph of commitment per week and grade improvement",
    header: (
      <div className="w-full h-40 relative flex items-end  border-l border-b border-gray-400 px-4">
        {/* Bar 1 */}
        <div className="flex-1 mx-2 relative">
          <div className="w-full h-32 bg-gradient-to-t from-blue-500 to-blue-300 origin-bottom animate-bar"></div>
          <div className="absolute bottom-0 w-full text-center text-xl font-bold">
            A
          </div>
        </div>

        {/* Bar 2 */}
        <div className="flex-1 mx-2 relative">
          <div
            className="w-full h-24 bg-gradient-to-t from-yellow-400 to-yellow-200 origin-bottom animate-bar"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute bottom-0 w-full text-center text-xl font-bold">
            B
          </div>
        </div>

        {/* Bar 3 */}
        <div className="flex-1 mx-2 relative">
          <div
            className="w-full h-28 bg-gradient-to-t from-red-500 to-red-300 origin-bottom animate-bar"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute bottom-0 w-full text-center font-bold text-xl">
            C
          </div>
        </div>
      </div>
    ),
    path: "/user/track-improvement",
  },
  {
    title: "Correct Your Mistakes",
    description: "Experience the thrill of bringing ideas to life.",
    header: (
      <div className="flex h-full justify-center items-center gap-4 text-5xl font-bold">
       <img src={correct_mistakes} className="max-h-[150px]"/>
      </div>
    ),
    path: "/user/mistakes",
  },
  {
    title: "Setting",
    description: "Embark on exciting journeys and thrilling discoveries.",
    header: <img src={bookEngineering} alt="Book Engineering" className=" mx-auto my-auto max-h-[150px]" />,
    path: "/user/history",
  },
];

const DialogBox = ({ open, setOpen }) => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim() !== "") {
      dispatch(setName(username.trim()));

      const response = await axios.put(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/user/setname"
          : "https://mathamagic-backend.vercel.app/user/setname",
        {
          name: username.trim(), // ✅ send the name
        },
        {
          withCredentials: true, // ⬅️ very important!
        }
      );
      if (response.status === 200) setOpen(false); // close dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>Enter your name to continue.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Name</Label>
              <Input
                id="username-1"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
