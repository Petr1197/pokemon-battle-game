"use client";

import { useState } from "react";
import { GameState, Move } from "../types/types";


export default function TurnBasedBattle() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [player1, setPlayer1] = useState<string | null>("bulbasaur");
  const [player2, setPlayer2] = useState<string | null>("charmander");
  const [move, setMove] = useState<Move | null>({ power: 40, type: "electric" });

  const startGame = async () => {
    const response = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player1: player1, player2: player2 }),
    });
    const data = await response.json();
    setGameState(data.gameState);
  };

  const attack = async () => {
    const response = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1: player1,
        player2: player2,
        action: "attack",
        move: {move},
      }),
    });
    const data = await response.json();
    setGameState(data.gameState);
  };

  const resetGame = async () => {
    await fetch("/api/battle", { method: "DELETE" });
    setGameState(null);
  };

  if (gameState && gameState.status === "idle")
    return <h2>Waiting for players...</h2>;
  else if (gameState && gameState.status === "player1_turn")
    return (
      <div>
        <h2>{gameState.currentTurn}s Turn</h2>
        <p>
          {gameState.player1.name}: {gameState.player1.hp} HP
        </p>
        <p>
          {gameState.player2.name}: {gameState.player2.hp} HP
        </p>
        <button onClick={attack}>Attack</button>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    );
  else if (gameState && gameState.status === "player2_thinking")
    return <h2>Opponent is thinking...</h2>;
  else if (gameState && gameState.status === "game_over")
    return (
      <div>
        <h3>Winner: {gameState.winner}</h3>
        <p>
          {gameState.player1.name}: {gameState.player1.hp} HP
        </p>
        <p>
          {gameState.player2.name}: {gameState.player2.hp} HP
        </p>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    );
  return (
    <div>
      <h1>Turn-Based Pokémon Battle</h1>
      {!gameState && <button onClick={startGame}>Start Game</button>}

      {gameState && (
        <>
          {gameState.winner ? (
            <div></div>
          ) : (
            <h2>{gameState.currentTurn}s Turn</h2>
          )}

          <p>
            {gameState.player1.name}: {gameState.player1.hp} HP
          </p>
          <p>
            {gameState.player2.name}: {gameState.player2.hp} HP
          </p>

          {gameState.winner ? (
            <h3>Winner: {gameState.winner}</h3>
          ) : (
            <button onClick={attack}>Attack</button>
          )}
          <button onClick={resetGame}>Reset Game</button>
        </>
      )}
    </div>
  );
}
