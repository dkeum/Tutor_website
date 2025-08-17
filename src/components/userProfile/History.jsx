import React from "react";
import NavbarLoggedIn from "../NavbarLoggedIn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const History = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLoggedIn />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Profile Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="john@example.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="tts">Enable Text-to-Speech</Label>
              <Switch id="tts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
