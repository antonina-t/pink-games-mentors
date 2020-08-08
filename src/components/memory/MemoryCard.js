import React from "react";
import "./MemoryCard.css";

function MemoryCard({ isFlipped, color, onClick }) {
  return (
    <div
      className={"memory-card " + (isFlipped ? color : "back")}
      onClick={onClick}
    ></div>
  );
}

export default MemoryCard;
