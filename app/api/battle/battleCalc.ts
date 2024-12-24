import typechart from "./type-chart.json";
import { Attacker, Defender, Move, TypeChart } from "@/app/types/types";


// Function to get effectiveness
function getEffectiveness(
  attackType: string,
  defenderType: string,
  typechart: TypeChart
) {
  if (typechart[attackType] && typechart[attackType][defenderType]) {
    return typechart[attackType][defenderType];
  }
  return 1; // Default to neutral effectiveness if not defined
}

export default async function calculateDamage(
  attackerId: number,
  defenderId: number,
  move: Move
) {
  const attackerResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${attackerId}`);
  const defenderResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${defenderId}`);

  const attackerResponseData = await attackerResponse.json();
  const defenderResponseData = await defenderResponse.json();

  const attacker: Attacker = {
    level: 5, // default level
    attack: attackerResponseData.stats[1].base_stat,
    defense: attackerResponseData.stats[2].base_stat,
    type: attackerResponseData.types[0].type.name,
  };

  const defender: Defender = {
    level: 5, // default level
    attack: defenderResponseData.stats[1].base_stat,
    defense: defenderResponseData.stats[2].base_stat,
    type: defenderResponseData.types[0].type.name,
  };

  const basePower = move.power;
  const attack = attacker.attack;
  const defense = defender.defense;

  // Calculate STAB
  let stab = 1;
  if (attacker.type === move.type) {
    stab = 1.5;
  }

  // Calculate type effectiveness (simplified)
  const typeEffectiveness = getEffectiveness(
    move.type,
    defender.type,
    typechart
  );

  // Damage formula (simplified)
  const damage = Math.floor(
    ((((2 * attacker.level) / 5 + 2) * basePower * attack) / defense / 50 + 2) *
      stab *
      typeEffectiveness
  );
  return damage;
}
