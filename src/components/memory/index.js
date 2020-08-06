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

function flipCards(cards, keysToFlip) {
  return cards.map((card) => {
    return {
      ...card,
      isFlipped: keysToFlip.includes(card.key)
        ? !card.isFlipped
        : card.isFlipped,
    };
  });
}

function Memory() {
  const [game, setGame] = useState({ cards: generateCards() });
  const status = "Time: 0s";

  function onCardClick(card) {
    if (card.isFlipped) {
      return;
    }
    setGame(({ cards, firstCard, secondCard }) => {
      if (!firstCard) {
        return {
          cards: flipCards(cards, [card.key]),
          firstCard: card,
        };
      } else if (!secondCard) {
        return {
          cards: flipCards(cards, [card.key]),
          firstCard: firstCard,
          secondCard: card,
        };
      } else if (firstCard.color === secondCard.color) {
        return {
          cards: flipCards(cards, [card.key]),
          firstCard: card,
        };
      } else {
        return {
          cards: flipCards(cards, [card.key, firstCard.key, secondCard.key]),
          firstCard: card,
        };
      }
    });
  }

  function onRestart() {
    setGame({ cards: generateCards() });
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar status={status} onRestart={onRestart}></StatusBar>
        <div className="memory-grid">
          {game.cards.map((card) => (
            <MemoryCard
              {...card}
              onClick={() => onCardClick(card)}
            ></MemoryCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Memory;
