import fs from 'fs';
import path from 'path';

// Path to the JSON file
const mailingsFilePath = path.join(process.cwd(), 'data', 'mailings.json');

// Helper function to read mailings from the local JSON file
const getMailings = () => {
  try {
    const fileData = fs.readFileSync(mailingsFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading mailings file:', err);
    return [];
  }
};

// Helper function to write mailings data to the JSON file
const saveMailings = (mailings) => {
  try {
    const data = JSON.stringify(mailings, null, 2);
    fs.writeFileSync(mailingsFilePath, data);
  } catch (err) {
    console.error('Error writing to mailings file:', err);
  }
};

// GET - Fetch all mailings
export async function GET() {
  const mailings = getMailings();  // Fetch mailings from the local JSON file
  return new Response(JSON.stringify(mailings), { status: 200 });
}

// POST - Add a new mailing
export async function POST(req) {
  const { mailerId, listId, schedule } = await req.json();

  if (!mailerId || !listId || !schedule) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const newMailing = { id: Date.now(), mailerId, listId, schedule };
  const mailings = getMailings();  // Get the existing mailings
  mailings.push(newMailing);  // Add the new mailing
  saveMailings(mailings);  // Save the updated mailings back to the file

  return new Response(JSON.stringify(newMailing), { status: 201 });  // Return the newly created mailing
}