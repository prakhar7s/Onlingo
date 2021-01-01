import { Button } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { projectFirestore } from "../../../../../firebase/config";

import SendIcon from "@material-ui/icons/Send";

import "./AllPostsComments.css";
import CommentsMain from "./CommentsMain/CommentsMain";
import LikesMain from "./LikesMain/LikesMain";
import { musicCover } from "../../../../../mostUsedVariables";
import Moment from "react-moment";
const AllPostsComments = ({ post, username }) => {
  const [commentsRoute, setCommentsRoute] = useState("COMMENTS");
  const [comment, setComment] = useState("");

  //target
  const likesButton = document.querySelectorAll(
    ".allPostsComments__mainTop__Likes"
  )[0];

  const commentsButton = document.querySelectorAll(
    ".allPostsComments__mainTop__comments"
  )[0];

  const handleCommentsClose = (e) => {
    e.currentTarget.parentNode.parentNode.parentNode.style.display = "none";
  };

  const changeRouteToLikes = (e) => {
    setCommentsRoute("LIKES");
    //add border bottom
    e.currentTarget.parentNode.childNodes[0].classList.add(
      "allPostsComments__mainTop__bottomBorder"
    );
    //remove border bottom
    e.currentTarget.parentNode.childNodes[1].classList.remove(
      "allPostsComments__mainTop__bottomBorder"
    );
  };

  const changeRouteToComments = (e) => {
    setCommentsRoute("COMMENTS");
    //add border bottom
    e.currentTarget.parentNode.childNodes[1].classList.add(
      "allPostsComments__mainTop__bottomBorder"
    );
    //remove border bottom
    e.currentTarget.parentNode.childNodes[0].classList.remove(
      "allPostsComments__mainTop__bottomBorder"
    );
  };

  const handlePostComment = (e) => {
    console.log(comment.length);
    console.log(comment);
    if (comment.length != 0) {
      const docID = Math.random().toString();
      //user reference
      const profileRef = projectFirestore
        .collection("users")
        .doc(post.username);
      //new comment
      profileRef.collection("comments").doc(docID).set({
        commentedBy: username,
        commentedAt: new Date().toString(),
        comment,
        postID: post.postID,
      });
      //increase commentCount
      profileRef
        .collection("posts")
        .doc(post.postID)
        .get()
        .then((doc) => {
          doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        });
      // reset comment input
      e.currentTarget.parentNode.firstChild.value = "";
      //create notification of comment if user is other than U
      if (post.username != username) {
        projectFirestore
          .collection("users")
          .doc(post.username)
          .collection("notifications")
          .doc(docID)
          .set({
            who: username,
            at: new Date().toString(),
            type: "comment",
            postID: post.postID,
          });
      }
    }
    setComment("");
  };

  return (
    <div className="allPostsComments">
      <div className="allPostsComments__closeButton">
        <h2>{"Post details...."}</h2>
        <button onClick={(e) => handleCommentsClose(e)}>x</button>
      </div>
      <div className="allPostsCommentsMainContainer">
        <div className="allPostsCommentsMainLeft">
          <div className="allPostsCommentsMainLeft__postPreview">
            {post.fileType.startsWith("image") && <img src={post.url} />}
            {post.fileType.startsWith("video") && (
              <video src={post.url} controls></video>
            )}
            {post.fileType.startsWith("audio") && (
              <div className="sd">
                <audio src={post.url} controls></audio>
                <img src={musicCover} />
              </div>
            )}
          </div>
          <div className="allPostsCommentsMainLeft__postParagraph">
            <p>{post.postPara}</p>
          </div>
          <div className="allPostsCommentsMainLeft__postFigures">
            <div className="allPostsCommentsMainLeft__postFiguresLikes">
              <h2>Likes:</h2>
              <h1>{post.likeCount}</h1>
            </div>
            <div className="allPostsCommentsMainLeft__postFiguresComments">
              <h2>Comments:</h2>
              <h1>{post.commentCount}</h1>
            </div>
            <div className="allPostsCommentsMainLeft__commentedAtt">
              <Moment fromNow>{new Date(post.createdAt)}</Moment>
            </div>
          </div>
        </div>
        <div className="allPostsCommentsMainRight">
          <div className="allPostsComments__mainTop">
            <h2
              onClick={(e) => {
                changeRouteToLikes(e);
              }}
              className="allPostsComments__mainTop__Likes"
            >
              Likes
            </h2>
            <h2
              onClick={(e) => {
                changeRouteToComments(e);
              }}
              className="allPostsComments__mainTop__Comments allPostsComments__mainTop__bottomBorder"
            >
              Comments
            </h2>
          </div>
          <div className="allPostsComments__mainMiddle">
            {commentsRoute == "COMMENTS" && (
              <CommentsMain username={username} post={post} />
            )}
            {commentsRoute == "LIKES" && <LikesMain post={post} />}
          </div>
          <div className="allPostsComments__mainBottom">
            <textarea
              onChange={(e) => {
                setComment(e.target.value);
              }}
              type="text"
              className="commentInput"
            ></textarea>
            <button
              onClick={(e) => {
                handlePostComment(e);
              }}
            >
              <SendIcon />
            </button>
            <div className="allPostsComments__mainBottomEmojis">
              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;
                  setComment(comment + e.currentTarget.textContent);
                }}
              >
                &#128514;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;
                  setComment(comment + e.currentTarget.textContent);
                }}
              >
                &#128516;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;
                  setComment(comment + e.currentTarget.textContent);
                }}
              >
                &#128540;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;
                  setComment(comment + e.currentTarget.textContent);
                }}
              >
                &#128526;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;
                  setComment(comment + e.currentTarget.textContent);
                }}
              >
                &#128558;
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPostsComments;
