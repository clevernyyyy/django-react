import React from "react";
import ReactDOM from "react-dom";
import SignUp from "./SignUp";

const App = () => (
  <div>
    <SignUp />
  </div>
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
