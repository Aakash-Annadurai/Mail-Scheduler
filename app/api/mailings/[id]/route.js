// app/api/mailings/[id]/route.js

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
    throw new Error('Failed to read mailings');
  }
};

// Helper function to write mailings data to the JSON file
const saveMailings = (mailings) => {
  try {
    const data = JSON.stringify(mailings, null, 2);
    fs.writeFileSync(mailingsFilePath, data);
  } catch (err) {
    console.error('Error writing to mailings file:', err);
    throw new Error('Failed to save mailings');
  }
};

// PATCH - Update an existing mailing by its ID
export async function PATCH(req, { params }) {
  const { id } = params;  // Access params from route params
  console.log('Updating mailing with ID:', id);

  try {
    const mailings = getMailings();  // Get the existing mailings
    const mailingIndex = mailings.findIndex((mailing) => mailing.id === Number(id));

    if (mailingIndex === -1) {
      console.error('Mailing not found for ID:', id);
      return new Response(JSON.stringify({ error: 'Mailing not found' }), { status: 404 });
    }

    // Parse the JSON body of the request to get the updated data
    const updatedData = await req.json();

    // Update the mailing properties (for example, schedule)
    const updatedMailing = { ...mailings[mailingIndex], ...updatedData };

    // Replace the old mailing with the updated one
    mailings[mailingIndex] = updatedMailing;

    saveMailings(mailings);  // Save the updated mailings back to the file

    return new Response(JSON.stringify(updatedMailing), { status: 200 });  // Return the updated mailing
  } catch (error) {
    console.error('Error in PATCH request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  const { id } = params;  // Access params from route params
  console.log('Deleting mailing with ID:', id);

  try {
    const mailings = getMailings();  // Get the existing mailings
    const mailingIndex = mailings.findIndex((mailing) => mailing.id === Number(id));

    if (mailingIndex === -1) {
      console.error('Mailing not found for ID:', id);
      return new Response(JSON.stringify({ error: 'Mailing not found' }), { status: 404 });
    }

    // Remove the mailing from the array
    mailings.splice(mailingIndex, 1);
    saveMailings(mailings);  // Save the updated mailings back to the file

    return new Response(null, { status: 204 });  // Successfully deleted, no content to return
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}