import React, { useState, useEffect, useRef } from "react";
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
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime !== 0) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime]);

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
    if (startTime === 0) setStartTime(Date.now());
  }

  function onRestart() {
    setGame({ cards: generateCards() });
    setStartTime(0);
    setElapsedTime(0);
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar status={`Time: ${elapsedTime}ms`} onRestart={onRestart} />
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
