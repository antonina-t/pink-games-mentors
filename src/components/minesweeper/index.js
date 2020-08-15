import React, { useState, useEffect } from "react";
import "./index.css";
import MinesweeperCell from "./MinesweeperCell";
import ModeSwitch from "./ModeSwitch";
import StatusBar from "../StatusBar";
import ResultModal from "../ResultModal";
import * as utils from "../../utils";

const size = 10;
const mines = 15;

function generateGrid() {
  const grid = [];
  for (let i = 0; i < size * size; i++) {
    grid.push({
      isOpen: false,
      isMarked: false,
      isMine: false,
    });
  }

  for (let i = 0; i < mines; i++) {
    let rand = random(size * size);
    while (grid[rand].isMine) {
      rand = random(size * size);
    }
    grid[rand].isMine = true;
  }
  return grid;
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function minesAround(grid, x, y) {
  const values = [
    isMineAt(grid, x - 1, y - 1),
    isMineAt(grid, x, y - 1),
    isMineAt(grid, x + 1, y - 1),
    isMineAt(grid, x - 1, y),
    isMineAt(grid, x + 1, y),
    isMineAt(grid, x - 1, y + 1),
    isMineAt(grid, x, y + 1),
    isMineAt(grid, x + 1, y + 1),
  ];
  return values.filter((value) => value).length;
}

function isMineAt(grid, x, y) {
  if (x < 0 || y < 0 || x >= size || y >= size) return false;
  return grid[y * size + x].isMine;
}

function openCells(grid, x, y) {
  if (x < 0 || y < 0 || x >= size || y >= size) return grid;
  if (grid[y * size + x].isOpen) return grid;
  let newGrid = grid.map((cell, i) => {
    return i === y * size + x
      ? { ...cell, isOpen: true, isMarked: false }
      : cell;
  });
  if (!minesAround(newGrid, x, y)) {
    newGrid = openCells(newGrid, x - 1, y - 1);
    newGrid = openCells(newGrid, x, y - 1);
    newGrid = openCells(newGrid, x + 1, y - 1);
    newGrid = openCells(newGrid, x - 1, y);
    newGrid = openCells(newGrid, x + 1, y);
    newGrid = openCells(newGrid, x - 1, y + 1);
    newGrid = openCells(newGrid, x, y + 1);
    newGrid = openCells(newGrid, x + 1, y + 1);
  }

  return newGrid;
}

function openAllMines(grid) {
  return grid.map((cell) => {
    return {
      ...cell,
      isOpen: cell.isOpen || cell.isMarked !== cell.isMine,
      isMarked: cell.isMarked && cell.isMine,
    };
  });
}

function markCell(grid, x, y) {
  if (grid[y * size + x].isOpen) return grid;
  return grid.map((cell, i) => {
    return i === y * size + x ? { ...cell, isMarked: !cell.isMarked } : cell;
  });
}

function Minesweeper() {
  const [grid, setGrid] = useState(generateGrid());
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [isMarkMode, setIsMarkMode] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [scoreIsSaved, setScoreIsSaved] = useState(false);

  useEffect(() => {
    if (gameOver || win || !startTime) return;
    const intervalId = setInterval(
      () => setElapsedTime(Date.now() - startTime),
      1000
    );
    return () => clearInterval(intervalId);
  }, [startTime, gameOver, win]);

  function onCellClick(x, y) {
    if (gameOver || win) return;
    setGrid((oldGrid) => {
      if (oldGrid[y * size + x].isMine) {
        setGameOver(true);
        setElapsedTime(Date.now() - startTime);
        setShowModal(true);
        return openAllMines(openCells(oldGrid, x, y));
      }
      const newGrid = openCells(oldGrid, x, y);
      checkWin(newGrid);
      return newGrid;
    });
    setStartTime((oldStartTime) =>
      oldStartTime === 0 ? Date.now() : oldStartTime
    );
  }

  function onCellRightClick(x, y) {
    if (gameOver || win) return;
    setGrid((oldGrid) => {
      const newGrid = markCell(oldGrid, x, y);
      checkWin(newGrid);
      return newGrid;
    });
    setStartTime((oldStartTime) =>
      oldStartTime === 0 ? Date.now() : oldStartTime
    );
  }

  function checkWin(grid) {
    if (grid.every((cell) => cell.isOpen || (cell.isMarked && cell.isMine))) {
      setWin(true);
      setShowModal(true);
    }
  }

  function onRestart() {
    setGrid(generateGrid());
    setGameOver(false);
    setWin(false);
    setStartTime(0);
    setElapsedTime(0);
    setScoreIsSaved(false);
  }

  function fetchLeaderboard() {
    return utils
      .fetchLeaderboard("minesweeper", [["timeMs", "asc"]])
      .then((entries) =>
        entries.map(
          ({ name, timeMs }, i) =>
            `${i + 1}. ${name}: ${utils.prettifyTime(timeMs)}`
        )
      );
  }

  function saveScore(name) {
    if (name) {
      utils
        .saveScore("minesweeper", { name: name, timeMs: elapsedTime })
        .then(() => setScoreIsSaved(true));
    }
  }

  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push(
        <MinesweeperCell
          key={x + "-" + y}
          {...grid[y * size + x]}
          minesAround={minesAround(grid, x, y)}
          onClick={() =>
            isMarkMode ? onCellRightClick(x, y) : onCellClick(x, y)
          }
          onRightClick={() => onCellRightClick(x, y)}
        />
      );
    }
  }

  return (
    <div className="game-container">
      <StatusBar
        status={"Time: " + utils.prettifyTime(elapsedTime)}
        score={
          "Mines left: " + (mines - grid.filter((cell) => cell.isMarked).length)
        }
        onRestart={onRestart}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="ms-grid">{cells}</div>
      <ModeSwitch
        isMarkMode={isMarkMode}
        onChange={() => setIsMarkMode(!isMarkMode)}
      />
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        header={
          win
            ? "Congratulations, you swept all the mines!"
            : gameOver
            ? "Game over!"
            : "Leaderboard"
        }
        body={
          (gameOver || win) &&
          "You found " +
            (win ? "all of the " : "") +
            grid.filter((cell) => cell.isMarked && cell.isMine).length +
            " mines." +
            (win
              ? " Your time was " + utils.prettifyTime(elapsedTime) + "."
              : "")
        }
        fetchLeaderboard={fetchLeaderboard}
        saveScore={win && !scoreIsSaved && saveScore}
      ></ResultModal>
    </div>
  );
}

export default Minesweeper;
