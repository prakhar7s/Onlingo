import { HelpOutline } from "@material-ui/icons";
import React, { useState } from "react";
import "./ChatListSearch.css";
import SearchIcon from "@material-ui/icons/Search";
const ChatListSearch = ({ setSearch }) => {
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="ChatList__searchContainer">
      <input
        type="text"
        onChange={handleSearch}
        autoFocus
        placeholder="Search friends...."
      />
      <SearchIcon />
    </div>
  );
};

export default ChatListSearch;
