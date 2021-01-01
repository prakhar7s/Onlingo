import React, { useEffect, useState } from "react";
import "./ChattingWithSpecificFriend.css";
import SendIcon from "@material-ui/icons/Send";
import { projectFirestore } from "../../../../../firebase/config";
import CreateIndiMessage from "./CreateIndiMessage/CreateIndiMessage";

function useMessages(allChatsOf) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("messenging")
      .doc("chats")
      .collection(allChatsOf)
      .onSnapshot((docs) => {
        const temp = docs.docs
          .sort((A, B) => {
            return new Date(A.data().at) - new Date(B.data().at);
          })
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        setChats(temp);
        console.log("hello");
      });

    return () => unsub();
  }, [allChatsOf]);

  return chats;
}

const ChattingWithSpecificFriend = ({ username, friendToTalk }) => {
  const [message, setMessage] = useState("");
  const allChats = useMessages([username, friendToTalk].sort().join("-"));
  const [showContainer, setShowContainer] = useState(true);

  const allChatMessagesContainer = document.querySelector(
    ".chatsMessagesContainer"
  );

  function conversationStarted() {
    if (message !== "") {
      const messageFromUser = document.getElementById("messageFromUser");

      // #################################################################################
      // Database Logic
      const collectionName = [username, friendToTalk].sort().join("-");

      projectFirestore
        .collection("messenging")
        .doc("chats")
        .collection(collectionName)
        .get()
        .then((docs) => {
          // add chats in database
          projectFirestore
            .collection("messenging")
            .doc("chats")
            .collection(collectionName)
            .doc((docs.size + 1).toString())
            .set({
              message: message,
              at: new Date().toString(),
              by: username,
            });
        });

      // #################################################################################

      messageFromUser.value = "";
      setMessage("");
      messageFromUser.focus();
    }
  }

  return (
    <>
      <div className="chatsMessagesContainer">
        {allChats.map((indiChat) => (
          <CreateIndiMessage
            allChatMessagesContainer={allChatMessagesContainer}
            username={username}
            indiChat={indiChat}
            key={indiChat.id}
            id={indiChat.id}
          />
        ))}
        {allChats.length === 0 && (
          <h1 className="chatsMessagesContainer__empty">NO MESSAGES!</h1>
        )}
      </div>
      <div className="chatsMessageInputContainer">
        <form>
          <input
            id="messageFromUser"
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            autoFocus={true}
            autoComplete="off"
            placeholder="Message..."
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              conversationStarted();
            }}
          ></button>
          <SendIcon
            onClick={() => {
              conversationStarted();
            }}
            fontSize="medium"
          />
        </form>
      </div>
    </>
  );
};

export default ChattingWithSpecificFriend;
