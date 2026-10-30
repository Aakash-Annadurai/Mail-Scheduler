import fs from "fs";
import path from "path";

const MAILINGS_PATH = path.join(process.cwd(), "data", "mailings.json");

// ── Static data (would come from a DB in production) ────────────────────────

export function getMailers() {
  return [
    { id: 1, name: "Welcome Email" },
    { id: 2, name: "Promo Offer" },
  ];
}

export function getLists() {
  return [
    { id: 1, name: "Customer List" },
    { id: 2, name: "Newsletter Subscribers" },
  ];
}

// ── Mailings persistence ────────────────────────────────────────────────────

export function getMailings() {
  try {
    const raw = fs.readFileSync(MAILINGS_PATH, "utf-8");
    const mailings = JSON.parse(raw);

    // Backfill status for legacy records that don't have it
    return mailings.map((m) => ({
      ...m,
      status: m.status ?? "pending",
    }));
  } catch {
    return [];
  }
}

export function saveMailings(mailings) {
  const data = JSON.stringify(mailings, null, 2);
  fs.writeFileSync(MAILINGS_PATH, data);
}
