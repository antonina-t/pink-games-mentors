import React from "react";
import "./StatusBar.css";
import Button from "react-bootstrap/Button";

function StatusBar({ status, onRestart }) {
  return (
    <div className="status-bar">
      <p className="status">{status}</p>
      <Button className="button" variant="light" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}

export default StatusBar;