
export async function GET() {
  return new Response(
    JSON.stringify([
      { id: 1, name: "Welcome Email" },
      { id: 2, name: "Promo Offer" },
    ]),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
