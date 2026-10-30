"use client";

import { useState } from "react";
import MailingForm from "./MailingForm";
import MailingTable from "./MailingTable";

export default function MailingsView({ mailings, mailers, lists }) {
  const [editingMailing, setEditingMailing] = useState(null);

  return (
    <div className="flex flex-col items-center gap-8 w-full px-4 py-12 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold text-white tracking-tight">
        📬 Mail Scheduler
      </h1>

      <MailingForm
        mailers={mailers}
        lists={lists}
        editingMailing={editingMailing}
        onCancelEdit={() => setEditingMailing(null)}
      />

      <MailingTable
        mailings={mailings}
        onEdit={(m) => setEditingMailing(m)}
      />
    </div>
  );
}
