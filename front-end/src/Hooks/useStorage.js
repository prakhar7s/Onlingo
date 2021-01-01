import { useState, useEffect } from "react";
import { projectStorage, projectFirestore } from "../firebase/config";

const useStorage = ({
  showPercentages,
  uploadBox,
  username,
  file,
  postPara,
}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    //references
    const storageRef = projectStorage
      .ref()
      .child("userPosts")
      .child(username + Math.random().toString());
    const collectionRef = projectFirestore
      .collection("users")
      .doc(username)
      .collection("posts");

    storageRef.put(file).on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (err) => {
        setError(err);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        const createdAt = new Date().toString();

        collectionRef.get().then((docs) => {
          collectionRef
            .doc(username + "POST" + (docs.size + 1).toString())
            .set({
              username,
              postID: username + "POST" + (docs.size + 1).toString(),
              postPara,
              url,
              createdAt,
              fileType: file.type,
              ownLike: false,
              likeCount: 0,
              commentCount: 0,
            });
        });
      }
    );
  }, [file]);

  return { progress, error };
};

export default useStorage;
