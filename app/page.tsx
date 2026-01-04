"use client";
import { useState, useEffect } from "react";

// -------------------- CONSTANTS --------------------
const MAX_ATTEMPTS = 10;
const WORD_LIST = [
  "APPLE","BEACH","CHAIR","DRIVE","EMPTY","FLAME","GRAPE","HOUSE","IMAGE","JUICE",
  "KNIFE","LEMON","MONEY","NIGHT","OCEAN","PIANO","QUEEN","RADIO","SHELF","TABLE",
  "UNCLE","VOICE","WATER","YOUTH","ZEBRA"
];

const SUDOKU_PUZZLES = {
  easy: [{ board: [[1,3,2,4],[0,4,1,3],[4,1,3,0],[3,2,4,1]] }],
  medium: [{ board: [[1,0,2,4],[0,4,1,0],[4,1,0,0],[0,2,4,1]] }],
  hard: [{ board: [[0,0,2,0],[0,4,0,0],[0,0,3,0],[0,2,0,0]] }]
};

// -------------------- MAIN HUB --------------------
export default function PuzzleHub() {
  const [game, setGame] = useState<"sudoku" | "wordle" | "memory" | "rps">("sudoku");

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-6 bg-slate-50">
      <h1 className="text-4xl font-extrabold">Puzzle Hub</h1>

      <div className="flex bg-slate-200 p-1 rounded-xl">
        {["sudoku","wordle","memory","rps"].map(g => (
          <button
            key={g}
            onClick={() => setGame(g as any)}
            className={`px-4 py-2 rounded-lg font-bold capitalize ${
              game === g ? "bg-white shadow text-blue-600" : "text-slate-600"
            }`}
          >
            {g === "rps" ? "RPS" : g}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow min-h-[520px]">
        {game === "sudoku" && <Sudoku />}
        {game === "wordle" && <Wordle />}
        {game === "memory" && <MemoryMatch />}
        {game === "rps" && <RockPaperScissors />}
      </div>
    </div>
  );
}

// -------------------- ROCK PAPER SCISSORS --------------------
function RockPaperScissors() {
  const choices = ["rock", "paper", "scissors"] as const;
  const emojis: any = { rock: "⚫", paper: "📄", scissors: "✂️" };

  const [player, setPlayer] = useState<string | null>(null);
  const [ai, setAi] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  const play = (choice: string) => {
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    setPlayer(choice);
    setAi(aiChoice);

    if (choice === aiChoice) {
      setResult("Draw 🤝");
      setScore(s => ({ ...s, draw: s.draw + 1 }));
    } else if (
      (choice === "rock" && aiChoice === "scissors") ||
      (choice === "paper" && aiChoice === "rock") ||
      (choice === "scissors" && aiChoice === "paper")
    ) {
      setResult("You Win 🎉");
      setScore(s => ({ ...s, win: s.win + 1 }));
    } else {
      setResult("You Lose 😢");
      setScore(s => ({ ...s, lose: s.lose + 1 }));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Rock Paper Scissors</h2>

      <div className="flex gap-4">
        {choices.map(c => (
          <button
            key={c}
            onClick={() => play(c)}
            className="text-4xl bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl"
          >
            {emojis[c]}
          </button>
        ))}
      </div>

      {player && (
        <div className="text-center mt-4">
          <p>You: {emojis[player]} | AI: {emojis[ai!]}</p>
          <p className="font-bold mt-2">{result}</p>
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm font-bold">
        <span>Win: {score.win}</span>
        <span>Lose: {score.lose}</span>
        <span>Draw: {score.draw}</span>
      </div>

      <button
        onClick={() => {
          setScore({ win: 0, lose: 0, draw: 0 });
          setPlayer(null);
          setAi(null);
          setResult("");
        }}
        className="mt-3 px-4 py-2 bg-slate-800 text-white rounded-lg"
      >
        Reset Score
      </button>
    </div>
  );
}

// -------------------- WORDLE --------------------
function Wordle() {
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setTarget(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  }, []);

  const submit = () => {
    if (input.length !== 5) return;
    setGuesses([...guesses, input.toUpperCase()]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-2xl font-bold">Wordle</h2>

      {guesses.map((g, i) => (
        <div key={i} className="flex gap-1">
          {g.split("").map((l, j) => (
            <div key={j} className="w-10 h-10 bg-green-500 text-white flex items-center justify-center font-bold">
              {l}
            </div>
          ))}
        </div>
      ))}

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        maxLength={5}
        className="border p-2 uppercase text-center"
      />
      <button onClick={submit} className="bg-green-600 text-white px-4 py-1 rounded">
        Guess
      </button>
    </div>
  );
}

// -------------------- MEMORY MATCH --------------------
function MemoryMatch() {
  const icons = ["🍎","🍌","🍇","🍊"];
  const [cards, setCards] = useState<any[]>([]);
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => {
    const shuffled = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((v, i) => ({ id: i, val: v, flipped: false }));
    setCards(shuffled);
  }, []);

  const flip = (id: number) => {
    if (picked.length === 2 || cards[id].flipped) return;
    const copy = [...cards];
    copy[id].flipped = true;
    setCards(copy);
    setPicked([...picked, id]);
  };

  useEffect(() => {
    if (picked.length === 2) {
      const [a, b] = picked;
      if (cards[a].val !== cards[b].val) {
        setTimeout(() => {
          const copy = [...cards];
          copy[a].flipped = false;
          copy[b].flipped = false;
          setCards(copy);
        }, 700);
      }
      setTimeout(() => setPicked([]), 700);
    }
  }, [picked]);

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map(c => (
        <div
          key={c.id}
          onClick={() => flip(c.id)}
          className="w-16 h-16 bg-blue-500 text-3xl flex items-center justify-center rounded cursor-pointer"
        >
          {c.flipped ? c.val : ""}
        </div>
      ))}
    </div>
  );
}

// -------------------- SUDOKU --------------------
function Sudoku() {
  const [difficulty, setDifficulty] = useState<"easy"|"medium"|"hard">("easy");
  const puzzle = SUDOKU_PUZZLES[difficulty][0];
  const [board, setBoard] = useState(puzzle.board.map(r => [...r]));

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Sudoku ({difficulty})</h2>

      <div className="grid grid-cols-4 gap-2">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              value={cell || ""}
              onChange={e => {
                if (puzzle.board[r][c] !== 0) return;
                const v = parseInt(e.target.value);
                const next = [...board];
                next[r][c] = v >= 1 && v <= 4 ? v : 0;
                setBoard(next);
              }}
              className="w-14 h-14 text-center text-xl border rounded"
            />
          ))
        )}
      </div>

      <div className="flex gap-2">
        {["easy","medium","hard"].map(d => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d as any);
              setBoard(SUDOKU_PUZZLES[d as any][0].board.map(r => [...r]));
            }}
            className="px-3 py-1 bg-slate-200 rounded"
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
