"use server";

import { revalidatePath } from "next/cache";
import { getMailings, saveMailings } from "../lib/db";

export async function createMailing({ mailerId, listId, schedule }) {
  if (!mailerId || !listId || !schedule) {
    return { error: "All fields are required." };
  }

  const mailings = getMailings();
  const newMailing = {
    id: Date.now(),
    mailerId,
    listId,
    schedule,
    status: "pending",
  };

  mailings.push(newMailing);
  saveMailings(mailings);
  revalidatePath("/");

  return { success: true };
}

export async function updateMailing(id, { mailerId, listId, schedule }) {
  if (!mailerId || !listId || !schedule) {
    return { error: "All fields are required." };
  }

  const mailings = getMailings();
  const index = mailings.findIndex((m) => m.id === Number(id));

  if (index === -1) {
    return { error: "Mailing not found." };
  }

  mailings[index] = { ...mailings[index], mailerId, listId, schedule };
  saveMailings(mailings);
  revalidatePath("/");

  return { success: true };
}

export async function deleteMailing(id) {
  const mailings = getMailings();
  const index = mailings.findIndex((m) => m.id === Number(id));

  if (index === -1) {
    return { error: "Mailing not found." };
  }

  mailings.splice(index, 1);
  saveMailings(mailings);
  revalidatePath("/");

  return { success: true };
}
