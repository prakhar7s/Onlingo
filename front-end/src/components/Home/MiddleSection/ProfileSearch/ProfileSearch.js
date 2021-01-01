import React, { useEffect, useState } from "react";
import "./ProfileSearch.css";
import SearchIcon from "@material-ui/icons/Search";
import Profile from "./Profile/Profile";
import { projectFirestore } from "../../../../firebase/config";
import SpecificProfile from "./SpecificProfile/SpecificProfile";

const ProfileSearch = ({ username, setSearchE }) => {
  const [profile, setProfile] = useState("");
  const [docs, setDocs] = useState("");
  const [searchedProfiles, setSearchedProfiles] = useState("");
  const [openProfile, setOpenProfile] = useState("");
  const [showRoute, setShowRoute] = useState("SEARCH");

  // if (e.target.value && docs)
  // setSearchedProfiles(
  //   docs.filter((doc) => {
  //     return doc.username
  //       .toLowerCase()
  //       .includes(e.target.value.toLowerCase());
  //   })
  // );
  const rendered = [];

  var xxx = [];

  xxx = Array.from(docs).filter((pro) => {
    if (
      pro.name.toLowerCase().includes(profile.toLowerCase()) &&
      !xxx.includes(pro) &&
      pro.username !== username
    ) {
      return pro;
    }
  });

  xxx = [...new Set(xxx)];

  // var yyy = [];

  // yyy = Array.from(docs).map((pro) => {
  //   if (pro.username !== username) {
  //     return pro;
  //   }
  // });

  // yyy = [...new Set(yyy)];

  const input = document.querySelectorAll(".searchInput")[0];
  const x = () => {
    input.parentNode.style.zIndex = 0;
  };

  var display = "";

  if (showRoute === "SEARCH") {
    display = (
      <div className="profileContainer">
        <div className="profileSearch">
          <button
            onClick={(e) => handleCloseButton(e)}
            className="close-button"
          >
            &times;
          </button>
          {/* {searchedProfiles &&
            searchedProfiles.map((doc, index) => (
              <>
                {doc.username != username &&
                {!profile.includes(doc.username) &&
                  doc.username != username && (
                    <Profile
                      key={doc.username}
                      profilePic={doc.profilePic}
                      username={doc.username}
                      name={doc.name}
                      coverPic={doc.coverPic}
                      bio={doc.bio}
                      setOpenProfile={setOpenProfile}
                      setShowRoute={setShowRoute}
                      input={input}
                    />
                  )}
              </>
            ))} */}
          {profile ? (
            <>
              {xxx.map((doc) => {
                if (!rendered.includes(doc.username)) {
                  rendered.push(doc.username);

                  return (
                    <Profile
                      key={doc.username}
                      profilePic={doc.profilePic}
                      username={doc.username}
                      name={doc.name}
                      coverPic={doc.coverPic}
                      bio={doc.bio}
                      setOpenProfile={setOpenProfile}
                      setShowRoute={setShowRoute}
                      input={input}
                    />
                  );
                }
              })}
            </>
          ) : (
            <>
              {/* {" "}
              {yyy.map((doc) => (
                <Profile
                  key={doc.username}
                  profilePic={doc.profilePic}
                  username={doc.username}
                  name={doc.name}
                  coverPic={doc.coverPic}
                  bio={doc.bio}
                  setOpenProfile={setOpenProfile}
                  setShowRoute={setShowRoute}
                  input={input}
                />
              ))}{" "} */}
            </>
          )}
          {xxx.length ? (
            ""
          ) : (
            <h1 className="searchedUerNotFound">No user with that name!</h1>
          )}
        </div>
      </div>
    );
  } else if (showRoute === "X") {
    display = (
      <div className="profileContainer">
        {x()}
        <button
          className="specificProfile__closeButton"
          onClick={(e) => handleCloseButtonSpecificProfile(e)}
        >
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
        <SpecificProfile ownProfile={username} profile={openProfile} />
      </div>
    );
  }

  useEffect(() => {
    async function fetching() {
      const temp = [];
      const profileRef = projectFirestore.collection("users");
      await profileRef.onSnapshot((docss) => {
        docss.forEach((doc) => {
          if (!docs.includes(doc.data())) {
            temp.push(doc.data());
          }
        });
        setDocs(temp);
      });
    }
    fetching();
  }, []);

  const handleSearch = (e) => {
    setProfile(e.target.value);
    const node = e.currentTarget.parentNode.parentNode.childNodes[1];
    //profileContainer
    node.classList.add("active");
    //profileSearch
    node.firstChild.classList.add("active");
    //close-button
    node.firstChild.firstChild.classList.add("active");
    //searchBox
    e.currentTarget.parentNode.classList.add("active");
    e.currentTarget.parentNode.style.zIndex = 2;
    if (e.target.value.length === 0) {
      node.classList.remove("active");
      node.firstChild.classList.remove("active");
      node.firstChild.firstChild.classList.remove("active");
      e.currentTarget.parentNode.classList.remove("active");
      setShowRoute("SEARCH");
    }
  };

  const handleCloseButton = (e) => {
    //self
    e.currentTarget.classList.remove("active");
    //profileSearch
    e.currentTarget.parentNode.classList.remove("active");
    //profileContainer
    e.currentTarget.parentNode.parentNode.classList.remove("active");
    //searchBox
    e.currentTarget.parentNode.parentNode.parentNode.firstChild.classList.remove(
      "active"
    );
    e.currentTarget.parentNode.parentNode.parentNode.firstChild.firstChild.value =
      "";
    setShowRoute("SEARCH");
  };

  const handleCloseButtonSpecificProfile = (e) => {
    //self
    e.currentTarget.classList.remove("active");
    //profileSearch
    e.currentTarget.parentNode.classList.remove("active");
    //profileContainer
    e.currentTarget.parentNode.parentNode.classList.remove("active");
    //searchBox
    e.currentTarget.parentNode.parentNode.firstChild.classList.remove("active");
    e.currentTarget.parentNode.parentNode.parentNode.firstChild.firstChild.value =
      "";
    setShowRoute("SEARCH");
  };

  useEffect(() => {
    setSearchE(document.querySelectorAll(".searchBox")[0]);
  }, [setSearchE]);

  return (
    <>
      <div>
        <div className="searchBox">
          <SearchIcon />
          <input
            onChange={(e) => handleSearch(e)}
            // onChange={handleSearch}
            type="text"
            placeholder="Search..."
            className="searchInput"
            autoFocus
          />
        </div>
        {display}
      </div>
    </>
  );
};

export default ProfileSearch;
