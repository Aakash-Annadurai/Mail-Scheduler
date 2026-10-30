import { getMailings, getMailers, getLists } from "./lib/db";
import MailingsView from "./components/MailingsView";

// Ensure fresh data on every request (no stale cache from JSON reads)
export const dynamic = "force-dynamic";

export default function Home() {
  const mailings = getMailings();
  const mailers = getMailers();
  const lists = getLists();

  return (
    <MailingsView mailings={mailings} mailers={mailers} lists={lists} />
  );
}
