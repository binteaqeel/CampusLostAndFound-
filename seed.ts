import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

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

const seedData = [
  {
    type: 'lost',
    name: 'Blue Hydro Flask',
    description: '32oz blue water bottle with a few stickers on it, including a university logo.',
    date: new Date('2026-03-01'),
    location: 'Main Library, 2nd Floor',
    imageUrl: 'https://picsum.photos/seed/bottle/800/600',
    posterContact: 'student1@university.edu',
    status: 'unclaimed'
  },
  {
    type: 'found',
    name: 'Apple AirPods Pro',
    description: 'Found a pair of AirPods in a white charging case near the gym entrance.',
    date: new Date('2026-03-04'),
    location: 'Student Recreation Center',
    imageUrl: 'https://picsum.photos/seed/airpods/800/600',
    posterContact: 'gym_staff@university.edu',
    status: 'unclaimed'
  },
  {
    type: 'lost',
    name: 'Black Leather Wallet',
    description: 'Contains a student ID and some cash. Lost it somewhere between the Engineering building and the Union.',
    date: new Date('2026-03-02'),
    location: 'Engineering Quad',
    imageUrl: 'https://picsum.photos/seed/wallet/800/600',
    posterContact: '555-0123',
    status: 'unclaimed'
  }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not provided. Cannot seed.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await Item.deleteMany({});
    console.log("Cleared existing items.");
    
    await Item.insertMany(seedData);
    console.log("Seed data inserted successfully!");
    
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
