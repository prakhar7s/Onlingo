import React, { useEffect, useState } from "react";
import "./ChatWithFriends.css";
import { hideMainSearchBar } from "../../../../functions/mostUsedFunctions";
import ChatList from "./ChatList/ChatList";
import ChatListSearch from "./ChatListSearch/ChatListSearch";
import ChattingWithSpecificFriend from "./ChattingWithSpecificFriend/ChattingWithSpecificFriend";

const ChatWithFriends = ({ username, searchE, setDisplayAs }) => {
  hideMainSearchBar(searchE);
  const [friendToTalk, setFriendToTalk] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDisplayAs("!single");
  }, []);

  return (
    <div className="chatsContainer">
      <div className="chatsHeading"></div>
      <div className="chatsChattingArea">
        {friendToTalk ? (
          <ChattingWithSpecificFriend
            username={username}
            friendToTalk={friendToTalk}
          />
        ) : (
          <h1 className="chatsChattingArea__welcome">
            Welcome! Send messages to your friends.
          </h1>
        )}
      </div>
      <div className="chatsList">
        <ChatListSearch setSearch={setSearch} />
        <ChatList
          search={search}
          setFriendToTalk={setFriendToTalk}
          username={username}
        />
      </div>
    </div>
  );
};

export default ChatWithFriends;
