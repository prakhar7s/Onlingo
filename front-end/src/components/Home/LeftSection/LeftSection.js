import React, { useEffect, useState } from "react";
import "./LeftSection.css";
import PersonIcon from "@material-ui/icons/Person";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { auth, projectFirestore } from "../../../firebase/config";
import ListIcon from "@material-ui/icons/List";
import TelegramIcon from "@material-ui/icons/Telegram";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import { defaultDP } from "../../../mostUsedVariables";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
const useProfile = (username, docString) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const u = projectFirestore
      .collection("users")
      .doc(username)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setUrl(snap.data().profilePic);
        }
      });

    // session
    // projectFirestore
    //   .collection("users")
    //   .doc(username)
    //   .collection("loggedIn")
    //   .doc(docString)
    //   .set({
    //     loggedInAt: new Date().toString(),
    //   });

    return () => u();
  }, []);

  return url;
};

const LeftSection = ({
  username,
  userName,
  friendsCount,
  postsCount,
  likesCount,
  onRouteChange,
  setHomeRoute,
}) => {
  const docString = Math.random().toString();
  const profilePic = useProfile(username, docString);
  const iconSize = "default";
  const activeButton = document.querySelector(".optionsActiveStatus");

  const [loginID, setLoginID] = useState(
    username + Math.random().toString().replace(".", "0")
  );

  // useEffect(() => {
  //   setInterval(() => {
  //     fetch("http://localhost:3001/activity", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         username,
  //         uniqueID,
  //         loggedAt: new Date().toLocaleString(),
  //       }),
  //     })
  //       // .then((res) => res.JSON())
  //       .then((data) => console.log(data));
  //   }, 1000);
  // }, []);

  useEffect(() => {
    fetch("http://localhost:3002/youractivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {});

    fetch("http://localhost:3002/loginSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loginid: loginID,
        username,
        logindate: new Date().toLocaleDateString(),
        loginat: new Date().toLocaleTimeString(),
      }),
    }).then((res) => {});

    setInterval(() => {
      fetch("http://localhost:3002/lastSeen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginid: loginID,
          lastseen: new Date().toLocaleTimeString(),
        }),
      }).then((res) => {});
    }, 2000);
  }, []);

  function checkCount(count) {
    return count == "no" ? 0 : count;
  }
  return (
    <div className="leftSection">
      <div className="app__name">
        <h1>onlinGo</h1>
        <div>
          <img src="./onlingo-logo.png" />
        </div>
      </div>
      <div className="user__profile">
        {/* <Avatar src={profilePic} /> */}
        <div className="user_profileProfilePic">
          <img src={profilePic || defaultDP} alt="DP" />
          <svg className="profile-pic-circle">
            <defs>
              <linearGradient id="gradient">
                <stop offset="5%" stopColor="#ffa600" />
                <stop offset="95%" stopColor="#f5280d" />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="50"></circle>
          </svg>
        </div>
        <h1>
          {userName ? (
            userName
          ) : (
            <span style={{ fontSize: "15px", textAlign: "center" }}>
              Loading....
            </span>
          )}
        </h1>
        <h1>@{username}</h1>
      </div>
      <div className="userPublicInformationsFriPostLikes">
        <div className="userPublicInformationsFriPostLikes__Posts">
          <h1>
            {postsCount ? (
              checkCount(postsCount)
            ) : (
              <span style={{ fontSize: "15px", textAlign: "center" }}>
                Loading....
              </span>
            )}
          </h1>
          <h3>Posts</h3>
        </div>
        <div className="userPublicInformationsFriPostLikesVerticalLines"></div>
        <div className="userPublicInformationsFriPostLikes__Friends">
          <h1>
            {friendsCount ? (
              checkCount(friendsCount)
            ) : (
              <span style={{ fontSize: "15px", textAlign: "center" }}>
                Loading....
              </span>
            )}
          </h1>
          <h3>Friends</h3>
        </div>
        <div className="userPublicInformationsFriPostLikesVerticalLines"></div>
        <div className="userPublicInformationsFriPostLikes__Likes">
          <h1>
            {likesCount ? (
              checkCount(likesCount)
            ) : (
              <span style={{ fontSize: "15px", textAlign: "center" }}>
                Loading....
              </span>
            )}
          </h1>
          <h3>Likes</h3>
        </div>
      </div>
      <div className="options">
        <div className="optionsActiveStatus"></div>
        <div
          onClick={(e) => {
            setHomeRoute("home");
            // active the button
            activeButton.style.top = "-1.4%";
          }}
          className="leftsection__options"
        >
          <RssFeedIcon fontSize={iconSize} />
          <h1>Feed</h1>
        </div>
        <div
          onClick={(e) => {
            setHomeRoute("userprofile");
            // active the button
            if (activeButton) activeButton.style.top = "15%";
          }}
          className="leftsection__options"
        >
          <PersonIcon fontSize={iconSize} />
          <h1>User</h1>
        </div>
        <div
          onClick={(e) => {
            setHomeRoute("friends");
            // active the button
            if (activeButton) activeButton.style.top = "32.5%";
          }}
          className="leftsection__options"
        >
          <ListIcon fontSize={iconSize} />
          <h1>Friends</h1>
        </div>
        <div
          className="leftsection__options"
          onClick={(e) => {
            setHomeRoute("chatwithfriends");
            // active the button
            if (activeButton) {
              activeButton.style.top = "49%";
            }
          }}
        >
          <TelegramIcon fontSize={iconSize} />

          <h1>Chat</h1>
        </div>
        <div
          className="leftsection__options"
          onClick={(e) => {
            setHomeRoute("notifications");
            // active the button
            if (activeButton) activeButton.style.top = "65%";
          }}
        >
          <NotificationsNoneIcon fontSize={iconSize} />
          <h1>Notifications</h1>
        </div>
        <div
          onClick={(e) => {
            setHomeRoute("youractivity");
            // active the button
            if (activeButton) activeButton.style.top = "82%";
          }}
          className="leftsection__options"
        >
          <AccessTimeIcon fontSize={iconSize} />

          <h1>Your Activity</h1>
        </div>
      </div>

      <button
        className="signoutButton"
        onClick={() => {
          auth.signOut();
          document.location.reload();
        }}
      >
        <ExitToAppIcon fontSize={iconSize} /> <h1>Sign out</h1>
      </button>
    </div>
  );
};

export default LeftSection;
