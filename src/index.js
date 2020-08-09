import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import * as firebase from "firebase/app";
import "firebase/analytics";

var firebaseConfig = {
  apiKey: "AIzaSyAoz-lAuPJTr6FseF5BV1x3h-EO7Y8Eq38",
  authDomain: "pink-games2.firebaseapp.com",
  databaseURL: "https://pink-games2.firebaseio.com",
  projectId: "pink-games2",
  storageBucket: "pink-games2.appspot.com",
  messagingSenderId: "565870803436",
  appId: "1:565870803436:web:9c8673161e3be34bff68c9",
  measurementId: "G-2KQHJSP7CZ",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("app"));
