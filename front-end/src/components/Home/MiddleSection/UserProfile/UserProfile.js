import React, { useEffect } from "react";
import "./UserProfile.css";
import UserHomePage from "../../MiddleSection/UserProfile/UserHomePage/UserHomePage";
import { hideMainSearchBar } from "../../../../functions/mostUsedFunctions";
const UserProfile = ({ searchE, username, setDisplayAs }) => {
  hideMainSearchBar(searchE);

  useEffect(() => {
    setDisplayAs("!single");
  }, []);

  return (
    <div className="user-profile">
      <UserHomePage profile={username} />
    </div>
  );
};

export default UserProfile;
