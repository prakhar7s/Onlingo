import React, { useEffect, useRef } from "react";
import "./StoryView.css";
import useProfile from "../../../../../../Hooks/useProfile";
import Moment from "react-moment";

const StoryView = ({ story, setStoryView, username }) => {
  const storyTimer = useRef();
  const user = useProfile(username);

  var x = 0;
  useEffect(() => {
    let c = setInterval(() => {
      x += 6.1;
      storyTimer.current.style.width = `${x}%`;
      if (x > 92) {
        setStoryView(false);
      }
    }, 660);

    return () => clearInterval(c);
  }, []);

  var bk = "";
  if (story.storyBG.length > 20) {
    bk = (
      <div className="storyPhotooo">
        <img src={story.storyBG} alt="story" />
      </div>
    );
  } else if (story.storyBG.includes("#")) {
    // gradient
    bk = (
      <div
        style={{
          backgroundImage: `linear-gradient(#${story.storyBG.split("#")[0]}, #${
            story.storyBG.split("#")[1]
          })`,
        }}
        className="storyPhotooo"
      ></div>
    );
  } else {
    // normal color
    bk = (
      <div
        style={{ backgroundColor: story.storyBG }}
        className="storyPhotooo"
      ></div>
    );
  }
  var textStyles = "";
  if (story.text) {
    if (typeof story.fontColor == typeof []) {
      textStyles = {
        fontWeight: story.fontWeight,
        fontFamily: story.fontStyle,
        fontSize: story.fontSize,
        ...story.fontColor,
      };
    } else {
      textStyles = {
        fontWeight: story.fontWeight,
        fontFamily: story.fontStyle,
        fontSize: story.fontSize,
        color: story.fontColor,
      };
    }
  }

  return (
    <>
      {bk}
      <div className="storyTimer" ref={storyTimer}></div>

      <div className="storyInformation">
        <h1>{user.name}</h1>
        <h2>@{user.username}</h2>
        <p className="storyContent" style={{ ...textStyles }}>
          {story.text}
        </p>
        <div className="storyCreatedAt">
          <span>Shared </span>
          <Moment fromNow>{new Date(story.createdAt)}</Moment>
        </div>
        <div className="storyCreaterDP">
          <img src={user.profilePic} alt="DP" />
        </div>
      </div>
    </>
  );
};

export default StoryView;
