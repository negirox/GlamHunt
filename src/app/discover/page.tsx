'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ModelCard } from '@/components/model-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Model } from '@/lib/data';
import fs from 'fs/promises';
import path from 'path';

// Fetch models on the client side using an API route or static import
async function fetchModels(): Promise<Model[]> {
  const res = await fetch('/models.json');
  return res.json();
}

export default function DiscoverPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);

  useEffect(() => {
    fetch('/models.json')
      .then(res => res.json())
      .then(data => {
        setModels(data);
        setFilteredModels(data);
      });
  }, []);

  const handleSearch = () => {
    let filtered = models;
    if (search) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (specialty && specialty !== "all") {
      filtered = filtered.filter(model =>
        model.specialties &&
        model.specialties.map(s => s.toLowerCase()).includes(specialty)
      );
    }
    setFilteredModels(filtered);
  };

  return (
    <>
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Discover Models</h1>
          <p className="text-lg text-muted-foreground mt-2">Find the perfect talent for your next project.</p>
          <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg mt-8 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative col-span-1 sm:col-span-2">
                 <label htmlFor="search" className="block text-sm font-medium text-foreground/80 mb-1 text-left">Search Models</label>
                <Input
                  id="search"
                  placeholder="Name, keyword..."
                  className="pl-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-[-6px] h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-foreground/80 mb-1 text-left">Specialty</label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full h-10" onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 xl:gap-8">
          {filteredModels.map((model) => (
            <div key={model.id} className="mb-6 break-inside-avoid">
              <ModelCard model={model} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
