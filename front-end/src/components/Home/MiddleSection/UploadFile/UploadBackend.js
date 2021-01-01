import React, { useEffect } from "react";
import useStorage from "../../../../Hooks/useStorage";
import "./UploadBackend.css";
const UploadBackend = ({
  username,
  file,
  postPara,
  setPost,
  showPercentages,
  uploadBox,
  setFile,
  resetFileName,
  resetFileSize,
  setParagraph,
}) => {
  var { progress } = useStorage({
    uploadBox,
    showPercentages,
    username,
    file,
    postPara,
  });
  console.log(progress);

  useEffect(() => {
    showPercentages.innerHTML = `uploading ${Math.round(progress)} %`;

    if (progress === 100) {
      resetFileName.innerHTML = "";
      resetFileSize.innerHTML = "";
      setFile("");
      setPost(false);
      setParagraph("");
      showPercentages.innerHTML = `Congratulations, your post has been published! 🤩`;
      setTimeout(() => {
        uploadBox.style.display = "none";
      }, 4000);
    }
  });
  return <div></div>;
};

export default UploadBackend;
