"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [mailers, setMailers] = useState([]);
  const [lists, setLists] = useState([]);
  const [scheduledMailings, setScheduledMailings] = useState([]);
  const [selectedMailer, setSelectedMailer] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mailersRes = await fetch("/api/mailers");
      const listsRes = await fetch("/api/lists");
      const mailingsRes = await fetch("/api/mailings");

      if (!mailersRes.ok || !listsRes.ok || !mailingsRes.ok) {
        throw new Error("API request failed");
      }

      const mailersData = await mailersRes.json();
      const listsData = await listsRes.json();
      const mailingsData = await mailingsRes.json();

      console.log("Mailers:", mailersData);
      console.log("Lists:", listsData);
      console.log("Mailings:", mailingsData);

      setMailers(mailersData);
      setLists(listsData);
      setScheduledMailings(mailingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSubmit = async (e) => {
    if (!selectedMailer || !selectedList || !scheduleDate) {
      alert("Please select all fields");
      return;
    }

    const scheduleData = {
      mailerId: selectedMailer,
      listId: selectedList,
      schedule: scheduleDate,
    };

    if (editingId) {
      // Update an existing mailing
      const res = await fetch(`/api/mailings/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });
      if (res.ok) {
        alert("Mailing updated successfully!");
        setEditingId(null);
        setSelectedMailer("");
        setSelectedList("");
        setScheduleDate("");
      } else {
        alert("Failed to update mailing");
      }
    } else {
      // Create a new mailing
      const res = await fetch("/api/mailings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });

      if (res.ok) {
        alert("Mailing scheduled successfully!");
        setSelectedMailer("");
        setSelectedList("");
        setScheduleDate("");
      } else {
        alert("Failed to schedule mailing");
      }
    }
    e.preventDefault();
    fetchData();
  };

  const handleEdit = (mailing) => {
    setSelectedMailer(mailing.mailerId);
    setSelectedList(mailing.listId);
    setScheduleDate(mailing.schedule);
    setEditingId(mailing.id); // Set editing mode
  };

  const handleDelete = async (deleteid) => {
    const res = await fetch(`/api/mailings/${deleteid}`, { method: "DELETE" });

    if (res.ok) {
      alert("Mailing deleted");
      fetchData();
    }
  };
  return (
    <div className=" flex flex-col gap-5 w-full h-auto p-10 items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <h2 className="block text-xl font-bold">
        {editingId ? "Edit Mailing" : "Schedule a Mailing"}
      </h2>
      <div className="flex flex-col gap-3 w-3/2 h-auto">
        <label className="block text-sm font-semibold">Mailers</label>
        <select
          aria-placeholder="select mailers"
          className="text-black border p-2 w-full"
          value={selectedMailer}
          onChange={(e) => setSelectedMailer(e.target.value)}
        >
          <option value="">-- Select --</option>
          {mailers.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <label className="block text-sm font-semibold">List</label>
        <select
          aria-placeholder="select mailers"
          className="text-black border p-2 w-full"
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value)}
        >
          <option value="">-- Select --</option>
          {lists.map((l) => (
            <option key={l.id} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>
        <label className="block text-sm font-semibold">
          Schedule Date & Time
        </label>
        <input
          type="datetime-local"
          className="text-black border p-2 w-full"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
        <div className="flex flex-row justify-center items-center gap-2">
          <button
            className="px-4 py-2 w-1/2 bg-blue-800 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
            onClick={handleSubmit}
          >
            {editingId ? "Update" : "Schedule Mailing"}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setSelectedMailer("");
                setSelectedList("");
                setScheduleDate("");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded w-1/2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-6">Scheduled Mailings</h3>
      <table className="w-1/2 table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-center">Mailer</th>
            <th className="px-4 py-2 border-b text-center">List</th>
            <th className="px-4 py-2 border-b text-center">
              Schedule Date and Time
            </th>
            <th className="px-4 py-2 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {scheduledMailings &&
            scheduledMailings?.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-2 border-b text-center">{m.mailerId}</td>
                <td className="px-4 py-2 border-b text-center">{m.listId}</td>
                <td className="px-4 py-2 border-b text-center">{m.schedule}</td>
                <td className="px-4 py-2 border-b text-center">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
