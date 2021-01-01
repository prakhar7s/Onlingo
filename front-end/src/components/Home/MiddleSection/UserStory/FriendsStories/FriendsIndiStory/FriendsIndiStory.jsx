import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../../../../firebase/config";
import StoryView from "../../YourOwnStory/StoryView/StoryView";
import "./FriendsIndiStory.css";

// fetch Profile pic from server
const useProfilePic = (username) => {
  const [profilURL, setProfileURL] = useState("");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setProfileURL(doc.data().profilePic);
        }
      });

    return () => unsub();
  }, []);

  return profilURL;
};

function useStory(username) {
  const [story, setStory] = useState(false);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("story")
      .doc(username + "story")
      .onSnapshot((doc) => {
        if (doc.exists) {
          setStory({ ...doc.data(), isStory: true });
        } else {
          setStory({ isStory: false });
        }
      });
  }, []);

  return story;
}

const FriendsIndiStory = ({ friend }) => {
  const yourDPURL = useProfilePic(friend.username);
  const [storyView, setStoryView] = useState(false);
  const story = useStory(friend.username);

  return (
    <div className="friendStoryIndi">
      {story.isStory && (
        <div className="yourStoryUploaded">
          <div
            onClick={() => {
              setStoryView(true);
            }}
            className="uploadedStory_DPP"
          >
            <img src={yourDPURL} alt="your dp" />
          </div>
          <div className="yourName">{friend.username}</div>

          <svg>
            <defs>
              <linearGradient id="insta-normal">
                <stop offset="5%" stop-color="#e49834" />
                <stop offset="95%" stop-color="#db0a2d" />
              </linearGradient>
            </defs>
            <circle
              cx="50%"
              cy="50%"
              r="46"
              style={{ color: "transparent" }}
            ></circle>
          </svg>
        </div>
      )}

      {storyView ? (
        <div className="storyView">
          <button
            onClick={() => {
              setStoryView(false);
            }}
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <StoryView
            story={story}
            username={friend.username}
            setStoryView={setStoryView}
          />
        </div>
      ) : null}
    </div>
  );
};

export default FriendsIndiStory;
