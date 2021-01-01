import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import IndividualNotifications from "./IndividualNotifications/IndividualNotifications";
import "./Notifications.css";
import { projectFirestore } from "../../../../firebase/config";
import { hideMainSearchBar } from "../../../../functions/mostUsedFunctions";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";

function useNotis(username) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubs = projectFirestore
      .collection("users")
      .doc(username)
      .collection("notifications")
      .orderBy("at", "desc")
      .onSnapshot((snapshot) => {
        const temp = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (temp.length) setNotifications(temp);
        else {
          setNotifications("no");
        }
      });

    return () => unsubs();
  }, []);

  return notifications;
}

const Notifications = ({ username, searchE, setDisplayAs }) => {
  // custom hook
  const notis = useNotis(username);
  useEffect(() => {
    setDisplayAs("!single");
  }, []);

  hideMainSearchBar(searchE);

  return (
    <div className="notifications">
      <div className="notificationsHeading">
        <h1>
          Notifications <NotificationsOutlinedIcon />
        </h1>
      </div>
      <div className="notificationsContainer">
        <div className="notificationContainer__waiting">
          {typeof notis == typeof [] && notis.length == 0 && (
            <h1 className="notificationContainer__waitingLoading">
              Loading....
            </h1>
          )}
          {typeof notis == typeof "" && (
            <h1 className="notificationContainer__waitingNoNotifications">
              No Notifications.
            </h1>
          )}
        </div>

        {typeof notis === typeof [] &&
          notis.length > 0 &&
          notis
            .sort((a, b) => new Date(b.at) - new Date(a.at))
            .map((noti) => (
              <IndividualNotifications
                username={username}
                type={noti.type}
                who={noti.who}
                at={noti.at}
                post={noti.postID || "not"}
                key={noti.postID + Math.random().toString()}
              />
            ))}
      </div>
    </div>
  );
};

export default Notifications;
