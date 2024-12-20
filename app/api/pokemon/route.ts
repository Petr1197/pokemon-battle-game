export async function GET(): Promise<Response> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150', {
  });
  const data = await res.json();
  return Response.json({ data });
}

