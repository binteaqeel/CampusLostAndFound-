import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Item } from '../types';
import { cn } from '../lib/utils';

interface ItemCardProps {
  item: Item;
  key?: React.Key;
}

export function ItemCard({ item }: ItemCardProps) {
  const isClaimed = item.status === 'claimed';

  return (
    <Link 
      to={`/item/${item._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            item.type === 'lost' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
          )}>
            {item.type}
          </span>
          <div className="flex items-center gap-1">
            {isClaimed ? (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Claimed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-400">
                <Clock className="h-3 w-3" />
                Unclaimed
              </span>
            )}
          </div>
        </div>

        <h3 className="mb-1 text-lg font-semibold text-zinc-900 line-clamp-1">{item.name}</h3>
        <p className="mb-4 text-sm text-zinc-500 line-clamp-2 flex-1">{item.description}</p>

        <div className="space-y-2 border-t border-zinc-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
