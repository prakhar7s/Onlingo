import React, { useEffect, useState } from "react";
import "./IndividualNotifications.css";
import SpecificProfile from "../../ProfileSearch/SpecificProfile/SpecificProfile";
import useProfile from "../../../../../Hooks/useProfile";
import AllPostsComments from "../../Post/AllPostsComments/AllPostsComments";
import { projectFirestore } from "../../../../../firebase/config";
import Moment from "react-moment";

const IndividualNotifications = ({ type, who, at, username, post }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showPost, setShowPost] = useState(false);

  const [postInfo, setPostInfo] = useState([]);
  useEffect(() => {
    if (post !== "not") {
      username = post.split("POST")[0];
      const un = projectFirestore
        .collection("users")
        .doc(username)
        .collection("posts")
        .doc(post)
        .onSnapshot((doc) => {
          setPostInfo({ ...doc.data() });
        });

      return () => un();
    }
  }, []);

  const whoInfo = useProfile(who);
  return (
    <>
      <div className="individualNotifications">
        <div className="individualNotifications__DPP">
          <img src={whoInfo.profilePic} alt="src" />
        </div>
        <div className="individualNotifications__VerticalLine"></div>
        <div className="individualNotifications__line">
          <h2>{who}</h2>
          {type == "like" && <p> liked your post. </p>}
          {type == "friend request" && <p> has send you a friend request. </p>}
          {type == "friends" && <p> and you are now friends. </p>}
          {type == "comment" && <p> commented on your post. </p>}
          <div className="individualNotifications__time">
            {/* <h1>{`at ${new Date(at.seconds * 1000)
              .toString()
              .substring(0, 24)}`}</h1> */}
            <Moment fromNow>{new Date(at)}</Moment>
            {/* <h1> ({new Date(at).toString().substring(0, 24)})</h1> */}
          </div>
          {type == "friend request" && (
            <div className="individualNotifications__button">
              <button onClick={() => setShowProfile(true)}>View Profile</button>
            </div>
          )}
          {type == "friends" && (
            <div className="individualNotifications__button">
              <button onClick={() => setShowProfile(true)}>View Profile</button>
            </div>
          )}
          {type == "like" && (
            <div className="individualNotifications__button">
              <button
                onClick={() => {
                  setShowPost(true);
                  console.log(post);
                }}
              >
                See Post
              </button>
            </div>
          )}
          {type == "comment" && (
            <div className="individualNotifications__button">
              <button
                onClick={() => {
                  setShowPost(true);
                  console.log(post);
                }}
              >
                See Post
              </button>
            </div>
          )}
        </div>
      </div>
      {showProfile && (
        <div className="userProfileInNotification">
          <button
            className="userProfileInNotification__closeButton"
            onClick={() => setShowProfile(false)}
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <SpecificProfile ownProfile={username} profile={who} />
        </div>
      )}
      {showPost && (
        <div className="userProfileInNotification">
          <button
            className="userProfileInNotification__closeButton"
            onClick={() => setShowPost(false)}
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <AllPostsComments username={username} post={postInfo} />
        </div>
      )}
    </>
  );
};

export default IndividualNotifications;
