import React, { useEffect, useState } from "react";
import "./FriendsList.css";
import FriendsListIndi from "./FriendsListIndi/FriendsListIndi";
import { hideMainSearchBar } from "../../../../functions/mostUsedFunctions";
import useFriendsList from "../../../../Hooks/useFriendsList";

const FriendsList = ({ username, searchE, setDisplayAs }) => {
  const getFriendsList = useFriendsList(username);

  hideMainSearchBar(searchE);

  useEffect(() => {
    setDisplayAs("!single");
  }, []);

  return (
    <div>
      <h1 className="friendsHeading">Friends</h1>
      <div className="friendsListAll">
        {getFriendsList.map((friend) => (
          <FriendsListIndi username={username} friend={friend} />
        ))}

        {getFriendsList.length == 0 && (
          <h1 className="youDontHaveFriends">You don't have any friends.</h1>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
