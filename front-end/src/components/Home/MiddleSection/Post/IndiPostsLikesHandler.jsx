// import React, { useEffect, useState } from "react";
// import { projectFirestore } from "../../../../firebase/config";
// import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

// const IndiPostsLikesHandler = ({ doc, username }) => {
//   // const likeStatus = useLikeStatus(doc, username);

//   const likesCount = useLike(doc);

//   const likeButton = (doc, e) => {
//     console.log("xxxx");
//     //selecting button for coloring
//     const likeButton = document.querySelectorAll(`.like${doc.postID}`)[0];
//     //is this user liked your post before or not
//     projectFirestore
//       .collection("users")
//       .doc(doc.username)
//       .collection("likes")
//       .where("likedBy", "==", username)
//       .where("postID", "==", doc.postID)
//       .onSnapshot((snapshot) => {
//         if (snapshot.size <= 0) {
//           //not liked before
//           //create a new like
//           projectFirestore
//             .collection("users")
//             .doc(doc.username)
//             .collection("likes")
//             .doc(Math.random().toString())
//             .set({
//               likedBy: username,
//               likesAt: new Date(),
//               postID: doc.postID,
//             });
//           //update likeCount in that post
//           projectFirestore
//             .collection("users")
//             .doc(doc.username)
//             .collection("posts")
//             .doc(doc.postID)
//             .get()
//             .then((doc) => {
//               doc.ref.update({ likeCount: doc.data().likeCount + 1 });
//             });

//           //updating ownLike
//           if (doc.username == username) {
//             projectFirestore
//               .collection("users")
//               .doc(doc.username)
//               .collection("posts")
//               .doc(doc.postID)
//               .get()
//               .then((doc) => {
//                 doc.ref.update({ ownLike: true });
//               });
//           }
//           //changing button color to blue
//           likeButton.style.color = "blue";
//         } else {
//           // update likeCount in that post
//           projectFirestore
//             .collection("users")
//             .doc(doc.username)
//             .collection("posts")
//             .doc(doc.postID)
//             .get()
//             .then((doc) => {
//               doc.ref.update({ likeCount: doc.data().likeCount - 1 });
//               if (doc.username == username) doc.ref.update({ ownLike: false });
//             });
//           // liked before
//           projectFirestore
//             .collection("users")
//             .doc(doc.username)
//             .collection("likes")
//             .where("likedBy", "==", username)
//             .where("postID", "==", doc.postID)
//             .get()
//             .then((snapshot) => {
//               snapshot.forEach((doc) => {
//                 doc.ref.delete();
//               });
//             });
//           //updating ownLike
//           if (doc.username == username) {
//             projectFirestore
//               .collection("users")
//               .doc(doc.username)
//               .collection("posts")
//               .doc(doc.postID)
//               .get()
//               .then((doc) => {
//                 doc.ref.update({ ownLike: false });
//               });
//           }
//           //changing button color to blue
//           likeButton.style.color = "black";
//         }
//       });
//   };

//   function useLike(doc) {
//     const [likesCount, setLikesCount] = useState(0);

//     useEffect(() => {
//       const unsubscribe = projectFirestore
//         .collection("users")
//         .doc(doc.username)
//         .collection("posts")
//         .doc(doc.postID)
//         .onSnapshot((snapshot) => {
//           setLikesCount(snapshot.data().likeCount);
//         });

//       return () => unsubscribe();
//     });

//     return likesCount;
//   }

//   return (
//     <div className="likeContainerN">
//       <div
//         onClick={(e) => likeButton(doc, e)}
//         // style={{ color: likeStatus ? "blue" : "black" }}
//       >
//         <FavoriteBorderIcon fontSize="small" className={`like${doc.postID}`} />
//       </div>
//       <h2 className="likeCount">{likesCount}</h2>
//     </div>
//   );
// };

// export default IndiPostsLikesHandler;
