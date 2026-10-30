"use client";

import { deleteMailing } from "../actions/mailings";

export default function MailingTable({ mailings, onEdit }) {
  const handleDelete = async (id) => {
    if (!confirm("Delete this mailing?")) return;
    await deleteMailing(id);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (!mailings || mailings.length === 0) {
    return (
      <div className="w-full max-w-2xl text-center py-12 text-slate-500">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">No mailings scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Scheduled Mailings
      </h3>

      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Mailer
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                List
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Scheduled For
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {mailings.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-slate-700/20 transition-colors"
              >
                <td className="px-4 py-3 text-white">{m.mailerId}</td>
                <td className="px-4 py-3 text-slate-300">{m.listId}</td>
                <td className="px-4 py-3 text-slate-300">
                  {formatDate(m.schedule)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                      m.status === "sent"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {m.status === "sent" ? "Sent" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(m)}
                    className="text-blue-400 hover:text-blue-300 text-sm mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
