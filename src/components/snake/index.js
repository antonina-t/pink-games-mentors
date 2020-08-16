import React, { useState, useEffect } from "react";
import "./index.css";
import TouchController from "./TouchController";
import StatusBar from "../StatusBar";
import ResultModal from "../ResultModal";
import * as utils from "../../utils";

const width = 20;
const height = 12;
const initialIntervalMs = 400;

function generateGame() {
  const snake = {
    head: { x: width / 2, y: height / 2 },
    tail: [{ x: width / 2 - 1, y: height / 2 }],
    dir: "right",
  };
  return {
    snake,
    food: generateFood(snake),
    commands: [],
  };
}

function generateFood(snake) {
  let { x, y } = snake.head;
  while (
    isEqual(snake.head, { x, y }) ||
    snake.tail.some((cell) => isEqual(cell, { x, y }))
  ) {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  }
  return { x, y };
}

function isEqual(cell1, cell2) {
  return cell1.x === cell2.x && cell1.y === cell2.y;
}

function isOpposite(dir1, dir2) {
  return (
    (dir1 === "right" && dir2 === "left") ||
    (dir1 === "left" && dir2 === "right") ||
    (dir1 === "up" && dir2 === "down") ||
    (dir1 === "down" && dir2 === "up")
  );
}

function tick(game) {
  if (game.isOver) return game;
  const { snake, food, commands } = game;

  let newCommands = [...commands];
  while (
    newCommands.length > 0 &&
    (isOpposite(newCommands[0], snake.dir) || newCommands[0] === snake.dir)
  ) {
    newCommands = newCommands.slice(1);
  }

  let newDir = snake.dir;
  if (newCommands.length > 0) {
    newDir = newCommands[0];
    newCommands = newCommands.slice(1);
  }

  let newHead;
  switch (newDir) {
    case "right":
      newHead = { x: snake.head.x + 1, y: snake.head.y };
      break;
    case "down":
      newHead = { x: snake.head.x, y: snake.head.y + 1 };
      break;
    case "left":
      newHead = { x: snake.head.x - 1, y: snake.head.y };
      break;
    case "up":
      newHead = { x: snake.head.x, y: snake.head.y - 1 };
      break;
  }
  if (
    newHead.x < 0 ||
    newHead.x == width ||
    newHead.y < 0 ||
    newHead.y == height ||
    snake.tail.some((cell) => isEqual(cell, newHead))
  )
    return { ...game, isOver: true };
  const newSnake = {
    ...snake,
    head: newHead,
    tail: [
      snake.head,
      ...snake.tail.slice(
        0,
        snake.tail.length - (isEqual(newHead, food) ? 0 : 1)
      ),
    ],
    dir: newDir,
  };
  return {
    ...game,
    snake: newSnake,
    food: isEqual(newHead, food) ? generateFood(newSnake) : food,
    commands: newCommands,
  };
}

function getIntervalMs(game) {
  return initialIntervalMs * Math.pow(0.95, Math.floor(getScore(game) / 3));
}

function getScore(game) {
  return game.snake.tail.length - 1;
}

function Snake() {
  const [game, setGame] = useState(generateGame());
  const [gameOver, setGameOver] = useState(false);
  const [intervalMs, setIntervalMs] = useState(initialIntervalMs);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [scoreIsSaved, setScoreIsSaved] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setGame((oldGame) => {
          const newGame = tick(oldGame);
          if (newGame.isOver) {
            setGameOver(true);
            setShowModal(true);
          }
          setIntervalMs(getIntervalMs(newGame));
          return newGame;
        });
      }, intervalMs);
      return () => clearInterval(intervalId);
    }
  }, [gameOver, intervalMs]);

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  function handleKeyPress(event) {
    let newDir;
    switch (event.keyCode) {
      case 37:
      case 65:
        newDir = "left";
        break;
      case 38:
      case 87:
        newDir = "up";
        break;
      case 39:
      case 68:
        newDir = "right";
        break;
      case 40:
      case 83:
        newDir = "down";
        break;
    }
    addCommand(newDir);
  }

  function addCommand(dir) {
    if (dir) {
      setGame((oldGame) => {
        return {
          ...oldGame,
          commands: [...oldGame.commands, dir],
        };
      });
    }
  }

  function onRestart() {
    setGame(generateGame());
    setGameOver(false);
    setIntervalMs(initialIntervalMs);
    setStartTime(Date.now());
    setElapsedTime(0);
    setScoreIsSaved(false);
  }

  function fetchLeaderboard() {
    return utils
      .fetchLeaderboard("snake", [
        ["score", "desc"],
        ["timeMs", "asc"],
      ])
      .then((lb) => {
        return lb.map((entry, i) => `${i + 1}. ${entry.name}: ${entry.score}`);
      });
  }

  function saveScore(name) {
    if (name) {
      utils
        .saveScore("snake", {
          name: name,
          timeMs: elapsedTime,
          score: getScore(game),
        })
        .then(() => setScoreIsSaved(true));
    }
  }

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = { x, y };
      const className = isEqual(cell, game.snake.head)
        ? "head"
        : game.snake.tail.some((tailCell) => isEqual(tailCell, cell))
        ? "tail"
        : isEqual(cell, game.food)
        ? "food"
        : "";

      cells.push(
        <div key={`${x}-${y}`} className={"snake-cell " + className}></div>
      );
    }
  }

  return (
    <div className="game-container">
      <StatusBar
        status1={"Time: " + utils.prettifyTime(elapsedTime)}
        status2={"Score: " + getScore(game)}
        onRestart={onRestart}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="snake-grid">{cells}</div>
      <TouchController onChangeDir={addCommand} />
      <ResultModal
        show={showModal}
        header={gameOver ? "Game over!" : "Leaderboard"}
        body={gameOver && "You score was " + getScore(game) + "."}
        handleClose={() => setShowModal(false)}
        fetchLeaderboard={fetchLeaderboard}
        saveScore={gameOver && !scoreIsSaved && saveScore}
      ></ResultModal>
    </div>
  );
}

export default Snake;
