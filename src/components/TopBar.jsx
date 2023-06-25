import React from "react";
import { Appbar } from "react-native-paper";

const TopBar = () => {
  return (
    <Appbar className="bg-black border-white border-b-[0.5px]">
      <Appbar.Content title="irctc-Z"/>
    </Appbar>
  );
};

export default TopBar;
