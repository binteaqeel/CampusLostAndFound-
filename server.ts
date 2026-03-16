import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

// In-memory fallback for demo purposes if DB is not connected
let mockItems: any[] = [
  {
    _id: "mock1",
    type: 'lost',
    name: 'Blue Hydro Flask (Demo)',
    description: 'This is a demo item because the database is not connected yet.',
    date: new Date(),
    location: 'Campus Center',
    imageUrl: 'https://picsum.photos/seed/bottle/800/600',
    posterContact: 'demo@university.edu',
    status: 'unclaimed',
    createdAt: new Date()
  }
];

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB Atlas");
      isConnected = true;
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      isConnected = false;
    });
} else {
  console.warn("MONGODB_URI not found in environment variables. Running in Mock Mode.");
}

// Schema
const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['unclaimed', 'claimed'], default: 'unclaimed' },
  posterContact: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model("Item", itemSchema);

// API Routes
app.get("/api/lost-items", async (req, res) => {
  try {
    if (!isConnected) {
      return res.json(mockItems.filter(i => i.type === 'lost'));
    }
    const items = await Item.find({ type: 'lost' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err: any) {
    console.error("Error fetching lost items:", err.message);
    res.status(500).json({ error: "Failed to fetch lost items", details: err.message });
  }
});

app.get("/api/found-items", async (req, res) => {
  try {
    if (!isConnected) {
      return res.json(mockItems.filter(i => i.type === 'found'));
    }
    const items = await Item.find({ type: 'found' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err: any) {
    console.error("Error fetching found items:", err.message);
    res.status(500).json({ error: "Failed to fetch found items", details: err.message });
  }
});

app.post("/api/lost-items", async (req, res) => {
  try {
    if (!isConnected) {
      const newItem = { ...req.body, _id: Math.random().toString(36).substr(2, 9), type: 'lost', createdAt: new Date(), status: 'unclaimed' };
      mockItems.push(newItem);
      return res.status(201).json(newItem);
    }
    const newItem = new Item({ ...req.body, type: 'lost' });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(400).json({ error: "Failed to post lost item", details: err.message });
  }
});

app.post("/api/found-items", async (req, res) => {
  try {
    if (!isConnected) {
      const newItem = { ...req.body, _id: Math.random().toString(36).substr(2, 9), type: 'found', createdAt: new Date(), status: 'unclaimed' };
      mockItems.push(newItem);
      return res.status(201).json(newItem);
    }
    const newItem = new Item({ ...req.body, type: 'found' });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(400).json({ error: "Failed to post found item", details: err.message });
  }
});

app.get("/api/items/:id", async (req, res) => {
  try {
    if (!isConnected) {
      const item = mockItems.find(i => i._id === req.params.id);
      if (!item) return res.status(404).json({ error: "Item not found" });
      return res.json(item);
    }
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch item details", details: err.message });
  }
});

app.put("/api/items/:id/claim", async (req, res) => {
  try {
    if (!isConnected) {
      const index = mockItems.findIndex(i => i._id === req.params.id);
      if (index === -1) return res.status(404).json({ error: "Item not found" });
      mockItems[index].status = 'claimed';
      return res.json(mockItems[index]);
    }
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: 'claimed' },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update item status", details: err.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
