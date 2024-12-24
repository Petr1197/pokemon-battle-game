

import React from 'react';
import { GameState, Move } from '@/app/types/types';
import { JSX } from 'react';

export default function BattleUI ({
    gameState,
    attack,
    resetGame,
    startGame,
  }: {
    gameState: GameState | null;
    attack: (move: Move) => void;
    resetGame: () => void;
    startGame: () => void;
  }): JSX.Element {
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

    const renderMoves = () => {
      if (!gameState?.player1.moves) return null;

      return (
        <div className="moves-container">
          {gameState.player1.moves.map((move: Move) => (
            <button
              key={move.name}
              onClick={() => handleAttack(move)}
              className={`move-button ${
                move?.name === move.name ? "selected" : ""
              }`}
            >
              {move.name} ({move.power} power)
            </button>
          ))}
        </div>
      );
    };

    const handleAttack = (move: Move) => {
      attack(move);
    };

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
                      className={
                        gameState.player2.hp / gameState.player2.maxHp < 0.3
                          ? "health-fill-low"
                          : "health-fill"
                      }
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
                      className={
                        gameState.player2.hp / gameState.player2.maxHp < 0.5
                          ? "health-fill-low"
                          : "health-fill"
                      }
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
                {renderMoves()}
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