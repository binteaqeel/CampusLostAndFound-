import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, CheckCircle2, ArrowLeft, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import { itemService } from '../services/itemService';
import { Item } from '../types';
import { cn } from '../lib/utils';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleClaim = async () => {
    if (!id) return;
    setClaiming(true);
    try {
      const updated = await itemService.claimItem(id);
      setItem(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <p className="text-xl font-bold">Item not found</p>
        <button onClick={() => navigate(-1)} className="text-zinc-500 hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </button>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Section */}
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-zinc-100">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-zinc-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={cn(
                "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                item.type === 'lost' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              )}>
                {item.type}
              </span>
              {item.status === 'claimed' && (
                <span className="flex items-center gap-1 text-xs font-bold uppercase text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Claimed
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-lg leading-relaxed text-zinc-600">{item.description}</p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-black/5 bg-zinc-50 p-6">
            <div className="flex items-center gap-3 text-zinc-600">
              <MapPin className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Location</p>
                <p className="font-medium">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-zinc-600">
              <Calendar className="h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Date {item.type === 'lost' ? 'Lost' : 'Found'}</p>
                <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setShowContact(!showContact)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-bold text-white transition-all hover:bg-zinc-800"
            >
              <MessageSquare className="h-5 w-5" />
              Contact {item.type === 'lost' ? 'Owner' : 'Finder'}
            </button>

            {item.status === 'unclaimed' && (
              <button 
                onClick={handleClaim}
                disabled={claiming}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white py-4 font-bold text-black transition-all hover:bg-zinc-50 disabled:opacity-50"
              >
                {claiming ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                Mark as Claimed
              </button>
            )}
          </div>

          {showContact && (
            <div className="animate-in fade-in slide-in-from-top-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">Contact Information</p>
              <p className="text-lg font-bold text-emerald-900">{item.posterContact}</p>
              <p className="mt-2 text-sm text-emerald-600">Please reach out to the person above to coordinate the return of the item.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
