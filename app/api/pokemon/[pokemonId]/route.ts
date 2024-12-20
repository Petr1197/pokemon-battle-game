export async function GET(request: Request, { params }: { params: { pokemonId: number | string } }): Promise<Response> {
  const { pokemonId } = await params
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {
    })
    const data = await res.json();
    return Response.json({ data }.data);
  } catch (error) {
    return Response.json({ error: "invalid pokemonId, could not fetch pokemon "+ error });
  }
}