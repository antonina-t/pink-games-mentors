import React from "react";
import "./StatusBar.css";
import Button from "react-bootstrap/Button";

function StatusBar({ status1, status2, onRestart, onShowLeaderboard }) {
  return (
    <div className="status-bar">
      <div className="status-container">
        <p className="status">{status1}</p>
        <p className="status">{status2}</p>
      </div>
      <Button className="button" variant="light" onClick={onShowLeaderboard}>
        Leaderboard
      </Button>
      <Button className="button" variant="light" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}

export default StatusBar;
