import calculateDamage from "./api/battle/battleCalc";


export default function Home() {
  const damage = calculateDamage(4, 1, { power: 10, type: "fire" });
  return (
    <div className="">
      {damage}
    </div>
  );
}
