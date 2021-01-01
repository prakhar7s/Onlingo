import React, { useEffect, useState } from "react";
import "./ChatList.css";
import ChatListIndi from "./ChatListIndi/ChatListIndi";
import useFriendsList from "../../../../../Hooks/useFriendsList";

const ChatList = ({ search, username, setFriendToTalk }) => {
  const friendsList = useFriendsList(username);
  const filtered = friendsList;
  const [showHeader, setShowHeader] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendUsername, setFriendUsername] = useState("");
  const [friendProfilePic, setFriendProfilePic] = useState("");

  return (
    <div className="ChatListContainer">
      {showHeader && (
        <div key={friendUsername} className="currentChattingHeader">
          <div class="currentChattingHeaderDP">
            <img src={friendProfilePic} />
          </div>
          <div class="currentChattingHeaderNameAndUsername">
            <h1>{friendName}</h1>
            <h2>@{friendUsername}</h2>
          </div>
        </div>
      )}
      {search ? (
        <>
          {filtered.map((friend) => (
            <>
              {friend.username
                .toLowerCase()
                .startsWith(search.toLowerCase()) && (
                <ChatListIndi
                  key={[username, friend.username].sort().join("-")}
                  username={username}
                  friend={friend.username}
                  setFriendToTalk={setFriendToTalk}
                  setShowHeader={setShowHeader}
                  setFriendName={setFriendName}
                  setFriendUsername={setFriendUsername}
                  setFriendProfilePic={setFriendProfilePic}
                />
              )}
            </>
          ))}
          {!filtered.length && (
            <h1 className="ChatListContainer__emptyList">
              You don't have any friends yet.
            </h1>
          )}
        </>
      ) : (
        <>
          {friendsList.map((friend) => (
            <ChatListIndi
              key={[username, friend.username].sort().join("-")}
              username={username}
              friend={friend.username}
              setFriendToTalk={setFriendToTalk}
              setShowHeader={setShowHeader}
              setFriendName={setFriendName}
              setFriendUsername={setFriendUsername}
              setFriendProfilePic={setFriendProfilePic}
            />
          ))}
          {!friendsList.length && (
            <h1 className="ChatListContainer__emptyList">
              You don't have any friends yet.
            </h1>
          )}
        </>
      )}
    </div>
  );
};

export default ChatList;
