/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ItemsPage } from './pages/ItemsPage';
import { ItemForm } from './components/ItemForm';
import { ItemDetail } from './pages/ItemDetail';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lost" element={<ItemsPage type="lost" />} />
            <Route path="/found" element={<ItemsPage type="found" />} />
            <Route path="/post-lost" element={<div className="py-12"><ItemForm type="lost" /></div>} />
            <Route path="/post-found" element={<div className="py-12"><ItemForm type="found" /></div>} />
            <Route path="/item/:id" element={<ItemDetail />} />
          </Routes>
        </main>
        
        <footer className="border-t border-black/5 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Campus Lost & Found Management System. Built for students, by students.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
