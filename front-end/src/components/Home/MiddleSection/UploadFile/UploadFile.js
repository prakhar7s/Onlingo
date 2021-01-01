import React, { useEffect, useState } from "react";
import UploadBackend from "./UploadBackend";
import "./UploadFile.css";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SendIcon from "@material-ui/icons/Send";

const UploadFile = ({ username }) => {
  const [file, setFile] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [post, setPost] = useState(false);

  //Drag and drop
  const dragOver = (e) => {
    e.preventDefault();
    const dragzone = document.querySelector(".dragzone");
    dragzone.className = "dragzone fileDrop";
  };

  const dragLeave = (e) => {
    const dragzone = document.querySelector(".dragzone");
    dragzone.className = "dragzone";
  };

  const drop = (e) => {
    e.preventDefault();
    const dragzone = document.querySelector(".dragzone");
    dragzone.className = "dragzone";
    setFile(e.dataTransfer.files[0]);

    if (document.querySelectorAll(".seletedFile__size")[0]) {
      document.querySelectorAll(
        ".seletedFile__size"
      )[0].innerHTML = `file size : ${
        Math.round(
          (e.dataTransfer.files[0].size / 1000000 + Number.EPSILON) * 100
        ) / 100
      } MB`;
    }
    // if (e.dataTransfer.files[0].name.length > 25) {
    //   const file = e.dataTransfer.files[0].name.split(".");
    //   document.querySelectorAll(
    //     ".seletedFile__name"
    //   )[0].innerHTML = `file name : ${file[0].substring(0, 25)}....${file[1]}`;
    // } else {
    //   document.querySelectorAll(
    //     ".seletedFile__name"
    //   )[0].innerHTML = `file name : ${e.dataTransfer.files[0].name}`;
    // }
    document.querySelectorAll(
      ".seletedFile__name"
    )[0].innerHTML = `file name : ${e.dataTransfer.files[0].name}`;
  };

  //select using button
  const selectButton = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      if (document.querySelectorAll(".seletedFile__size")[0]) {
        document.querySelectorAll(
          ".seletedFile__size"
        )[0].innerHTML = `file size : ${
          Math.round(
            (e.target.files[0].size / 1000000 + Number.EPSILON) * 100
          ) / 100
        } MB`;
      }
      // if (e.target.files[0].name.length > 20) {
      //   const file = e.target.files[0].name.split(".");
      //   document.querySelectorAll(
      //     ".seletedFile__name"
      //   )[0].innerHTML = `file name : ${file[0].substring(0, 20)}....${
      //     file[1]
      //   }`;
      // } else {
      //   document.querySelectorAll(
      //     ".seletedFile__name"
      //   )[0].innerHTML = `file name : ${e.target.files[0].name}`;
      // }

      document.querySelectorAll(
        ".seletedFile__name"
      )[0].innerHTML = `file name : ${e.target.files[0].name}`;
    } else {
      setFile("");
      document.querySelectorAll(".seletedFile__name")[0].innerHTML = "";
      document.querySelectorAll(".seletedFile__size")[0].innerHTML = "";
    }
  };

  //post paragraph
  const postParagraph = (e) => {
    setParagraph(e.target.value);
  };

  //post
  const submitPost = (e) => {
    setPost(true);
    e.currentTarget.parentNode.parentNode.firstChild.value = "";
    document.querySelectorAll(".uploadingBarContainer")[0].style.display =
      "flex";
  };

  //unselect file
  const crossClick = () => {
    setFile("");
    document.querySelectorAll(".seletedFile__size")[0].innerHTML = "";
    document.querySelectorAll(".seletedFile__name")[0].innerHTML = "";
  };

  return (
    <div className="uploadFile">
      <div className="uploadContainer">
        <div className="heading">
          <h1>Upload</h1>
        </div>
        <div className="fileUpload">
          <div className="dragFile">
            <h1>Drag file here</h1>
            <div
              onDragOver={(e) => dragOver(e)}
              onDragLeave={(e) => dragLeave(e)}
              onDrop={(e) => drop(e)}
              className="dragzone"
            ></div>
          </div>
          <div className="lineContainer">
            <div className="line"></div>
            <h1>OR</h1>
            <div className="line"></div>
          </div>
          <div className="selectFile">
            <h1>Select file</h1>
            <div className="selectTo__upload">
              <input
                onChange={(e) => selectButton(e)}
                type="file"
                className="file"
              />
            </div>
          </div>
          <div className="verticalLine"></div>
          <div className="selectedFiles">
            <h1>Selected files</h1>
            <div className="fileContainer">
              {file && (
                <div className="imageContainer">
                  {file.type.startsWith("image") && (
                    <img
                      className="img"
                      src={URL.createObjectURL(file)}
                      alt="Selected file"
                    ></img>
                  )}
                  {file.type.startsWith("video") && (
                    <video
                      className="video"
                      src={URL.createObjectURL(file)}
                      alt="Selected file"
                      controls
                    ></video>
                  )}
                  {file.type.startsWith("audio") && (
                    <audio
                      className="audio"
                      src={URL.createObjectURL(file)}
                      alt="Selected file"
                      controls
                    ></audio>
                  )}
                  <button onClick={crossClick} className="crossButton">
                    X
                  </button>
                </div>
              )}

              {!file && (
                <h1 className="noSelection__message">No file picked.</h1>
              )}
            </div>
          </div>
          <div className="fileInformation__SizeName">
            <h2 className="seletedFile__name"></h2>
            <h2 className="seletedFile__size"></h2>
          </div>
        </div>
        <div className="message">
          <textarea
            type="text"
            placeholder={`${username}, What's on your mind?`}
            onChange={(e) => postParagraph(e)}
          ></textarea>
          <div className="messageEmojiAndButton">
            <button onClick={(e) => submitPost(e)}>
              <SendIcon />
            </button>
            <div className="emojiContainer">
              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;

                  setParagraph(paragraph + e.currentTarget.textContent);
                }}
              >
                &#128514;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;

                  setParagraph(paragraph + e.currentTarget.textContent);
                }}
              >
                &#128516;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;

                  setParagraph(paragraph + e.currentTarget.textContent);
                }}
              >
                &#128540;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;

                  setParagraph(paragraph + e.currentTarget.textContent);
                }}
              >
                &#128526;
              </h2>

              <h2
                onClick={(e) => {
                  e.currentTarget.parentNode.parentNode.parentNode.firstChild.value +=
                    e.currentTarget.textContent;

                  setParagraph(paragraph + e.currentTarget.textContent);
                }}
              >
                &#128558;
              </h2>
            </div>
          </div>
        </div>
        <div className="uploadingBarContainer">
          <div className="uploadingBar">
            <i className="fas fa-cloud"></i>
            <div className="uploadingBar__arrow">
              <ArrowUpwardIcon />
            </div>
          </div>
          <h1 className="uploadingBar__Percenntages"></h1>
        </div>
      </div>

      {post && (
        <UploadBackend
          username={username}
          setPost={setPost}
          file={file}
          postPara={paragraph}
          showPercentages={
            document.querySelectorAll(".uploadingBar__Percenntages")[0]
          }
          uploadBox={document.querySelectorAll(".uploadingBarContainer")[0]}
          setFile={setFile}
          resetFileName={document.querySelectorAll(".seletedFile__name")[0]}
          resetFileSize={document.querySelectorAll(".seletedFile__size")[0]}
          setParagraph={setParagraph}
        />
      )}
    </div>
  );
};

export default UploadFile;
