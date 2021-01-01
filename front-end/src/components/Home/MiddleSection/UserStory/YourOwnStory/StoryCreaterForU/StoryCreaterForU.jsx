import React, { useEffect, useRef, useState } from "react";
import "./StoryCreaterForU.css";
import {
  projectFirestore,
  projectStorage,
} from "../../../../../../firebase/config";

const StoryCreaterForU = ({ setStoryCreater, username, uploadingStatus }) => {
  const [storyPhoto, setStoryPhoto] = useState("");
  const [wannaWrite, setWannaWrite] = useState(false);
  const [enteredText, setEnteredText] = useState("");
  const [textHelp, setTextHelp] = useState("");
  const [textSize, setTextSize] = useState("24px");
  const [textColor, setTextColor] = useState({
    webkitTextFillColor: "transparent",
    backgroundImage: `-webkit-repeating-linear-gradient(10deg, #ffa000, #ff5000 30%`,
  });
  const [textStyle, setTextStyle] = useState("Roboto");
  const [textWeight, setFontWeight] = useState("normal");
  const [bkColor, setBkColor] = useState("black");
  const backRef = useRef();
  const writeSomething = useRef();
  const textRef = useRef();
  const uploadingRef = useRef();
  function handleStoryPhoto(e) {
    if (e.target.files[0]) {
      setStoryPhoto(e.target.files[0]);
      setBkColor("");
    }
  }

  function uploadStory() {
    // if file then upload file
    uploadingStatus.current.style.cssText =
      "color: white;background-color: rgba(8, 8, 8, 0.233);backdrop-filter: blur(6px);position: fixed;height: 100%;width: 100%;top: 0;left: 0;text-align: center;line-height: 600px;font-family: 'Cairo',sans-serif;font-size: 24px;z-index: 1;";

    if (storyPhoto) {
      const storyRef = projectStorage
        .ref()
        .child("userStories")
        .child(username + "_story")
        .put(storyPhoto);
      storyRef.on(
        "state_changed",
        (snap) => {
          console.log((snap.bytesTransferred / snap.totalBytes) * 100);
          uploadingStatus.current.innerHTML = `Uploading your story... ${Math.floor(
            (snap.bytesTransferred / snap.totalBytes) * 100
          )} %`;
        },
        (error) => {},
        async () => {
          const url = await storyRef.snapshot.ref.getDownloadURL();
          const currentDate = new Date();

          uploadingStatus.current.innerHTML = `Congratulations! Your story has been uploaded. 🤩 🎉`;

          setTimeout(() => {
            uploadingStatus.current.innerHTML = "";
            uploadingStatus.current.style.display = "none";
          }, 2000);
          //DB

          projectFirestore
            .collection("users")
            .doc(username)
            .collection("story")
            .doc(username + "story")
            .set({
              storyBG: url,
              createdAt: currentDate.toString(),
              expiredAt: new Date(
                currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
              ).toString(),
              fontWeight: textWeight || "normal",
              fontSize: textSize || "18px",
              fontStyle: textStyle || "Roboto",
              fontColor: textColor || "white",
              text: enteredText,
            });
        }
      );
    } else {
      const currentDate = new Date();

      // DB
      projectFirestore
        .collection("users")
        .doc(username)
        .collection("story")
        .doc(username + "story")
        .set({
          storyBG: bkColor,
          createdAt: currentDate.toString(),
          expiredAt: new Date(
            currentDate.getTime() + 1 * 24 * 60 * 60 * 1000
          ).toString(),
          fontWeight: textWeight || "normal",
          fontSize: textSize || "18px",
          fontStyle: textStyle || "Roboto",
          fontColor: textColor || "white",
          text: enteredText,
        });
      uploadingStatus.current.innerHTML = `Congratulations! Your story has been uploaded. 🤩 🎉`;

      setTimeout(() => {
        uploadingStatus.current.innerHTML = "";
        uploadingStatus.current.style.display = "none";
      }, 2000);
    }
    //cleanup
    setStoryPhoto("");
    setBkColor("");
    setEnteredText("");
    setTextHelp("");
    setTextColor("");
    setTextSize("");
    setTextStyle("");
    setFontWeight("");
    setStoryCreater(false);
  }

  function unselectFile() {
    setBkColor("tomato");
    setStoryPhoto("");
  }
  const [rgbgi, setRGBGI] = useState(0);
  function randomGradBackgrounds() {
    setStoryPhoto("");

    const bkGrads = [
      ["4567b2", "8ab9ff"],
      ["76ad39", "cdff8a"],
      ["d62442", "ebce28"],
      ["36d1dc", "5b86e5"],
      ["5667dd", "5ecbf7"],
      ["fad961", "f76b1c"],
      ["4568dc", "b06ab3"],
      ["d64b7d", "ee4658"],
      ["ffe53b", "ff2525"],
      ["21d4fd", "b721ff"],
      ["c4e759", "6de195"],
      ["54e3be", "41c7af"],
      ["d4fc78", "99e5a2"],
      ["c1e3ff", "abc7ff"],
      ["323B42", "121317"],
      ["fdeb82", "f78fad"],
      ["f0eff0", "faf8f9"],
      ["f1eef9", "f5ccf6"],
    ];

    const rand = bkGrads[rgbgi];
    console.log(rand);
    setRGBGI(rgbgi + 1);
    if (rgbgi + 1 >= bkGrads.length) setRGBGI(0);
    console.log(rgbgi);

    backRef.current.style.background = `linear-gradient(#${rand[0]}, #${rand[1]}`;

    setBkColor(`${rand[0]}#${rand[1]}`);
  }

  const [gradTextI, setGradTextI] = useState(0);

  const handleGradientText = () => {
    const textGradients = [
      ["4567b2", "8ab9ff"],
      ["76ad39", "cdff8a"],
      ["d62442", "ebce28"],
      ["36d1dc", "5b86e5"],
      ["5667dd", "5ecbf7"],
      ["fad961", "f76b1c"],
      ["4568dc", "b06ab3"],
      ["d64b7d", "ee4658"],
      ["ffe53b", "ff2525"],
      ["21d4fd", "b721ff"],
      ["c4e759", "6de195"],
      ["54e3be", "41c7af"],
      ["d4fc78", "99e5a2"],
      ["c1e3ff", "abc7ff"],
      ["323B42", "121317"],
      ["fdeb82", "f78fad"],
      ["f0eff0", "faf8f9"],
      ["f1eef9", "f5ccf6"],
    ];
    const randomGradient = textGradients[gradTextI];

    setTextColor({
      webkitTextFillColor: "transparent",
      backgroundImage: `-webkit-repeating-linear-gradient(130deg, #${randomGradient[0]}, #${randomGradient[1]} 30%)`,
    });

    setGradTextI(gradTextI + 1);
    if (gradTextI + 1 >= textGradients.length) setGradTextI(0);
  };

  function handleNormalTextColor() {
    const bksText = [
      "aqua",
      "blue",
      "brown",
      "chocolate",
      "green",
      "cornflowerblue",
      "deeppink",
      "coral",
      "chartreuse",
      "tomato",
      "orange",
      "black",
      "navy",
      "indianred",
      "seagreen",
      "midnightblue",
      "darkcyan",
      "white",
    ];

    setTextColor({
      color: `${bksText[Math.floor(Math.random() * bksText.length)]}`,
    });
  }

  const [randBGI, setRandomBGI] = useState(0);

  function randomBackgrounds() {
    setStoryPhoto("");

    const backgrounds = [
      "aqua",
      "blue",
      "brown",
      "chocolate",
      "green",
      "cornflowerblue",
      "deeppink",
      "coral",
      "chartreuse",
      "tomato",
      "orange",
      "black",
      "indianred",
      "seagreen",
      "midnightblue",
      "darkcyan",
      "white",
    ];

    if (backRef) {
      backRef.current.style.background = backgrounds[randBGI];
    }

    setBkColor(backgrounds[randBGI]);
    setRandomBGI(randBGI + 1);
    if (randBGI + 1 >= backgrounds.length) setRandomBGI(0);
  }

  function handleWannaWrite() {
    //typed before
    if (enteredText !== "") {
      if (wannaWrite) {
        setWannaWrite(false);
      } else {
        setWannaWrite(true);
        setEnteredText(false);
      }
    } else {
      //not typed beffore
      if (wannaWrite) {
        setWannaWrite(false);
      } else {
        setWannaWrite(true);
      }
    }
  }

  function changeFontD() {
    const currentSize = window

      .getComputedStyle(writeSomething.current)
      .fontSize.split("px")[0];
    setTextSize(`${parseInt(currentSize - 1)}px`);
  }

  function changeFontI() {
    const currentSize =
      parseInt(
        window.getComputedStyle(writeSomething.current).fontSize.split("px")[0]
      ) + 1;
    setTextSize(`${parseInt(currentSize)}px`);
  }

  function handleChangeFontStyle(e) {
    setTextStyle(`${e.target.value}`);
  }

  function workDone() {
    setWannaWrite(false);
    setEnteredText(writeSomething.current.value);
    setTextHelp(writeSomething.current.value);
  }

  useEffect(() => {
    if (writeSomething.current) {
      writeSomething.current.innerHTML = textHelp;
    }
  }, [wannaWrite]);

  return (
    <div className="storyCreaterForU">
      <h1 className="StoryCreaterForUHeading">Create Story...</h1>

      <div className="storyCreaterForUMainSection">
        <div
          ref={backRef}
          style={{ background: bkColor }}
          className="storyPhotoDisplay"
        >
          {storyPhoto && (
            <>
              <button
                className="storyPhotoDisplay__unselect"
                onClick={() => unselectFile()}
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>

              <img
                src={
                  URL.createObjectURL(storyPhoto) ||
                  "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"
                }
                alt="picked"
              />
            </>
          )}
        </div>

        <div className="storyCreaterForUOptionsSection">
          <p className="backgroundGuide">Select an image for background</p>
          <input
            onChange={(e) => handleStoryPhoto(e)}
            className="selectedStoryPhoto"
            type="file"
          />
          <p className="randomBackgroundGuide">Random background colors</p>
          <div className="randomBackgroundGenerator">
            <button onClick={() => randomBackgrounds()}>Normal</button>

            <button onClick={() => randomGradBackgrounds()}>Gradients</button>
          </div>
          <button
            onClick={() => handleWannaWrite()}
            className="wrriteSomething__button"
          >
            {wannaWrite ? "Cancel writing" : "Write something"}
          </button>
          {wannaWrite && (
            <>
              <textarea
                autoFocus
                className="writeSomthing__input"
                placeholder="Start typing here...."
                ref={writeSomething}
                style={{
                  fontSize: textSize,
                  fontFamily: textStyle,
                  fontWeight: textWeight,
                  ...textColor,
                }}
                type="text"
              ></textarea>
              <div className="changeFonts">
                <h1>Change font size...</h1>
                <button onClick={() => changeFontD()}>-</button>
                <button onClick={() => changeFontI()}>+</button>
              </div>
              <div className="changeFontStyle">
                <h1>Change font...</h1>
                <select
                  // ref={fontStyleRef}
                  onChange={(e) => handleChangeFontStyle(e)}
                  name=""
                >
                  {" "}
                  <option value="Roboto">Roboto</option>
                  <option value="Lato">Lato</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="Archivo">Archivo</option>
                  <option value="Bangers">Bangers</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>
              <div
                className="changeWeight"
                onClick={() =>
                  setFontWeight(textWeight == "normal" ? "bolder" : "normal")
                }
              >
                <h1>Change font weight...</h1>
                <h2>{textWeight == "normal" ? "bold" : "normal"}</h2>
              </div>
              <div className="setTextColor">
                <h1>Change font color...</h1>
                <button onClick={() => handleNormalTextColor()}>Normal</button>
                <button onClick={() => handleGradientText()}>Gradient</button>
              </div>
              <button
                className="storyPhotoDisplay__Done"
                onClick={() => workDone()}
              >
                Save changes
              </button>
            </>
          )}
          {enteredText && (
            <p
              style={{
                fontSize: textSize,
                fontFamily: textStyle,
                fontWeight: textWeight,
                ...textColor,
              }}
              ref={textRef}
              className="userEnteredText"
            >
              {enteredText}
            </p>
          )}
        </div>
      </div>
      <button className="createStoryButton" onClick={uploadStory}>
        Upload Story
      </button>
      <div ref={uploadingRef} className="storyUploading">
        xcxc
      </div>
    </div>
  );
};

export default StoryCreaterForU;
