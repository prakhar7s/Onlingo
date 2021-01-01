import React from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CommentIcon from "@material-ui/icons/Comment";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { projectFirestore } from "../../../../firebase/config";
import AllPostsComments from "./AllPostsComments/AllPostsComments";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { formatDateAndTime } from "../../../../functions/mostUsedFunctions";
import { musicCover } from "../../../../mostUsedVariables";
import Moment from "react-moment";
function useLike(doc) {
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("users")
      .doc(doc.username)
      .collection("posts")
      .doc(doc.postID)
      .onSnapshot((snapshot) => {
        // debugger;
        setLikesCount(snapshot.data().likeCount);
      });

    return () => unsubscribe();
  }, [likesCount]);

  return likesCount;
}

function useComment(doc) {
  const [cCounts, setCCounts] = useState(0);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("users")
      .doc(doc.username)
      .collection("posts")
      .doc(doc.postID)
      .onSnapshot((snapshot) => {
        setCCounts(snapshot.data().commentCount);
      });

    return () => unsubscribe();
  }, [cCounts]);

  return cCounts;
}

function usePic(doc) {
  const [pic, setPic] = useState(0);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("users")
      .doc(doc.username)
      .onSnapshot((snapshot) => {
        setPic(snapshot.data().profilePic);
      });

    return () => unsubscribe();
  }, [pic]);

  return pic;
}

function useLikeStatus(doc, username) {
  const [likeStatus, setLikeStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("users")
      .doc(doc.username)
      .collection("likes")
      .where("likedBy", "==", username)
      .where("postID", "==", doc.postID)
      .onSnapshot((docs) => {
        setLikeStatus(docs.size ? true : false);
      });

    return () => unsubscribe();
  }, [username]);

  return likeStatus;
}

