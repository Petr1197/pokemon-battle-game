"use client";

import { useState } from "react";
import { GameState, Move } from "../types/types";
import BattleUI from "../components/Battle-UI";

export default function TurnBasedBattle() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [player1, setPlayer1] = useState<string | null>("bulbasaur");
  const [player2, setPlayer2] = useState<string | null>("charmander");

  const startGame = async () => {
    const response = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player1: player1, player2: player2 }),
    });
    const data = await response.json();
    // console.log("Game State Initial:", data.gameState);
    setGameState(data.gameState);
  };

  const attack = async (selectedMove: Move) => {
    const response = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1,
        player2,
        action: "attack",
        move: selectedMove,
      }),
    });
    const data = await response.json();
    setGameState(data.gameState);
  };

  const resetGame = async () => {
    await fetch("/api/battle", { method: "DELETE" });
    setGameState(null);
  };

  // Main component return
  return (
    <BattleUI
      gameState={gameState}
      attack={attack}
      resetGame={resetGame}
      startGame={startGame}
    />
  );
}
