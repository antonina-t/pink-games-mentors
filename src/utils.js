import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export function fetchLeaderboard(game) {
  const auth = firebase.auth();
  const db = firebase.firestore();
  return auth
    .signInAnonymously()
    .then(() => db.collection(game).orderBy("timeMs", "asc").get())
    .then((querySnapshot) => {
      let leaderboard = [];
      querySnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
      });
      return leaderboard;
    })
    .catch(function (error) {
      console.log("Error getting leaderboard: ", error);
    });
}

export function saveScore(game, score) {
  const auth = firebase.auth();
  const db = firebase.firestore();
  auth
    .signInAnonymously()
    .then(() => db.collection(game).add(score))
    .catch(function (error) {
      console.log("Error saving score: ", error);
    });
}

export function prettifyTime(timeMs) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return (minutes > 0 ? minutes + "m " : "") + seconds + "s";
}
