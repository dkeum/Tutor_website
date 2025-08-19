import React, { useState } from "react";
import NavbarLoggedIn from "../NavbarLoggedIn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackgroundWrapper_2 from "../BackgroundWrapper_2";
import { useSelector } from "react-redux";
import axios from "axios";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const History = () => {
  const currentName = useSelector((state) => state.personDetail.name);
  const currentEmail = useSelector((state) => state.personDetail.email);
  const currentProfile = useSelector((state) => state.personDetail.profile_pic);

  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [profilePicture, setProfilePicture] = useState(currentProfile);
  const [selectedFile, setSelectedFile] = useState(null);

  // File picker for avatar
  const handleAvatarClick = () => {
    document.getElementById("avatar-input").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  // Save button
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) formData.append("profile_picture", selectedFile);

      const response = await axios.put(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/update-profile-info"
          : "https://mathamagic-backend.vercel.app/update-profile-info",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Profile updated:", response.data);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Delete account
  const handleDelete = async () => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/delete-account"
          : "https://mathamagic-backend.vercel.app/delete-account",
        {},
        { withCredentials: true }
      );
      console.log("Account deleted:", response.data);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <NavbarLoggedIn />

      <div className="max-w-6xl mx-auto px-6">
        <BackgroundWrapper_2>
          <h1 className="text-3xl font-bold mb-6 mt-40">Settings</h1>

          {/* Profile Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-row justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Avatar className="relative h-13 w-13 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={profilePicture} alt="Profile" />
                  <AvatarFallback>CN</AvatarFallback>

                  {/* Overlay camera icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h4l2-3h6l2 3h4a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z"
                      />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <input
                    type="file"
                    id="avatar-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 -mt-10">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input disabled id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="tts">Enable Text-to-Speech</Label>
                <Switch id="tts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-300 mb-5">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </BackgroundWrapper_2>
      </div>
    </div>
  );
};

export default History;
