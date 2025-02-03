let mailings = [];
export async function PATCH(req, { params }) {
    // Update an existing mailing
    const { id } = params;
    const { mailerId, listId, schedule } = await req.json();
  
    const index = mailings.findIndex((m) => m.id == Number(id));
    if (index === -1) {
      return new Response(
        JSON.stringify({ message: "Not Found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  
    // Update the mailing data
    mailings[index] = { ...mailings[index], mailerId, listId, schedule };
    return new Response(JSON.stringify(mailings[index]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  export async function DELETE(req, { params }) {
    // Delete a mailing by ID
    const { id } = params;
    console.log("Request ID:", id); // Check the id from the URL

    mailings = mailings.filter((m) => m.id != Number(id));
  
    return new Response(
      JSON.stringify({ message: "Deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }