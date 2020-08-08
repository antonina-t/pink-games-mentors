import React, { useState, useEffect, useRef } from "react";
import MemoryCard from "./MemoryCard";
import StatusBar from "./StatusBar";
import ResultModal from "./ResultModal";
import "./index.css";

const images = [
  "banana",
  "cat",
  "chicken",
  "coffee",
  "eiffel",
  "stockholm",
  "swan",
  "tomato",
];

function generateCards() {
  const cards = [];
  for (let i = 0; i < images.length; i++) {
    cards.push({
      key: i * 2,
      color: images[i],
      isFlipped: false,
      isLocked: false,
    });
    cards.push({
      key: i * 2 + 1,
      color: images[i],
      isFlipped: false,
      isLocked: false,
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

function prettifyTime(timeMs) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return (minutes > 0 ? minutes + "m " : "") + seconds + "s";
}

function setMatchingPair(cards, pairKeys) {
  return cards.map((card) => {
    return {
      ...card,
      isLocked: pairKeys.includes(card.key) ? true : card.isFlipped,
    };
  });
}

function Memory() {
  const [game, setGame] = useState({ cards: generateCards() });

  const [wrongPair, setWrongPair] = useState(null);
  const timeoutIds = useRef([]);

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [win, setWin] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!win && startTime !== 0) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, win]);

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
      let newCards = flipCards(cards, [card.key]);
      if (!firstCard) {
        return {
          cards: newCards,
          firstCard: card,
        };
      } else {
        if (firstCard.color !== card.color) {
          setWrongPair([firstCard, card]);
        } else {
          newCards = setMatchingPair(newCards, [firstCard.key, card.key]);
          if (newCards.every((card) => card.isLocked)) {
            setWin(true);
            setShowModal(true);
          }
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
    setWin(false);
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar
          status={`Time: ${prettifyTime(elapsedTime)}`}
          onRestart={onRestart}
        />
        <div className="memory-grid">
          {game.cards.map((card) => (
            <MemoryCard
              {...card}
              onClick={() => onCardClick(card)}
            ></MemoryCard>
          ))}
        </div>
      </div>
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        header="Congratulations!"
        body={"You won! You time was " + prettifyTime(elapsedTime) + "."}
      ></ResultModal>
    </div>
  );
}

export default Memory;
