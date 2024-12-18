/* eslint-disable react/prop-types */
import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  const { winner, winningLine, isDraw } = calculateWinner(squares);
  const status = getStatus(winner, xIsNext, isDraw);

  function isWinningSquare(i) {
    return winningLine && winningLine.includes(i);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            highlight={isWinningSquare(i)}
          />
        ))}
      </div>
    </>
  );
}

function MainMenu({ onStartGame }) {
  return (
    <div className="main-menu">
      <h1>Welcome to Tic-Tac-Toe</h1>
      <button onClick={onStartGame}>Start Game</button>
    </div>
  );
}

export default function Game() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares) {
    const { winner } = calculateWinner(nextSquares);

    if (winner) {
      updateScores(winner);
    }

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleNextGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function handleResetScores() {
    setScores({ X: 0, O: 0 });
    handleNextGame();
  }

  function updateScores(winner) {
    setScores((prevScores) => ({
      ...prevScores,
      [winner]: prevScores[winner] + 1,
    }));
  }

  function startGame() {
    setIsGameStarted(true);
  }

  return (
    <div className="game">
      {!isGameStarted ? (
        <MainMenu onStartGame={startGame} />
      ) : (
        <>
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
          <div className="game-info">
            <div className="scores">
              <p>Player (X) : {scores.X}</p>
              <p>Player (O) : {scores.O}</p>
            </div>
            <div className="buttons">
              <button onClick={handleResetScores}>Reset Game</button>
              <button onClick={handleNextGame}>Next Game</button>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="game-footer">
        <p>© 2024 - 2025 DrewMic</p>
      </footer>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: [a, b, c], isDraw: false };
    }
  }

  // Check if all squares are filled, and if so, return a draw
  const isBoardFull = squares.every(square => square !== null);
  if (isBoardFull) {
    return { winner: null, winningLine: null, isDraw: true };
  }

  return { winner: null, winningLine: null, isDraw: false };
}

function getStatus(winner, xIsNext, isDraw) {
  if (winner) {
    return 'Winner: ' + winner;
  }
  if (isDraw) {
    return 'Draw!';
  }
  return 'Next player: ' + (xIsNext ? 'X' : 'O');
}
