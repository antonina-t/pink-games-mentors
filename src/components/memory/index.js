import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import MemoryCard from "./MemoryCard";
import StatusBar from "./StatusBar";

const colors = [
  "pink",
  "red",
  "orange",
  "yellow",
  "teal",
  "green",
  "blue",
  "purple",
];

function generateCards() {
  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    cards.push({
      key: i * 2,
      isFlipped: false,
      color: colors[i],
    });
    cards.push({
      key: i * 2 + 1,
      isFlipped: false,
      color: colors[i],
    });
  }
  return cards.sort(() => Math.random() - 0.5);
}

function flipCards(cards, keysToFlip) {
  return cards.map((card) => {
    if (keysToFlip.includes(card.key)) {
      return {
        ...card,
        isFlipped: !card.isFlipped,
      };
    }
    return card;
  });
}

function Memory() {
  const [game, setGame] = useState({ cards: generateCards() });
  const [wrongPair, setWrongPair] = useState([]);

  const timeoutIds = useRef([]);

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime === 0) return;
    const intervalId = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [startTime]);

  useEffect(() => {
    if (wrongPair.length === 0) return;
    const timeoutId = setTimeout(() => {
      setGame((oldGame) => {
        const newCards = flipCards(
          oldGame.cards,
          wrongPair.map((card) => card.key)
        );
        return {
          cards: newCards,
          firstCard: oldGame.firstCard,
        };
      });
    }, 1000);
    timeoutIds.current = timeoutIds.current.concat(timeoutId);
  }, [wrongPair]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  function onRestart() {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
    setGame({ cards: generateCards() });
    setStartTime(0);
    setElapsedTime(0);
  }

  function onCardClick(card) {
    // If the card is already flipped there is nothing we need to do.
    if (card.isFlipped) return;

    setGame(({ cards, firstCard }) => {
      // The { cards, firstCard, secondCard } above is the decomposed game object.
      // These three variables represent the previous state, before a card was clicked.
      // We should return the new state, depending on the previous one and on the card that was clicked.

      const newCards = flipCards(cards, [card.key]);

      if (!firstCard) {
        return {
          cards: newCards,
          firstCard: card,
        };
      } else {
        if (firstCard.color !== card.color) {
          setWrongPair([firstCard, card]);
        }
        return {
          cards: newCards,
        };
      }
    });

    setStartTime((oldStartTime) => {
      if (oldStartTime === 0) {
        return Date.now();
      }
      return oldStartTime;
    });
  }

  return (
    <div className="game-container">
      <StatusBar
        status={"Time: " + elapsedTime + "ms"}
        onRestart={onRestart}
      ></StatusBar>
      <div className="memory-grid">
        {game.cards.map((card) => (
          <MemoryCard {...card} onClick={() => onCardClick(card)}></MemoryCard>
        ))}
      </div>
    </div>
  );
}

export default Memory;
