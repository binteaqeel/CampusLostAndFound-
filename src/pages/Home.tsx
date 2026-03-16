import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, ArrowRight, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { itemService } from '../services/itemService';
import { Item } from '../types';
import { ItemCard } from '../components/ItemCard';

export function Home() {
  const [recentItems, setRecentItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const lost = await itemService.getLostItems();
        const found = await itemService.getFoundItems();
        const all = [...lost, ...found].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentItems(all.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 text-white sm:rounded-[3rem]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500 blur-[120px]" />
          <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-500 blur-[120px]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl"
            >
              Lost it? <br />
              <span className="text-emerald-400">Find it.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 text-lg text-zinc-400 sm:text-xl"
            >
              The central hub for lost and found items at our university. 
              Helping students reconnect with their belongings through a simple, 
              community-driven platform.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/post-lost" className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-black transition-all hover:bg-zinc-200">
                <PlusCircle className="h-5 w-5" />
                Report Lost
              </Link>
              <Link to="/post-found" className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                <Search className="h-5 w-5" />
                Report Found
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: MapPin, title: "Location Based", desc: "Easily filter items by campus buildings and common areas." },
            { icon: Clock, title: "Real-time Updates", desc: "Get notified as soon as someone finds your missing item." },
            { icon: ShieldCheck, title: "Secure Claims", desc: "Verified process to ensure items return to rightful owners." }
          ].map((feature, i) => (
            <div key={i} className="rounded-3xl border border-black/5 bg-white p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-black">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Items */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Recent Reports</h2>
            <p className="text-zinc-500">The latest items reported on campus.</p>
          </div>
          <Link to="/lost" className="hidden items-center gap-1 text-sm font-bold text-black hover:underline sm:flex">
            View all items
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50">
            <p className="text-zinc-400">No items reported yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
