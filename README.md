# Pokémon Battle Game

A turn-based Pokémon battle simulator built with Next.js and PokeAPI.

## Development Status

- [x] Set up Next.js project
- [x] Integrate PokeAPI for fetching Pokémon data
- [x] Implement Pokémon selection screen
- [x] Develop turn-based battle system
- [x] Calculate damage based on Pokémon types and moves
- [x] Create responsive design
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
  git clone https://github.com/yourusername/pokemon-battle-game.git
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
  "player1": "pikachu",
  "player2": "bulbasaur",
  "action": "attack",
  "move": "thunderbolt"
}

#### Example Request

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