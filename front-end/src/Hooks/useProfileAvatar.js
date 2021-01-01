import { useState, useEffect } from "react";
import { projectStorage, projectFirestore } from "../firebase/config";

const useProfileAvatar = ({ username, file }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    //references
    const storageRef = projectStorage.ref(file.name);
    const collectionRef = projectFirestore.collection("users").doc(username);

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

        collectionRef.get().then((docs) => {
          collectionRef.get().then((doc) => {
            doc.ref.update({ profilePic: url });
          });
        });
        setUrl(url);
      }
    );
  }, [file]);

  return { progress, error, url };
};

export default useProfileAvatar;
