import React, { useState, useMemo } from 'react';
import './App.css';

/**
 * calculateWinner determines if there is a winner given the current squares.
 * It checks all 8 winning lines. If found, returns an object containing the winner symbol and the winning line.
 * Otherwise returns null.
 */
// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** This is a public function. */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * Square component represents a single cell in the Tic Tac Toe grid.
 * It's a button for accessibility and keyboard navigation.
 */
function Square({ value, onClick, index, disabled, isWinning }) {
  const labelRow = Math.floor(index / 3) + 1;
  const labelCol = (index % 3) + 1;
  const aria = value
    ? `Square row ${labelRow} column ${labelCol} with ${value}`
    : `Empty square row ${labelRow} column ${labelCol}`;
  return (
    <button
      type="button"
      className={`ttt-square ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''} ${isWinning ? 'win' : ''}`}
      onClick={onClick}
      aria-label={aria}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

/**
 * Board component renders a 3x3 grid of Square components.
 */
function Board({ squares, onSquareClick, isGameOver, winningLine }) {
  return (
    <div className="ttt-grid" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((sq, i) => (
        <Square
          key={i}
          value={sq}
          index={i}
          onClick={() => onSquareClick(i)}
          disabled={isGameOver || Boolean(sq)}
          isWinning={Array.isArray(winningLine) && winningLine.includes(i)}
        />
      ))}
    </div>
  );
}

/**
 * App component manages the game state and renders the UI.
 */
// PUBLIC_INTERFACE
function App() {
  /** The main Tic Tac Toe application with local state and accessible UI. */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? null;
  const isBoardFull = squares.every((s) => s !== null);
  const isDraw = !winner && isBoardFull;
  const isGameOver = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  const handleSquareClick = (i) => {
    /** Handle a click on a square. Ignores if occupied or game over. */
    if (squares[i] || isGameOver) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    /** Reset the game to its initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'Draw'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="app-root">
      <main className="app-container">
        <h1 className="title">Tic Tac Toe</h1>

        <div
          className={`status ${winner ? 'status-win' : isDraw ? 'status-draw' : 'status-play'}`}
          role="status"
          aria-live="polite"
        >
          {statusText}
        </div>

        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          isGameOver={isGameOver}
          winningLine={winningLine}
        />

        <div className="controls">
          <button
            type="button"
            className="btn-restart"
            onClick={restartGame}
            aria-label="Restart game"
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
