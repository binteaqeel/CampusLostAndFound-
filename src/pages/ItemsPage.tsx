import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Calendar, Loader2 } from 'lucide-react';
import { itemService } from '../services/itemService';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';

interface ItemsPageProps {
  type: 'lost' | 'found';
}

export function ItemsPage({ type }: ItemsPageProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = type === 'lost' 
          ? await itemService.getLostItems() 
          : await itemService.getFoundItems();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [type]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === '' || item.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {type === 'lost' ? 'Lost Items' : 'Found Items'}
        </h1>
        <p className="text-zinc-500">
          {type === 'lost' 
            ? "Browse items that students have lost on campus." 
            : "Browse items that have been found and are waiting to be claimed."}
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 text-center">
          <p className="mb-2 text-lg font-semibold text-zinc-900">No items found</p>
          <p className="text-zinc-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
