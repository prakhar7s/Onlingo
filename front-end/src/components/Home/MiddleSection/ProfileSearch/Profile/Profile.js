import React from "react";
import "./Profile.css";

import { defaultCover, defaultDP } from "../../../../../mostUsedVariables";

const Profile = ({
  profilePic,
  name,
  username,
  bio,
  coverPic,
  setOpenProfile,
  setShowRoute,
  input,
}) => {
  const specificProfileClicked = (e) => {
    setOpenProfile(username);
    setShowRoute("X");
    input.value = "";
  };
  return (
    <div>
      <div className="allProfile">
        <div className="allProfile__cover">
          <img src={coverPic || defaultCover} alt="Cover" />
        </div>
        <div className="allProfile__photo">
          <img src={profilePic || defaultDP} alt="Profile" />
        </div>
        <div className="allProfile__content">
          <h1 className="allProfile__name">{name}</h1>
          <h1 className="allProfile__profession">@{username}</h1>
          <h1 className="allProfile__bio">{bio}</h1>
          <div className="allProfile__button">
            <button onClick={(e) => specificProfileClicked(e)}>
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
