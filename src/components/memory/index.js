import React, { useState } from "react";
import MemoryCard from "./MemoryCard";
import StatusBar from "./StatusBar";
import "./index.css";

const colors = [
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
];

function generateCards() {
  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    cards.push({
      key: i * 2,
      color: colors[i],
      isFlipped: false,
    });
    cards.push({
      key: i * 2 + 1,
      color: colors[i],
      isFlipped: false,
    });
  }
  cards.sort(() => Math.random() - 0.5);
  return cards;
}

function Memory() {
  const [cards, setCards] = useState(generateCards());
  const status = "Time: 0s";

  function onCardClick(key) {
    setCards((oldCards) =>
      oldCards.map((card) => {
        if (card.key === key) return { ...card, isFlipped: true };
        return card;
      })
    );
  }

  function onRestart() {
    setCards(generateCards());
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar status={status} onRestart={onRestart}></StatusBar>
        <div className="memory-grid">
          {cards.map((card) => (
            <MemoryCard
              {...card}
              onClick={() => onCardClick(card.key)}
            ></MemoryCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Memory;
