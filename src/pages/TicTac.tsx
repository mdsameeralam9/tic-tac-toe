import { Fragment, useState } from "react";
import "./ticTac.css";

type boardType = string[]

const initialBoard = Array(9).fill('');
const isBoardFilled = (board:boardType):boolean => board.every(i => i !== "")

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

function getWinner(board:boardType) {
  for (let combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<boardType>(initialBoard);
  const [isX, setIsX] = useState<boolean>(false);
  const [isTie, setIsTie] = useState<boolean>(false);

  const winner = getWinner(board);
  const next = isX ? "X" : "O";

  function handleClick(idx:number) {
    if (board[idx] || winner || isTie) return;
    const updated = board.slice();
    updated[idx] = next;
    setBoard(updated);
    setIsX(!isX);

   const isWinner = getWinner(updated);
   if(!isWinner && isBoardFilled(updated)){
    setIsTie(true)
   }
  }

  function resetGame() {
    setBoard(initialBoard);
    setIsX(false);
    setIsTie(false)
  }

  // For next round
  function nextRound() {
    setBoard(initialBoard);
    setIsX(false);
    setIsTie(false)
  }

  let message = "";
  if(winner){
    message = `${!isX ? "X" : "O"} won the Game`
  } else {
    message = `Match tied`
  }

  return (
    <Fragment>
      {(!winner || !isTie) && (
        <div className="ttt-container">
          <header className="ttt-header">
            <button className="ttt-turn">{next} TURN</button>
            <button className="ttt-reset" onClick={resetGame}>
              ⟲
            </button>
          </header>
          <main className="ttt-board">
            {board.map((cell, idx) => (
              <button
                key={idx}
                className={`ttt-cell ${
                  cell === "O" ? "cell-o" : cell === "X" ? "cell-x" : ""
                }`}
                onClick={() => handleClick(idx)}
              >
                {cell}
              </button>
            ))}
          </main>
        </div>
      ) }
      
      {(winner || isTie) &&  (
        <div className="ttt-modal">
          <div className="ttt-modal-content">
            <h2
              className={
                winner === "O" ? "win" : winner === "X" ? "lose" : "tie"
              }
            >
              {message}
            </h2>
            <button className="ttt-next-round" onClick={nextRound}>
              Next Round
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
