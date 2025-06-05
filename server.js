const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000; // Railway pakai PORT env

app.use(cors());
app.use(express.json());

const DB_FILE = "events.json";

// Baca data
function readEvents() {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
}

// Simpan data
function saveEvents(events) {
  fs.writeFileSync(DB_FILE, JSON.stringify(events, null, 2));
}

// GET semua event
app.get("/api/events", (req, res) => {
  const events = readEvents();
  res.json(events);
});

// POST event baru
app.post("/api/events", (req, res) => {
  const events = readEvents();
  const newEvent = { ...req.body, id: Date.now() };
  events.push(newEvent);
  saveEvents(events);
  res.json(newEvent);
});

// PUT update event
app.put("/api/events/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let events = readEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    saveEvents(events);
    res.json(events[index]);
  } else {
    res.status(404).send("Event tidak ditemukan");
  }
});

// DELETE hapus event
app.delete("/api/events/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let events = readEvents();
  events = events.filter(e => e.id !== id);
  saveEvents(events);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`API SmartLife berjalan di http://localhost:${PORT}`);
});