const PostIndi = ({ doc, username, displayAs, id, setNoPosts }) => {
  const likesCount = useLike(doc);
  const commentCount = useComment(doc);
  const profilePic = usePic(doc);

  useEffect(() => {
    setNoPosts(false);
  }, []);

  //for small posts
  function checkPreviousLike(likeBtn) {
    if (likeBtn) {
      projectFirestore
        .collection("users")
        .doc(doc.username)
        .collection("likes")
        .where("likedBy", "==", username)
        .where("postID", "==", doc.postID)
        .get()
        .then((docs) => {
          if (docs.size) {
            // old
            // likeBtn.style.color = "blue";
            // new
            // if (likeBtn.parentElement.childNodes[1]) {
            // console.log(displayAs);
            likeBtn.parentElement.childNodes[1].classList.add("active");
            // }
          } else {
            // old
            // likeBtn.style.color = "white";
          }
        });
    }
  }

  //for big posts
  const likeStatus = useLikeStatus(doc, username);

  const commentsContainer = document.querySelector(`.${doc.postID}`);

  const likeButton = (doc, e) => {
    //selecting button for coloring
    const likeButton = document.querySelectorAll(`.like${doc.postID}`)[0];
    //is this user liked your post before or not
    projectFirestore
      .collection("users")
      .doc(doc.username)
      .collection("likes")
      .where("likedBy", "==", username)
      .where("postID", "==", doc.postID)
      .get()
      .then((snapshot) => {
        if (snapshot.size <= 0) {
          //not liked before
          //create a new like
          projectFirestore
            .collection("users")
            .doc(doc.username)
            .collection("likes")
            .doc(Math.random().toString())
            .set({
              likedBy: username,
              likesAt: new Date().toString(),
              postID: doc.postID,
            });
          //update likeCount in that post
          projectFirestore
            .collection("users")
            .doc(doc.username)
            .collection("posts")
            .doc(doc.postID)
            .get()
            .then((doc) => {
              doc.ref.update({ likeCount: doc.data().likeCount + 1 });
            });

          //updating ownLike
          if (doc.username == username) {
            projectFirestore
              .collection("users")
              .doc(doc.username)
              .collection("posts")
              .doc(doc.postID)
              .get()
              .then((doc) => {
                doc.ref.update({ ownLike: true });
              });
          }
          //create notifi
          if (doc.username != username) {
            projectFirestore
              .collection("users")
              .doc(doc.username)
              .collection("notifications")
              .doc(username + "Likes" + doc.postID)
              .set({
                type: "like",
                at: new Date().toString(),
                who: username,
                postID: doc.postID,
              });
          }
          //changing button color to blue
          // likeButton.style.color = "blue";
        } else {
          // update likeCount in that post
          projectFirestore
            .collection("users")
            .doc(doc.username)
            .collection("posts")
            .doc(doc.postID)
            .get()
            .then((doc) => {
              doc.ref.update({ likeCount: doc.data().likeCount - 1 });
              if (doc.username == username) doc.ref.update({ ownLike: false });
            });
          // liked before
          projectFirestore
            .collection("users")
            .doc(doc.username)
            .collection("likes")
            .where("likedBy", "==", username)
            .where("postID", "==", doc.postID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                doc.ref.delete();
              });
            });
          //updating ownLike
          if (doc.username == username) {
            projectFirestore
              .collection("users")
              .doc(doc.username)
              .collection("posts")
              .doc(doc.postID)
              .get()
              .then((doc) => {
                doc.ref.update({ ownLike: false });
              });
          }
          // delete intifi
          if (username != doc.username) {
            projectFirestore
              .collection("users")
              .doc(doc.username)
              .collection("notifications")
              .doc(username + "Likes" + doc.postID)
              .get()
              .then((doc) => doc.ref.delete());
          }
          //changing button color to blue
          // likeButton.style.color = "white";
        }
      });
  };

  const handleComments = (doc, e) => {
    //Display comments
    commentsContainer.style.display = "flex";
  };
  useEffect(() => {
    if (displayAs == "!single") {
      {
        checkPreviousLike(document.querySelector(`.like${doc.postID}`));
      }
    }
  });
  return (
    <>
      <div className={`allPost__CommentsContainer ${doc.postID}`} key={id}>
        <AllPostsComments post={doc} username={username} />
      </div>
      {displayAs == "single" ? (
        <>
          <div className="post__container" key={id}>
            <div className="post__userInfo">
              <div className="profilePic">
                <img src={profilePic} alt="profilepic" />
              </div>{" "}
              <div className="username__timestamp">
                <h2>{doc.username}</h2>
                <h4 className="username__timestamp__fulll">{doc.createdAt}</h4>
                <Moment fromNow>{new Date(doc.createdAt)}</Moment>
              </div>
            </div>
            <div className="post__p">{doc.postPara}</div>
            {doc.fileType.startsWith("image") && (
              <div className="post__picture">
                <div className="trick"></div>
                <img src={doc.url} alt="postPic" />
              </div>
            )}
            {doc.fileType.startsWith("video") && (
              <div className="post__video">
                <video src={doc.url} controls></video>
              </div>
            )}
            {doc.fileType.startsWith("audio") && (
              <div className="post__audio">
                <audio controls>
                  <source src={doc.url} type="audio/mpeg" />
                </audio>
              </div>
            )}
            <div className="post__options">
              <div className="likeContainer">
                <Button
                  onClick={(e) => likeButton(doc, e)}
                  style={{ color: likeStatus ? "blue" : "black" }}
                >
                  <ThumbUpIcon className={`like${doc.postID}`} />
                </Button>
                <h2 className="likeCount">{likesCount}</h2>
              </div>
              <div className="commentContainer">
                <Button onClick={(e) => handleComments(doc, e)}>
                  <CommentIcon />
                </Button>
                <h2 className="commentCount">{commentCount}</h2>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="post__containerNewStyle" key={id}>
            {doc.fileType.startsWith("image") && (
              <div className="post__picture">
                <img src={doc.url} alt="postPic" />
              </div>
            )}
            {doc.fileType.startsWith("video") && (
              <div className="post__video">
                <video src={doc.url} controls></video>
              </div>
            )}
            {doc.fileType.startsWith("audio") && (
              <div className="post__audio">
                <img src={musicCover} />
                <audio controls>
                  <source src={doc.url} type="audio/mpeg" />
                </audio>
              </div>
            )}

            <div className="indiPostNewStyleProfileAndLikes">
              <div className="post__userInfoN">
                <div className="profilePicN">
                  <img src={profilePic} alt="profilepic" />
                </div>
                <div className="post__optionsN">
                  <h2>{doc.username}</h2>
                  <h4>
                    {new Date(doc.createdAt * 1000)
                      .toString()
                      .substring(0, 10) +
                      new Date(doc.createdAt * 1000)
                        .toString()
                        .substring(15, 25)}
                  </h4>
                </div>
              </div>

              <div className="post__optionsN">
                <div className="likeContainerN">
                  <div onClick={(e) => likeButton(doc, e)}>
                    <FavoriteBorderIcon
                      fontSize="small"
                      className={`like${doc.postID}`}
                    />
                    <div
                      className="heartAnimation"
                      onClick={(e) => e.target.classList.toggle("active")}
                    ></div>
                  </div>

                  <h2 className="likeCount">{likesCount}</h2>
                </div>
                <div className="commentContainerN">
                  <div onClick={(e) => handleComments(doc, e)}>
                    <CommentIcon fontSize="medium" />
                  </div>
                  <h2 className="commentCountN">{commentCount}</h2>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PostIndi;
