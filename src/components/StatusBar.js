import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ status, score, onRestart, onShowLeaderboard }) {
  return (
    <div className="status-bar">
      <div className="status-container">
        <p className="status">{status}</p>
        <p className="status">{score}</p>
      </div>

      <Button variant="light" className="button" onClick={onShowLeaderboard}>
        Leaderboard
      </Button>
      <Button variant="light" className="button" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}

export default StatusBar;
