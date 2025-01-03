import calculateDamage from "./battleCalc";
import { GameState, Move } from "@/app/types/types";

// Constants
const OPPONENT_TURN_DELAY_MS = 800;

// Temporary game state stored in memory
let gameState: GameState | null = null;

// Utility: Fetch pokemon moves
async function fetchPokemonMoves(pokemonName: string): Promise<Move[]> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const data = await response.json();
  
  const moves = await Promise.all(
    data.moves.slice(0, 4).map(async (moveData: { move: { url: string } }) => {
      const moveResponse = await fetch(moveData.move.url);
      const moveDetails = await moveResponse.json();
      return {
        name: moveDetails.name,
        power: moveDetails.power || 50,
        type: moveDetails.type.name
      };
    })
  );
  
  return moves;
}

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
      defense: player1Data.stats[2].base_stat,
      maxHp: player1Data.stats[0].base_stat,
      moves: await fetchPokemonMoves(player1),
      sprites: {
        front: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${player1Data.id}.png`,
        back: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${player1Data.id}.png`,
        official: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${player1Data.id}.png`
      }
    },
    player2: {
      name: player2,
      hp: player2Data.stats[0].base_stat,
      id: player2Data.id,
      attack: player2Data.stats[1].base_stat,
      defense: player1Data.stats[2].base_stat,
      maxHp: player2Data.stats[0].base_stat,
      moves: await fetchPokemonMoves(player2),
      sprites: {
        front: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${player2Data.id}.png`,
        back: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${player2Data.id}.png`,
        official: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${player2Data.id}.png`
      }
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

    // console.log("Game State After P1 Turn:", gameState);

    // AI (Player 2) Turn
    const opponentTurn = await new Promise<GameState>((resolve) => {
      setTimeout(async () => {
        if (gameState?.currentTurn === "player2") {
          gameState.status = "player2_thinking";
          const randomMove = gameState.player2.moves[Math.floor(Math.random() * 4)]; // AI uses a default move
          const damage = await calculateDamage(
            gameState.player2.id,
            gameState.player1.id,
            randomMove
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

    // console.log("Game State After P2 Turn:", gameState);

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
