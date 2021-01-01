import React, { useEffect, useState } from "react";
import "./ChatListIndi.css";
import useProfile from "../../../../../../Hooks/useProfile";
import { projectFirestore } from "../../../../../../firebase/config";
import { formatLastSeen } from "../../../../../../functions/mostUsedFunctions";

function useLastMessage(friend, you) {
  const [lastMsg, setLastMsg] = useState("");

  const collName = [friend, you].sort().join("-");

  const chatRef = projectFirestore
    .collection("messenging")
    .doc("chats")
    .collection(collName);

  useEffect(() => {
    const unsub = chatRef.onSnapshot((docs) => {
      if (docs.size > 0) {
        chatRef
          .doc(docs.size.toString())
          .get()
          .then((chat) => {
            setLastMsg(chat.data().message);
          });
      } else {
        setLastMsg("no messages!");
      }
    });

    return () => unsub();
  }, []);

  return lastMsg;
}

const ChatListIndi = ({
  friend,
  username,
  id,
  setFriendToTalk,
  setShowHeader,
  setFriendUsername,
  setFriendName,
  setFriendProfilePic,
}) => {
  const friendInfo = useProfile(friend);
  const lastMessage = useLastMessage(friend, username);
  const [ls, setLS] = useState("");

  useEffect(() => {
    setInterval(() => {
      fetch("http://localhost:3002/userlastseen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: friend,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLS(data.lastseen);
          console.log(data);
        });
    }, 2000);
  }, []);
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.length) {
  //         const date = new Date(data[0].substring(0, 10) + " " + data[1]);
  //         const currentDate = new Date();
  //         const diff = currentDate - date;
  //         console.log(date, currentDate, diff);

  //         if (diff < 5000) {
  //           setLS("ONLINE");
  //         } else {
  //           setLS(date.toLocaleString());
  //         }
  //       } else {
  //         setLS("c");
  //       }
  //     });
  // }, []);

  return (
    <div
      key={id}
      className="chatListIndi"
      onClick={() => {
        setFriendToTalk(friendInfo.username);
        setShowHeader(true);
        setFriendProfilePic(friendInfo.profilePic);
        setFriendUsername(friendInfo.username);
        setFriendName(friendInfo.name);
      }}
    >
      <div className="friendsProfilePhoto">
        <img
          src={
            friendInfo.profilePic ||
            "http://s3.amazonaws.com/FringeBucket/default-user.png"
          }
        />
      </div>
      <div className="friendsNameAndMessage">
        <h1>{friendInfo.name}</h1>
        <p>{lastMessage || "loading..."}</p>
        <h2>
          {ls ? (
            <>
              {ls === "Online" ? (
                ls
              ) : (
                <>
                  {formatLastSeen(ls)[0]} <span className="lsSpan"> </span>{" "}
                  {formatLastSeen(ls)[1]}
                </>
              )}
            </>
          ) : (
            "loading...."
          )}
        </h2>
      </div>
    </div>
  );
};

export default ChatListIndi;
