import React, { createElement, useEffect, useRef, useState } from "react";
import "./MiddleSection.css";
import UploadFile from "./UploadFile/UploadFile";
import Post from "./Post/Post";
import UserProfile from "./UserProfile/UserProfile";
import Games from "./Games/Games";
import ProfileSearch from "../MiddleSection/ProfileSearch/ProfileSearch";
import Notifications from "./Notifications/Notifications";
import FriendsList from "./FriendsList/FriendsList";
import ChatWithFriends from "./ChatWithFriends/ChatWithFriends";

// Mui icons
import SendIcon from "@material-ui/icons/Send";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import UserStory from "./UserStory/UserStory";
import YourActivity from "../../your-activity/your-activity.component";

const MiddleSection = ({ username, homeRoute }) => {
  const [searchE, setSearchE] = useState("");
  const [displayAs, setDisplayAs] = useState("!single");

  const feedArea = document.querySelector(".feed__area");
  const feedAreaRef = useRef();

  const showSearchBar = () => {
    searchE.parentNode.parentNode.style.display = "flex";
  };
  useEffect(() => {
    // console.log(document.querySelector(".feed__area").innerHTML);
    // const feedArea = document.querySelector(".feed__area");
    // if (feedArea.innerHTML == "") {
    //   const x = document.createElement("div");
    //   x.innerHTML = "xxx";
    //   feedArea.appendChild(x);
    // }
  }, [username]);

  var show;

  if (homeRoute === "home") {
    show = (
      <div>
        {searchE && showSearchBar()}
        <div className="userStoryHeadingInMiddle">
          <h1>Stories</h1>
        </div>
        <UserStory username={username} />
        <div className="userUploadHeadingInMiddle">
          <h1>Upload a post</h1>
        </div>
        <div className="user__upload">
          <UploadFile username={username} />
        </div>
        <div className="beforeFeedArea">
          <h1>Feed</h1>
          <div className="changeView">
            <span className="changeViewActiveButton">---</span>
            <button
              onClick={() => {
                setDisplayAs("!single");
                document.querySelector(".changeViewActiveButton").style.left =
                  "16%";
                //change grid
                if (feedAreaRef) {
                  feedAreaRef.current.style.gridTemplateColumns = "33% 33% 33%";
                }
              }}
            >
              Small
            </button>
            <button
              onClick={() => {
                setDisplayAs("single");
                //add - below Large
                document.querySelector(".changeViewActiveButton").style.left =
                  "62%";
                //change grid
                if (feedAreaRef)
                  feedAreaRef.current.style.gridTemplateColumns = "100%";
              }}
            >
              Large
            </button>
          </div>
        </div>
        <div ref={feedAreaRef} className="feed__area">
          <Post
            feedAreaRef={feedAreaRef}
            displayAs={displayAs}
            username={username}
          />
        </div>
      </div>
    );
  } else if (homeRoute === "userprofile") {
    show = (
      <UserProfile
        setDisplayAs={setDisplayAs}
        username={username}
        searchE={searchE}
      />
    );
  } else if (homeRoute === "notifications") {
    show = (
      <Notifications
        setDisplayAs={setDisplayAs}
        username={username}
        searchE={searchE}
      />
    );
  } else if (homeRoute === "games") {
    // show = <Games setDisplayAs={setDisplayAs} searchE={searchE} />;
  } else if (homeRoute == "friends") {
    show = (
      <FriendsList
        setDisplayAs={setDisplayAs}
        username={username}
        searchE={searchE}
      />
    );
  } else if (homeRoute == "chatwithfriends") {
    show = (
      <ChatWithFriends
        setDisplayAs={setDisplayAs}
        username={username}
        searchE={searchE}
      />
    );
  } else if (homeRoute == "youractivity") {
    show = <YourActivity searchE={searchE} username={username} />;
  }

  return (
    <div className="middleSection">
      <div className="middleSearch__Searching">
        <ProfileSearch setSearchE={setSearchE} username={username} />
      </div>
      {show}
    </div>
  );
};

export default MiddleSection;
