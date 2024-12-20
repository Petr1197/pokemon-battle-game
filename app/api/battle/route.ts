import calculateDamage from "./battleCalc";
import { GameState } from "@/app/types/types";

// Constants
const OPPONENT_TURN_DELAY_MS = 2000;

// Temporary game state stored in memory
let gameState: GameState | null = null;

// Utility: Initialize game state
const initializeGameState = async (
  player1: string,
  player2: string
): Promise<GameState> => {
  const player1Response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${player1.toLowerCase()}`
  );
  const player2Response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${player2.toLowerCase()}`
  );

  if (!player1Response.ok || !player2Response.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }

  const player1Data = await player1Response.json();
  const player2Data = await player2Response.json();

  return {
    player1: {
      name: player1,
      hp: player1Data.stats[0].base_stat,
      id: player1Data.id,
      attack: player1Data.stats[1].base_stat,
      defense: player1Data.stats[2].base_stat
    },
    player2: {
      name: player2,
      hp: player2Data.stats[0].base_stat,
      id: player2Data.id,
      attack: player2Data.stats[1].base_stat,
      defense: player1Data.stats[2].base_stat
    },
    currentTurn: "player1",
    status: "player1_turn",
    winner: null,
  };
};

// Utility: Create JSON response
const createResponse = (data: unknown, status: number): Response =>
  new Response(JSON.stringify(data), { status });

// Endpoint: Handle POST request
export async function POST(req: Request): Promise<Response> {
  try {
    const { player1, player2, action, move } = await req.json();

    // Initialize game state if not already set
    if (!gameState) {
      if (!player1 || !player2) {
        return createResponse(
          { error: "Both players are required to start a game" },
          400
        );
      }
      gameState = await initializeGameState(player1, player2);
      return createResponse({ gameState }, 200);
    }

    // Validate game state and action
    if (!gameState || !["attack"].includes(action)) {
      return createResponse({ error: "Invalid action or game state" }, 400);
    }

    // Check if game is over
    if (gameState.winner) {
      return createResponse(
        { message: "Game is already over", gameState },
        200
      );
    }

    // Player 1's turn
    if (gameState.currentTurn === "player1" && action === "attack") {
      if (!move) {
        return createResponse({ error: "Move is required for attack" }, 400);
      }

      const damage = await calculateDamage(
        gameState.player1.id,
        gameState.player2.id,
        move
      );
      gameState.player2.hp -= damage;

      if (gameState.player2.hp <= 0) {
        gameState.player2.hp = 0;
        gameState.winner = gameState.player1.name;
        gameState.status = "game_over";
        return createResponse({ gameState }, 200);
      }

      gameState.currentTurn = "player2";
      gameState.status = "player2_thinking";
    } else if (gameState.currentTurn === "player2") {
      return createResponse({ error: "It's not your turn" }, 400);
    }

    // AI (Player 2) Turn
    const opponentTurn = await new Promise<GameState>((resolve) => {
      setTimeout(async () => {
        if (gameState?.currentTurn === "player2") {
          const move = { power: 50, type: "normal" }; // AI uses a default move
          const damage = await calculateDamage(
            gameState.player2.id,
            gameState.player1.id,
            move
          );

          gameState.player1.hp -= damage;

          if (gameState.player1.hp <= 0) {
            gameState.player1.hp = 0;
            gameState.winner = gameState.player2.name;
            gameState.status = "game_over";
          } else {
            gameState.currentTurn = "player1";
            gameState.status = "player1_turn";
          }
        }
        resolve(gameState as GameState);
      }, OPPONENT_TURN_DELAY_MS);
    });

    return createResponse({ gameState: opponentTurn }, 200);
  } catch (error: unknown) {
    console.error("Error processing POST request:", error);
    const errorMessage =
      error instanceof Error
        ? `Internal Server Error: ${error.message}`
        : "Internal Server Error";
    return createResponse({ error: errorMessage }, 500);
  }
}

// Endpoint: Handle DELETE request
export async function DELETE(): Promise<Response> {
  gameState = null;
  return createResponse({ message: "Game has been reset" }, 200);
}
