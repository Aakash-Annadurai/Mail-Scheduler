"use client";

import { useState, useEffect } from "react";
import { createMailing, updateMailing } from "../actions/mailings";

export default function MailingForm({
  mailers,
  lists,
  editingMailing,
  onCancelEdit,
}) {
  const [mailerId, setMailerId] = useState("");
  const [listId, setListId] = useState("");
  const [schedule, setSchedule] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingMailing) {
      setMailerId(editingMailing.mailerId);
      setListId(editingMailing.listId);
      setSchedule(editingMailing.schedule);
      setMessage(null);
    }
  }, [editingMailing]);

  // Auto-dismiss feedback messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const resetForm = () => {
    setMailerId("");
    setListId("");
    setSchedule("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mailerId || !listId || !schedule) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setLoading(true);
    try {
      const payload = { mailerId, listId, schedule };
      const result = editingMailing
        ? await updateMailing(editingMailing.id, payload)
        : await createMailing(payload);

      if (result.success) {
        setMessage({
          type: "success",
          text: editingMailing ? "Mailing updated!" : "Mailing scheduled!",
        });
        resetForm();
        if (editingMailing) onCancelEdit();
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingMailing;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-xl p-6 space-y-5"
    >
      <h2 className="text-lg font-semibold text-white">
        {isEditing ? "✏️ Edit Mailing" : "📬 Schedule a Mailing"}
      </h2>

      {/* Feedback banner */}
      {message && (
        <div
          className={`text-sm px-4 py-2 rounded-lg ${
            message.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Mailer select */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">
          Mailer
        </label>
        <select
          value={mailerId}
          onChange={(e) => setMailerId(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
        >
          <option value="">Select a mailer…</option>
          {mailers.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* List select */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">
          Recipient List
        </label>
        <select
          value={listId}
          onChange={(e) => setListId(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
        >
          <option value="">Select a list…</option>
          {lists.map((l) => (
            <option key={l.id} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule date */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">
          Schedule Date & Time
        </label>
        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition"
        >
          {loading
            ? "Saving…"
            : isEditing
            ? "Update Mailing"
            : "Schedule Mailing"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              onCancelEdit();
            }}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
