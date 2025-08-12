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
import axios from "axios"; // ✅ Make sure this is at the top

import { useNavigate } from "react-router-dom";

import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";

import { setProfileInfo } from "../features/auth/personDetails";
import LoginActivity from "../components/userProfile/LoginActivity";
import Profile from "../components/userProfile/Profile";
import UserInfo from "../components/userProfile/UserInfo";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import Topics from "../components/userProfile/Topics";

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

    fetchProfile();
  }, [name, email]);

  // The goal of the data is to show the student's current progress (in a pie graph) on the particular topic
  // and to show what they should work on next to improve. (next section that's not completed)

  // a circle graph showing the completed progress on topic/ class

  // a Line graph showing the progress on a topic over time

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

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
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
    header: <Skeleton />,
    path: "/user/track-improvement",
  },
  {
    title: "Mistakes",
    description: "Experience the thrill of bringing ideas to life.",
    header: <Skeleton />,
  },
  {
    title: "Shows completed work (History)",
    description: "Embark on exciting journeys and thrilling discoveries.",
    header: <Skeleton />,
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
