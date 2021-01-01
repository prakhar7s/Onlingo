import React from "react";
import { defaultDP } from "../../../../../../mostUsedVariables";
import "./CommentsMain.css";
import { Avatar, Button } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { projectFirestore } from "../../../../../../firebase/config";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import Moment from "react-moment";

function useComments(username, postID) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("comments")
      .where("postID", "==", postID)
      .onSnapshot((docs) => {
        const temp = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setComments(temp);
      });

    return () => unsub();
  }, []);

  return comments;
}

const useProfile = (username) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const u = projectFirestore
      .collection("users")
      .doc(username)
      .onSnapshot((snap) => {
        setUrl(snap.data().profilePic);
      });

    return () => u();
  }, []);

  return url;
};

const CommentsMain = ({ post, username }) => {
  const comments = useComments(post.username, post.postID);
  const url = useProfile(post.username);
  const commentMainVerticalMore = (e) => {
    const deleteButton = e.currentTarget.parentNode.childNodes[0];
    if (deleteButton.style.display == "flex") {
      deleteButton.style.display = "none";
    } else {
      deleteButton.style.display = "flex";
    }
  };

  const deleteTheComment = (comment) => {
    // if your post OR if posted comment
    if (
      username === comment.postID.split("POST")[0] ||
      username === comment.commentedBy
    ) {
      //reference
      const userRef = projectFirestore
        .collection("users")
        .doc(comment.postID.split("POST")[0]);
      //delete the comment doc
      userRef
        .collection("comments")
        .doc(comment.id)
        .get()
        .then((doc) => {
          doc.ref.delete();
          //delete the notification
          userRef
            .collection("notifications")
            .doc(doc.id)
            .get()
            .then((doc) => {
              if (doc.exists) {
                doc.ref.delete();
              }
            });
        });
      //decrese comment count
      userRef
        .collection("posts")
        .doc(comment.postID)
        .get()
        .then((doc) => {
          doc.ref.update({ commentCount: doc.data().commentCount - 1 });
        });
    } else {
      alert("You can't delete that comment.");
    }
  };
  return (
    <div className="commentsMain">
      {comments.length == 0 && (
        <>
          {" "}
          <div className="noComments__text">
            <h2>no comments</h2>
          </div>{" "}
        </>
      )}
      {comments
        .sort(function (a, b) {
          return b.commentedAt.seconds - a.commentedAt.seconds;
        })
        .map((comment) => (
          <div key={comment.id}>
            <div className="commentsMain__Container">
              <div className="commentsMain__avatar">
                <Avatar fontSize="small" src={defaultDP} />
              </div>
              <div className="commentsMain__CommentsContainer">
                <div className="commentsMain__UsernameTime">
                  <div className="commentsMain_UT">
                    <h1>{comment.commentedBy}</h1>
                    <p>
                      <Moment fromNow>{new Date(comment.commentedAt)}</Moment>
                    </p>
                  </div>
                  {/* <div className="commentsMain__likeButton">
                    <Button>
                      <FavoriteBorderIcon />
                    </Button>
                  </div> */}
                  <div className="commentMain__vertMoreButton">
                    <div
                      onClick={() => {
                        deleteTheComment(comment);
                      }}
                      className="deleteContainer"
                    >
                      <DeleteIcon />
                      <h2>delete</h2>
                    </div>
                    <Button
                      onClick={(e) => {
                        commentMainVerticalMore(e);
                      }}
                    >
                      <MoreVertIcon />
                    </Button>
                  </div>
                </div>
                <div className="commentsMain__comment">
                  <p>{comment.comment}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CommentsMain;
