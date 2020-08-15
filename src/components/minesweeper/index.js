import React, { useState } from "react";
import "./index.css";
import MinesweeperCell from "./MinesweeperCell";
import ModeSwitch from "./ModeSwitch";

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
  const [isMarkMode, setIsMarkMode] = useState(false);

  function onCellClick(x, y) {
    if (gameOver) return;
    setGrid((oldGrid) => {
      if (oldGrid[y * size + x].isMine) {
        setGameOver(true);
        return openAllMines(openCells(oldGrid, x, y));
      }
      return openCells(oldGrid, x, y);
    });
  }

  function onCellRightClick(x, y) {
    if (gameOver) return;
    setGrid((oldGrid) => markCell(oldGrid, x, y));
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
      <div className="ms-grid">{cells}</div>
      <ModeSwitch
        isMarkMode={isMarkMode}
        onChange={() => setIsMarkMode(!isMarkMode)}
      />
    </div>
  );
}

export default Minesweeper;
