import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export function fetchLeaderboard(game, orderBy) {
  const auth = firebase.auth();
  const db = firebase.firestore();

  return auth
    .signInAnonymously()
    .then(() => {
      let query = db.collection(game);
      orderBy.forEach((rule) => query.orderBy(...rule));
      return query.limit(10).get();
    })
    .then((querySnapshot) => {
      const leaderboard = [];
      querySnapshot.forEach((doc) => leaderboard.push(doc.data()));
      return leaderboard;
    })
    .catch((error) => console.log("Error fetching leaderboard: ", error));
}

export function saveScore(game, score) {
  const auth = firebase.auth();
  const db = firebase.firestore();

  return auth
    .signInAnonymously()
    .then(() => db.collection(game).add(score))
    .catch((error) => console.log("Error saving score: ", error));
}
