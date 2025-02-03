let mailings = [];

export async function GET() {
  // Return the list of scheduled mailings
  return new Response(JSON.stringify(mailings), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  // Create a new mailing
  const { mailerId, listId, schedule } = await req.json();
  const newMailing = { id: Date.now(), mailerId, listId, schedule };
  mailings.push(newMailing);

  return new Response(JSON.stringify(newMailing), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}


