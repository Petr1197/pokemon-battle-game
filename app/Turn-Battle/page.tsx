"use client";

import { useState } from "react";
import { GameState, Move } from "../types/types";

export default function TurnBasedBattle() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [player1, setPlayer1] = useState<string | null>("bulbasaur");
  const [player2, setPlayer2] = useState<string | null>("charmander");
  const [move, setMove] = useState<Move | null>({ power: 50, type: "normal" });

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

  const attack = async () => {
    const response = await fetch("/api/battle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1: player1,
        player2: player2,
        action: "attack",
        move: move,
      }),
    });
    const data = await response.json();
    setGameState(data.gameState);
  };

  const resetGame = async () => {
    await fetch("/api/battle", { method: "DELETE" });
    setGameState(null);
  };

  const BattleUI = ({
    gameState,
    attack,
    resetGame,
    startGame,
  }: {
    gameState: GameState | null;
    attack: () => void;
    resetGame: () => void;
    startGame: () => void;
  }) => {
    if (!gameState) {
      return (
        <div className="welcome-screen">
          <h1>Pokémon Battle</h1>
          <div className="player-select">
            <p>Player 1: Bulbasaur vs Player 2: Charmander</p>
            <button onClick={startGame}>Start Battle</button>
          </div>
        </div>
      );
    }
    const renderGameState = () => {
      switch (gameState.status) {
        case "idle":
          return <h2>Waiting for players...</h2>;

        case "player1_turn":
          return (
            <div className="battle-container">
              <h2>Your Turn!</h2>
              <div className="player-stats">
                <div className="player">
                  <h3>{gameState.player1.name}</h3>
                  <div className="health-bar">
                    <div
                      className = {gameState.player2.hp / gameState.player2.maxHp < 0.3 ? 'health-fill-low' : 'health-fill'}
                      style={{
                        width: `${
                          (gameState.player2.hp / gameState.player2.maxHp) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p>
                    {gameState.player1.hp} / {gameState.player1.maxHp} HP
                  </p>
                </div>
                <div className="player">
                  <h3>{gameState.player2.name}</h3>
                  <div className="health-bar">
                    <div
                      className = {gameState.player2.hp / gameState.player2.maxHp < 0.5 ? 'health-fill-low' : 'health-fill'}
                      style={{
                        width: `${
                          (gameState.player2.hp / gameState.player2.maxHp) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p>
                    {gameState.player2.hp} / {gameState.player2.maxHp} HP
                  </p>
                </div>
              </div>
              <div className="controls">
                <button onClick={attack}>Attack</button>
                <button onClick={resetGame}>Reset Game</button>
              </div>
            </div>
          );

        case "player2_thinking":
          return (
            <div className="battle-container">
              <h2>Opponent is thinking...</h2>
              <div className="player-stats">
                {/* Same player stats as above */}
              </div>
            </div>
          );

        case "game_over":
          return (
            <div className="battle-container">
              <h2>Game Over!</h2>
              <h3>Winner: {gameState.winner}</h3>
              <div className="player-stats">
                {/* Same player stats as above */}
              </div>
              <button onClick={resetGame}>Play Again</button>
            </div>
          );

        default:
          return (
            <div>
              <h1>Turn-Based Pokémon Battle</h1>
              <button onClick={startGame}>Start Game</button>
            </div>
          );
      }
    };

    return <div className="game-container">{renderGameState()}</div>;
  };

  // Main component return
  return (
    <div className="game-wrapper">
      <BattleUI
        gameState={gameState}
        attack={attack}
        resetGame={resetGame}
        startGame={startGame}
      />
    </div>
  );
}
