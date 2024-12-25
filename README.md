# Pokémon Battle Game

A turn-based Pokémon battle simulator built with Next.js and PokeAPI.

## Development Status

- [x] Set up Next.js project
- [x] Integrate PokeAPI for fetching Pokémon data
- [x] Implement Pokémon selection screen
- [x] Develop turn-based battle system
- [x] Calculate damage based on Pokémon types and moves
- [x] Create responsive design
- [ ] Add additional moves like defend
- [ ] Display slow scroll text for battle information
- [ ] Add animations for battle moves
- [ ] Implement multiplayer functionality
- [ ] Write unit tests for components
- [ ] Optimize performance for production

## How to Play

1. **Select Your Pokémon**: Choose your Pokémon from the list of available Pokémon fetched from PokeAPI.
2. **Battle**: Engage in a turn-based battle where you can select moves for your Pokémon to attack the opponent.
3. **Win or Lose**: The battle continues until one Pokémon's health points (HP) reach zero. The player with the remaining Pokémon wins the battle.

## Features

- Turn-based battle system
- Fetches Pokémon data from PokeAPI
- Calculates damage based on Pokémon types and moves
- Responsive design

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Petr1197/pokemon-battle-game.git
```

2. Navigate to the project directory:

```bash
cd pokemon-battle-game
```

3. Install dependencies:

```bash
npm install
```

## Usage

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000/Turn-Battle`

## API Routes

- **GET /api/pokemon**: Fetches a list of Pokémon from PokeAPI.
- **POST /api/battle**: Initiates a battle between selected Pokémon.

### POST /api/battle

Initiates a battle between selected Pokémon.

#### Request

- **URL**: `/api/battle`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  - `player1`: The ID or name of the first player's Pokémon.
  - `player2`: The ID or name of the second player's Pokémon.
  - `action`: The action to be taken (e.g., "attack", "defend").
  - `move`: The specific move to be used by the Pokémon.

#### Example Request

```json
{
  "player1": "charmander",
  "player2": "bulbasaur",
  "action": "attack",
  "move": "fire-punch"
}
```

#### Example Response

```json
{
  "gameState": {
    "player1": {
      "name": "bulbasaur",
      "hp": 45,
      "id": 1,
      "attack": 49,
      "defense": 49,
      "maxHp": 45,
      "moves": [
        {
          "name": "razor-wind",
          "power": 80,
          "type": "normal"
        },
        {
          "name": "swords-dance",
          "power": 50,
          "type": "normal"
        },
        {
          "name": "cut",
          "power": 50,
          "type": "normal"
        },
        {
          "name": "bind",
          "power": 15,
          "type": "normal"
        }
      ],
      "sprites": {
        "front": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "back": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
        "official": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
      }
    },
    "player2": {
      "name": "charmander",
      "hp": 39,
      "id": 4,
      "attack": 52,
      "defense": 49,
      "maxHp": 39,
      "moves": [
        {
          "name": "mega-punch",
          "power": 80,
          "type": "normal"
        },
        {
          "name": "fire-punch",
          "power": 75,
          "type": "fire"
        },
        {
          "name": "thunder-punch",
          "power": 75,
          "type": "electric"
        },
        {
          "name": "scratch",
          "power": 40,
          "type": "normal"
        }
      ],
      "sprites": {
        "front": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        "back": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
        "official": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
      }
    },
    "currentTurn": "player1",
    "status": "player1_turn",
    "winner": null
  }
}
```

### Damage Calculation

The `calculateDamage` function in `battlecalc.ts` is responsible for determining the damage dealt by one Pokémon to another during a battle. It uses the following steps:

1. **Fetch Pokémon Data**: Retrieves the attack and defense stats, as well as the type of both the attacker and defender from the PokéAPI.
2. **Construct Pokémon Objects**: Creates `attacker` and `defender` objects with relevant stats.
3. **Calculate STAB**: Determines if the move benefits from the Same Type Attack Bonus (STAB).
4. **Determine Type Effectiveness**: Uses a type chart to find the effectiveness of the move's type against the defender's type.
5. **Compute Damage**: Applies a simplified damage formula to calculate the final damage output.

This function is essential for simulating battles and understanding the impact of different moves in the game. Below is an example of how the function might be used:

```typescript
import calculateDamage from "./battlecalc";
import { Move } from "@/app/types/types";

const move: Move = {
  name: "fire-punch",
  power: 75,
  type: "fire",
};

const damage = await calculateDamage(4, 1, move); // Example: Charmander (id 4) attacks Bulbasaur (id 1)
console.log(`Damage dealt: ${damage}`);
```

## Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the application for production
- `npm run start`: Starts the production server
- `npm run lint`: Runs ESLint

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License

This project is licensed under the MIT License.
