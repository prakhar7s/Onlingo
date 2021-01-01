import React, { useEffect } from "react";
import { projectFirestore } from "../../../../firebase/config";
import useFriendsList from "../../../../Hooks/useFriendsList";
import FriendsStories from "./FriendsStories/FriendsStories";
import "./UserStory.css";
import YourOwnStory from "./YourOwnStory/YourOwnStory";

const UserStory = ({ username }) => {
  const friendsList = useFriendsList(username);
  useEffect(() => {
    projectFirestore
      .collection("users")
      .doc(username)
      .collection("story")
      .doc(username + "story")
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (new Date() > new Date(doc.data().expiredAt.substring(0, 24))) {
            doc.ref.delete();
          }
        }
      });
    const x = setInterval(() => {
      projectFirestore
        .collection("users")
        .doc(username)
        .collection("story")
        .doc(username + "story")
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (new Date() > new Date(doc.data().expiredAt.substring(0, 24))) {
              doc.ref.delete();
            }
          } else {
            clearInterval(x);
          }
        });
    }, 3000);
  }, []);

  useEffect(() => {
    console.log(friendsList, "s");

    friendsList.map((user) => {
      projectFirestore
        .collection("users")
        .doc(user.username)
        .collection("story")
        .doc(user.username + "story")
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (new Date() > new Date(doc.data().expiredAt.substring(0, 24))) {
              doc.ref.delete();
            }
          }
        });
    });
  }, [friendsList]);
  return (
    <div className="userStory">
      <div className="youOWN__story">
        <YourOwnStory username={username} />
      </div>
      <FriendsStories username={username} />
    </div>
  );
};

export default UserStory;
