import React, { useRef, useState } from "react";
import "./SpecificProfileAllPosts.css";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CommentIcon from "@material-ui/icons/Comment";
import { useEffect } from "react";
import {
  projectFirestore,
  projectStorage,
} from "../../../../../../firebase/config";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { FavoriteRounded } from "@material-ui/icons";
import { musicCover } from "../../../../../../mostUsedVariables";
import AllPostsComments from "../../../Post/AllPostsComments/AllPostsComments";
//Hook
function usePosts(profile) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("users")
      .doc(profile)
      .collection("posts")
      .onSnapshot((snapshot) => {
        const temp = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(temp);
      });

    return () => unsubscribe();
  }, []);

  return posts;
}

const SpecificProfileAllPosts = ({ profile }) => {
  const userPosts = usePosts(profile);

  function deletePOST(post) {
    if (window.confirm(`${profile} are you sure?`)) {
      const userRef = projectFirestore.collection("users").doc(profile);
      //delete file used in the post
      userRef
        .collection("posts")
        .doc(post)
        .get()
        .then((doc) => {
          projectStorage
            .refFromURL(doc.data().url)
            .delete()
            .then(() => {
              console.log("del");
            })
            .catch((err) => console.log(err));
        });
      //delete post
      userRef
        .collection("posts")
        .doc(post)
        .get()
        .then((doc) => doc.ref.delete());
      //delete likes
      userRef
        .collection("likes")
        .where("postID", "==", post)
        .get()
        .then((docs) => {
          if (docs.size) {
            docs.docs.map((doc) => doc.ref.delete());
          }
        });
      //delete comments
      userRef
        .collection("comments")
        .where("postID", "==", post)
        .get()
        .then((docs) => {
          if (docs.size) {
            docs.docs.map((doc) => {
              doc.ref.delete();
            });
          }
        });
      //delete noti
      userRef
        .collection("notifications")
        .where("postID", "==", post)
        .get()
        .then((docs) => {
          if (docs.size) {
            docs.docs.map((doc) => {
              doc.ref.delete();
            });
          }
        });
    }
  }

  return (
    <div>
      {userPosts.map((post) => (
        <div key={post.id}>
          <div className="specificProfileAllPosts">
            {/* all comments */}
            <div className={`specificProfile__allPostsIndiComments${post.id}`}>
              <AllPostsComments post={post} username={profile} />
            </div>
            {/* if post has photo */}
            {post.fileType.startsWith("image") && (
              <div className="specificProfileAllPosts__image">
                {!post.url && <h1>Loading</h1>}
                {post.url && <img src={post.url} alt="" />}

                <div className="specificProfileAllPosts__message">
                  <h2>{post.postPara}</h2>
                  <div className="specificProfile__likesComments">
                    <button
                      onClick={() => deletePOST(post.postID)}
                      className="specificProfileAllPosts__deletePOST"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i>
                      <span>(delete post)</span>{" "}
                    </button>

                    <div className="specificProfile__likes">
                      <FavoriteRounded /> <h1>{post.likeCount}</h1>
                    </div>
                    <div
                      onClick={() => {
                        console.log("x");
                        document.querySelector(
                          `.specificProfile__allPostsIndiComments${post.id}`
                        ).style.display = "flex";
                      }}
                      className="specificProfile__Comments"
                    >
                      <CommentIcon />
                      <h1>{post.commentCount}</h1>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* if post has video */}
            {post.fileType.startsWith("video") && (
              <>
                <div className="specificProfileAllPosts__video">
                  <video src={post.url} controls></video>
                  <div className="specificProfileAllPosts__VideoMessage">
                    <h2>{post.postPara}</h2>
                    <div className="specificProfile__likesComments">
                      <button
                        onClick={() => deletePOST(post.postID)}
                        className="specificProfileAllPosts__deletePOST"
                      >
                        <i class="fa fa-trash" aria-hidden="true"></i>
                        <span>(delete post)</span>
                      </button>
                      <div className="specificProfile__likes">
                        <FavoriteBorderIcon />
                        <h1>{post.likeCount}</h1>
                      </div>
                      <div
                        className="specificProfile__Comments"
                        onClick={() => {
                          document.querySelector(
                            `.specificProfile__allPostsIndiComments${post.id}`
                          ).style.display = "flex";
                        }}
                      >
                        <CommentIcon />
                        <h1>{post.commentCount}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* if post has music */}
            {post.fileType.startsWith("audio") && (
              <div className="specificProfileAllPosts__song">
                <div className="specificProfileAllPosts__songCover">
                  <img src={musicCover} />
                </div>

                <audio src={post.url} controls></audio>
                <div className="specificProfileAllPosts__AudioMessage">
                  <h2>{post.postPara}</h2>
                  <div className="specificProfile__likesComments">
                    <button
                      onClick={() => deletePOST(post.postID)}
                      className="specificProfileAllPosts__deletePOST"
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i>
                      <span>(delete post)</span>{" "}
                    </button>

                    <div className="specificProfile__likes">
                      <FavoriteRounded /> <h1>{post.likeCount}</h1>
                    </div>
                    <div
                      onClick={() => {
                        console.log("x");
                        document.querySelector(
                          `.specificProfile__allPostsIndiComments${post.id}`
                        ).style.display = "flex";
                      }}
                      className="specificProfile__Comments"
                    >
                      <CommentIcon />
                      <h1>{post.commentCount}</h1>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {userPosts.length < 1 && (
        <h1 className="noPostsInUserHomePage">
          {profile} haven't uploaded any post yet.
        </h1>
      )}
    </div>
  );
};

export default SpecificProfileAllPosts;
