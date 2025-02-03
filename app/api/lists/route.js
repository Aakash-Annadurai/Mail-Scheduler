
export async function GET() {
  return new Response(
    JSON.stringify([
      { id: 1, name: "Customer List" },
      { id: 2, name: "Newsletter Subscribers" },
    ]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}