export type Pokemon = {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  maxHp: number;
  moves: Move[];
  sprites: {
    front: string;
    back: string;
    official: string;
  };
};

export type GameState = {
  player1: Pokemon;
  player2: Pokemon;
  currentTurn: "player1" | "player2";
  status: "idle" | "player1_turn" | "player2_thinking" | "game_over";
  winner: string | null;
};

export type Move = {
  name: string;
  power: number;
  type: string;
};

// battleCalc.ts

export type Attacker = {
  level: number;
  attack: number;
  defense: number;
  type: string;
};
export type Defender = {
  level: number;
  attack: number;
  defense: number;
  type: string;
};

export type TypeChart = {
  [key: string]: { [key: string]: number };
};