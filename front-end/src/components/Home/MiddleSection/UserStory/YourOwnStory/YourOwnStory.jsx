import React, { useEffect, useRef, useState } from "react";
import {
  projectFirestore,
  projectStorage,
} from "../../../../../firebase/config";
import StoryCreaterForU from "./StoryCreaterForU/StoryCreaterForU";
import StoryView from "./StoryView/StoryView";
import "./YourOwnStory.css";

// fetch Profile pic from server
const useProfilePic = (username) => {
  const [profilURL, setProfileURL] = useState("");

  useEffect(() => {
    //   fetch("http://localhost:3002/DP", {
    //     method: "post",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       username: username,
    //     }),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setProfileURL(data.url);
    //       console.log(data);
    //     });

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
    // fetch("http://localhost:3002/story", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: username,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data.length, data);
    //     setStory(data);
    //   });
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

const YourOwnStory = ({ username }) => {
  const yourDPURL = useProfilePic(username);
  const [storyCreater, setStoryCreater] = useState(false);
  const [storyView, setStoryView] = useState(false);
  const story = useStory(username);
  const [showDeletedStory, setShowDeletedStory] = useState(false);
  const uploadingStatus = useRef();

  function handleDeleteStory() {
    if (window.confirm(`${username} are you sure?`)) {
      if (story.storyBG.length > 20) {
        projectStorage
          .refFromURL(story.storyBG)
          .delete()
          .then(() => {
            console.log("del");
          })
          .catch((err) => alert(err));
      }

      projectFirestore
        .collection("users")
        .doc(username)
        .collection("story")
        .doc(username + "story")
        .get()
        .then((doc) => doc.ref.delete());

      setStoryView(false);

      setShowDeletedStory(true);

      setTimeout(() => {
        setShowDeletedStory(false);
      }, 4000);
    }
  }

  return (
    <div className="yourOwnStory">
      {<h1 className="uploadingTime" ref={uploadingStatus}></h1>}
      {/* UPLOADED */}
      {story.isStory ? (
        <div className="yourStoryUploaded">
          <div
            onClick={() => {
              setStoryView(true);
            }}
            className="uploadedStory_DPP"
          >
            <img src={yourDPURL} alt="your dp" />
          </div>
          <div className="yourName">{username}</div>

          <svg>
            <defs>
              <linearGradient id="insta-normal">
                <stop offset="5%" stopColor="#e49834" />
                <stop offset="95%" stopColor="#db0a2d" />
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
      ) : (
        <div className="yourStoryNotUploaded">
          <div
            className="clickOnCreateStory"
            onClick={() => setStoryCreater(true)}
          >
            <div className="yourDPAvatar">
              <img
                src={
                  yourDPURL ||
                  "http://s3.amazonaws.com/FringeBucket/default-user.png"
                }
                alt="your dp"
              />
            </div>
            <div className="yourName">{username}</div>
          </div>
          <svg>
            <defs>
              <linearGradient id="insta-normal">
                <stop offset="5%" stopColor="#e49834" />
                <stop offset="95%" stopColor="#db0a2d" />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="46"></circle>
          </svg>
        </div>
      )}
      {storyCreater ? (
        <div className="storyCreater">
          <button
            className="storyCreaterCloseButton"
            onClick={() => setStoryCreater(false)}
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <StoryCreaterForU
            setStoryCreater={setStoryCreater}
            username={username}
            uploadingStatus={uploadingStatus}
          />
        </div>
      ) : null}
      {storyView ? (
        <div className="storyView">
          <button
            onClick={() => {
              setStoryView(false);
            }}
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <button
            onClick={() => handleDeleteStory()}
            className="deleteYourStory"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
          <StoryView
            story={story}
            username={username}
            setStoryView={setStoryView}
          />
        </div>
      ) : null}
      {showDeletedStory && (
        <div className="showDeletedStory">
          Your story has been deleted permanently.
        </div>
      )}
    </div>
  );
};

export default YourOwnStory;
