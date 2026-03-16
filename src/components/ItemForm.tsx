import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Calendar, User, FileText, Loader2 } from 'lucide-react';
import { itemService } from '../services/itemService';
import { NewItem } from '../types';

interface ItemFormProps {
  type: 'lost' | 'found';
}

export function ItemForm({ type }: ItemFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<NewItem>({
    type,
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    posterContact: '',
    imageUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'lost') {
        await itemService.postLostItem(formData);
      } else {
        await itemService.postFoundItem(formData);
      }
      navigate(type === 'lost' ? '/lost' : '/found');
    } catch (err) {
      setError("Failed to post item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Post {type === 'lost' ? 'Lost' : 'Found'} Item</h2>
        <p className="text-zinc-500">Fill in the details below to help others find their belongings.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <FileText className="h-4 w-4" />
            Item Name
          </label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Blue Backpack, iPhone 13"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <FileText className="h-4 w-4" />
            Description
          </label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Provide details like color, brand, unique marks..."
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <Calendar className="h-4 w-4" />
            Date {type === 'lost' ? 'Lost' : 'Found'}
          </label>
          <input
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <input
            required
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Library, Cafeteria"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <User className="h-4 w-4" />
            Your Contact Info
          </label>
          <input
            required
            name="posterContact"
            value={formData.posterContact}
            onChange={handleInputChange}
            placeholder="Email or Phone Number"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <Upload className="h-4 w-4" />
            Image Upload
          </label>
          <div className="relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-all hover:bg-zinc-100">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <div className="flex flex-col items-center text-zinc-400">
                <Upload className="mb-2 h-8 w-8" />
                <span className="text-sm">Click or drag to upload image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          `Post ${type === 'lost' ? 'Lost' : 'Found'} Item`
        )}
      </button>
    </form>
  );
}
