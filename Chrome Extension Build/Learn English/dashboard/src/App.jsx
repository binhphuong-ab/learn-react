import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import ChartsPanel from "./components/ChartsPanel";
import LibraryTable from "./components/LibraryTable";
import ReviewPanel from "./components/ReviewPanel";
import StatsCards from "./components/StatsCards";
import TimelineView from "./components/TimelineView";
import { api, API_BASE } from "./lib/api";

function toDateInput(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

function buildQuery(filters) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.tag) query.set("tag", filters.tag);
  if (filters.dateFrom) query.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) query.set("dateTo", filters.dateTo);
  if (filters.masteryMin !== "") query.set("masteryMin", filters.masteryMin);
  if (filters.masteryMax !== "") query.set("masteryMax", filters.masteryMax);
  query.set("limit", "100");
  return query.toString();
}

export default function App() {
  const [stats, setStats] = useState({ summary: {}, charts: {} });
  const [timeline, setTimeline] = useState([]);
  const [library, setLibrary] = useState([]);
  const [dueItems, setDueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filters, setFilters] = useState({
    q: "",
    tag: "",
    dateFrom: "",
    dateTo: "",
    masteryMin: "",
    masteryMax: ""
  });

  const exportLinks = useMemo(
    () => ({
      json: `${API_BASE}/api/export?format=json`,
      csv: `${API_BASE}/api/export?format=csv`
    }),
    []
  );

  async function loadStats() {
    const { data } = await api.get("/api/stats");
    setStats(data);
  }

  async function loadTimeline() {
    const query = {};
    if (filters.dateFrom) query.dateFrom = filters.dateFrom;
    if (filters.dateTo) query.dateTo = filters.dateTo;

    const { data } = await api.get("/api/timeline", { params: query });
    setTimeline(data.items || []);
  }

  async function loadLibrary() {
    const query = buildQuery(filters);
    const { data } = await api.get(`/api/vocab?${query}`);
    setLibrary(data.items || []);
  }

  async function loadDue() {
    const { data } = await api.get("/api/review/due?limit=50");
    setDueItems(data.items || []);
  }

  async function reloadAll() {
    setLoading(true);
    setError("");

    try {
      await Promise.all([loadStats(), loadTimeline(), loadLibrary(), loadDue()]);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadAll();
  }, []);

  useEffect(() => {
    const socket = io(API_BASE, { transports: ["websocket"] });
    socket.on("vocab:changed", () => {
      reloadAll();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function handleSearchSubmit(event) {
    event.preventDefault();
    try {
      await Promise.all([loadLibrary(), loadTimeline()]);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Search failed");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this word?")) {
      return;
    }
    await api.delete(`/api/vocab/${id}`);
    await reloadAll();
  }

  async function handleEdit(item) {
    const term = window.prompt("Term", item.term);
    if (term === null) return;

    const meaning = window.prompt("Meaning", item.meaning || "") || "";
    const tags = window.prompt("Tags (comma)", (item.tags || []).join(",")) || "";

    await api.put(`/api/vocab/${item._id}`, {
      ...item,
      term,
      meaning,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
    await reloadAll();
  }

  async function handleReview(id, rating) {
    await api.post(`/api/review/${id}`, { rating });
    await reloadAll();
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    let items = [];

    try {
      items = JSON.parse(text);
    } catch {
      alert("Invalid JSON file");
      return;
    }

    if (!Array.isArray(items)) {
      alert("Import JSON must be an array");
      return;
    }

    await api.post("/api/import", { items });
    await reloadAll();
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "timeline", label: "Timeline" },
    { id: "library", label: "Library" },
    { id: "review", label: "Review" }
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Learn English Insights</h1>
          <p>Local analytics and vocabulary control panel</p>
        </div>

        <div className="top-actions">
          <a href={exportLinks.json} target="_blank" rel="noreferrer">
            Export JSON
          </a>
          <a href={exportLinks.csv} target="_blank" rel="noreferrer">
            Export CSV
          </a>
          <label className="file-label">
            Import JSON
            <input type="file" accept="application/json" onChange={handleImport} />
          </label>
        </div>
      </header>

      <section className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="panel search-panel">
        <form onSubmit={handleSearchSubmit}>
          <input
            placeholder="Search term or meaning"
            value={filters.q}
            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
          />
          <input
            placeholder="Tag"
            value={filters.tag}
            onChange={(event) => setFilters((prev) => ({ ...prev, tag: event.target.value }))}
          />
          <input
            type="date"
            value={toDateInput(filters.dateFrom)}
            onChange={(event) => setFilters((prev) => ({ ...prev, dateFrom: event.target.value }))}
          />
          <input
            type="date"
            value={toDateInput(filters.dateTo)}
            onChange={(event) => setFilters((prev) => ({ ...prev, dateTo: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Mastery min"
            value={filters.masteryMin}
            onChange={(event) => setFilters((prev) => ({ ...prev, masteryMin: event.target.value }))}
          />
          <input
            type="number"
            placeholder="Mastery max"
            value={filters.masteryMax}
            onChange={(event) => setFilters((prev) => ({ ...prev, masteryMax: event.target.value }))}
          />
          <button type="submit">Apply</button>
        </form>
      </section>

      {error ? <p className="error-banner">{error}</p> : null}
      {loading ? <p className="loading">Loading...</p> : null}

      {!loading && activeTab === "dashboard" ? <StatsCards summary={stats.summary} /> : null}
      {!loading && activeTab === "dashboard" ? <ChartsPanel charts={stats.charts} /> : null}
      {!loading && activeTab === "timeline" ? <TimelineView items={timeline} /> : null}
      {!loading && activeTab === "library" ? (
        <LibraryTable items={library} onDelete={handleDelete} onEdit={handleEdit} />
      ) : null}
      {!loading && activeTab === "review" ? (
        <ReviewPanel items={dueItems} onRate={handleReview} />
      ) : null}
    </div>
  );
}
