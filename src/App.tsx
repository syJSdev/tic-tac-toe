import React, { useState } from "react";
import "./styles.css";

function getXY(index: number, rowCount: number): { x: number; y: number } {
  return { x: index % rowCount, y: Math.floor(index / rowCount) };
}

function getWinner(board: string[][]): string {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const a = getXY(lines[i][0], 3);
    const b = getXY(lines[i][1], 3);
    const c = getXY(lines[i][2], 3);
    if (
      board[a.y][a.x] &&
      board[a.y][a.x] === board[b.y][b.x] &&
      board[a.y][a.x] === board[c.y][c.x]
    ) {
      return board[a.y][a.x];
    }
  }

  return "";
}

interface SquareProps {
  status: string;
  onClick: React.MouseEventHandler;
  disabled: boolean;
}

const Square = React.memo<SquareProps>(({ status, disabled, onClick }) => {
  return (
    <div
      className="square"
      data-testid="square"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if (status || disabled) e.preventDefault();
        else onClick(e);
      }}
    >
      {status}
    </div>
  );
});

const initialBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
const players = ["x", "o"];

export const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [winner, setWinner] = useState("");

  const setBoardCellStatus = (rId: number, cId: number) => {
    const nextBoard = board.map((row, rowIndex) => {
      if (rowIndex !== rId) return row;
      return row.map((cell, cellIndex) => {
        if (cellIndex !== cId) return cell;
        return currentPlayer;
      });
    });

    const winner = getWinner(nextBoard);

    setBoard(nextBoard);
    setWinner(winner);
    setCurrentPlayer(currentPlayer === players[0] ? players[1] : players[0]);
  };

  return (
    <div className="app">
      <header>
        <h1 data-testid="title">Tic Tac Toe</h1>
        <h2 data-testid="winner">{winner && `${winner} is the winner!`}</h2>
      </header>
      <main>
        <div className="board" data-testid="board">
          {board.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Square
                  key={cellIndex}
                  status={cell}
                  disabled={!!winner}
                  onClick={() => setBoardCellStatus(rowIndex, cellIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
