import React from "react";
import NavbarLoggedIn from "./NavbarLoggedIn";
import Sidebar from "./Sidebar";

const LoggedInLayout = ({ children }) => {
  return (
    <div>
      <NavbarLoggedIn />
      <Sidebar />
      {children}
    </div>
  );
};

export default LoggedInLayout;
