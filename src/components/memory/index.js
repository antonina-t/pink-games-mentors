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

  const [wrongPair, setWrongPair] = useState(null);
  const timeoutIds = useRef([]);

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

  useEffect(() => {
    if (!wrongPair) return;
    const timeoutId = setTimeout(() => {
      setGame((oldGame) => {
        return {
          ...oldGame,
          cards: flipCards(
            oldGame.cards,
            wrongPair.map((card) => card.key)
          ),
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

  function onCardClick(card) {
    if (card.isFlipped) {
      return;
    }
    setGame(({ cards, firstCard }) => {
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
