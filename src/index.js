import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import * as firebase from "firebase/app";
import "firebase/analytics";

var firebaseConfig = {
  apiKey: "AIzaSyCVGmVIPMLuFjG2nnQ_QNyu1xLJ1NOcVyY",
  authDomain: "pink-games3.firebaseapp.com",
  databaseURL: "https://pink-games3.firebaseio.com",
  projectId: "pink-games3",
  storageBucket: "pink-games3.appspot.com",
  messagingSenderId: "886495147069",
  appId: "1:886495147069:web:2df0c366dfbb8a0f8d6654",
  measurementId: "G-4JLE7GFS9D",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("app"));
