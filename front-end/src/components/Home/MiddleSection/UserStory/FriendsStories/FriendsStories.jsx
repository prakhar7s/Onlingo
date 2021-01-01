import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../../../firebase/config";
import YourOwnStory from "../YourOwnStory/YourOwnStory";
import FriendsIndiStory from "./FriendsIndiStory/FriendsIndiStory";
import "./FriendsStories.css";

const useFriendStory = (username) => {
  const [friendHas, setFriendHas] = useState([]);

  useEffect(() => {
    var temp = "";

    const un = projectFirestore
      .collection("users")
      .doc(username)
      .collection("friends")
      .onSnapshot((docs) => {
        if (docs.size) {
          temp = docs.docs.map((doc) => ({ ...doc.data() }));
        }
        setFriendHas(temp);
      });

    return () => un();
  }, []);

  return friendHas;
};
const FriendsStories = ({ username }) => {
  const friendsHasStory = useFriendStory(username);
  return (
    <div className="friendsStories">
      {friendsHasStory &&
        friendsHasStory.map((friend) => <FriendsIndiStory friend={friend} />)}
    </div>
  );
};

export default FriendsStories;
