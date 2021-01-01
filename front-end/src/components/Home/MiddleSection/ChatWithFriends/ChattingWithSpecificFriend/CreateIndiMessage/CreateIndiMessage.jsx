import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../../../../firebase/config";
import "./CreateIndiMessage.css";
import Moment from "react-moment";

function useProfileImage(username, allChatMessagesContainer) {
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .onSnapshot((doc) => {
        setProfilePhoto(doc.data().profilePic);
        if (allChatMessagesContainer) {
          allChatMessagesContainer.scrollTop =
            allChatMessagesContainer.scrollHeight;
        }
      });
    return () => unsub();
  }, []);

  return profilePhoto;
}

const CreateIndiMessage = ({
  indiChat,
  username,
  id,
  allChatMessagesContainer,
}) => {
  const profilePhoto = useProfileImage(indiChat.by, allChatMessagesContainer);

  return (
    <div
      key={id}
      className={indiChat.by == username ? "msgSentByYou" : "msgNotSentByYou"}
    >
      <div className="messageImgContainer">
        <img src={profilePhoto} />
      </div>
      <div className="messageDetails">
        <p className="chatMessageParagraph">{indiChat.message}</p>
        <h2 className="messageSentAtFull">{indiChat.at.substring(0, 24)}</h2>
        <h2 className="messageSentAt">
          <Moment fromNow>{new Date(indiChat.at)}</Moment>
        </h2>
      </div>
    </div>
  );
};

export default CreateIndiMessage;
