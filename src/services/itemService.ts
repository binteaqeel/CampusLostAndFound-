import { Item, NewItem } from "../types";

const API_BASE = "/api";

export const itemService = {
  async getLostItems(): Promise<Item[]> {
    const res = await fetch(`${API_BASE}/lost-items`);
    if (!res.ok) throw new Error("Failed to fetch lost items");
    return res.json();
  },

  async getFoundItems(): Promise<Item[]> {
    const res = await fetch(`${API_BASE}/found-items`);
    if (!res.ok) throw new Error("Failed to fetch found items");
    return res.json();
  },

  async getItemById(id: string): Promise<Item> {
    const res = await fetch(`${API_BASE}/items/${id}`);
    if (!res.ok) throw new Error("Item not found");
    return res.json();
  },

  async postLostItem(item: NewItem): Promise<Item> {
    const res = await fetch(`${API_BASE}/lost-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to post lost item");
    return res.json();
  },

  async postFoundItem(item: NewItem): Promise<Item> {
    const res = await fetch(`${API_BASE}/found-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to post found item");
    return res.json();
  },

  async claimItem(id: string): Promise<Item> {
    const res = await fetch(`${API_BASE}/items/${id}/claim`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to claim item");
    return res.json();
  },
};
