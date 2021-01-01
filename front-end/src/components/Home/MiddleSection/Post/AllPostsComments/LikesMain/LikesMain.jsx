import React from "react";
import "./LikesMain.css";
import { projectFirestore } from "../../.../../../../../../firebase/config";
import { useState } from "react";
import { useEffect } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Moment from "react-moment";

function useLikes(username, postID) {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("likes")
      .where("postID", "==", postID)
      .onSnapshot((docs) => {
        const temp = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        setLikes(temp);
      });

    return () => unsub();
  }, []);

  return likes;
}

const LikesMain = ({ post }) => {
  const likes = useLikes(post.username, post.postID);

  return (
    <div>
      {likes.length == 0 && (
        <>
          {" "}
          <div className="noLikes__text">
            <h2>no likes</h2>
          </div>{" "}
        </>
      )}
      {likes.map((like) => (
        <div key={likes.id} className="likesMain">
          <div className="likesMain__icon">
            <FavoriteBorderIcon />
          </div>
          <h1>{like.likedBy}</h1>
          <h2>
            {/* {new Date(like.likesAt.seconds * 1000).toString().substring(0, 24)} */}
            <Moment fromNow>{new Date(like.likesAt)}</Moment>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default LikesMain;
