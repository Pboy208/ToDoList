import MainNavigation from "./MainNavigation";
import "./Layout.css";
import React from "react";

const Layout = React.memo((props) => {
  console.log("layout rerender");
  return (
    <>
      <MainNavigation />
      <main>{props.children}</main>
    </>
  );
});

export default Layout;
