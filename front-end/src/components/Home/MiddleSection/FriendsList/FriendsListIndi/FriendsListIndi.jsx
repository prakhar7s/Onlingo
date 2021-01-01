import React, { useState } from "react";
import "./FriendsListIndi.css";
import SpecificProfile from "../../ProfileSearch/SpecificProfile/SpecificProfile";
import Moment from "react-moment";
import useProfile from "../../../../../Hooks/useProfile";
import { Avatar } from "@material-ui/core";

const FriendsListIndi = ({ username, friend }) => {
  const [showProfile, setShowProfile] = useState(false);
  const friendAllData = useProfile(friend.username);
  return (
    <div className="friendsListIndi">
      <div className="friendsListIndiLeft">
        <div className="friendsListIndi__DP">
          <Avatar src={friendAllData.profilePic}></Avatar>
        </div>
        <h1>@{friendAllData.username || "loading...."}</h1>
      </div>
      <div className="friendsListIndiContents">
        <h1 className="friendsList__indiName" key={friendAllData.name}>
          {friendAllData.name || "loading..."}
        </h1>
        <p className="friendsList__bio">{friendAllData.bio}</p>
        <button
          className="friendsList__ViewProfile"
          onClick={() => setShowProfile(true)}
        >
          View Profile
        </button>
        <Moment className="friendsList__Time" fromNow>
          {new Date(friend.acceptedAt)}
        </Moment>
      </div>

      {showProfile ? (
        <div className="friends__profileContainer">
          <button
            onClick={() => setShowProfile(false)}
            className="friends__profileContainer__CloseButton"
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <SpecificProfile ownProfile={username} profile={friend.username} />
        </div>
      ) : null}
    </div>
  );
};

export default FriendsListIndi;
