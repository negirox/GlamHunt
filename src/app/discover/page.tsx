'use client';

import { useState, useEffect } from 'react';
import { ModelCard } from '@/components/model-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import type { Model } from '@/lib/data';

export default function DiscoverPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/models.json');
        const data = await res.json();
        setModels(data);
        setFilteredModels(data);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);
  
  const handleSearch = () => {
    let tempModels = [...models];

    // Filter by specialty
    if (specialty !== 'all') {
      tempModels = tempModels.filter(model => 
        model.specialties.some(s => s.toLowerCase() === specialty.toLowerCase())
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      tempModels = tempModels.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredModels(tempModels);
  };
  
  // Handle search on button click or enter key
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const allSpecialties = [...new Set(models.flatMap(m => m.specialties))];

  return (
    <>
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Discover Models</h1>
          <p className="text-lg text-muted-foreground mt-2">Find the perfect talent for your next project.</p>
          <form onSubmit={onSearchSubmit} className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg mt-8 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative col-span-1 sm:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-foreground/80 mb-1 text-left">Search Models</label>
                <Input 
                  id="search" 
                  placeholder="Name, keyword..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <SelectItem value="all">All Specialties</SelectItem>
                    {allSpecialties.map(spec => (
                        <SelectItem key={spec} value={spec.toLowerCase()}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-10">Search</Button>
            </div>
          </form>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        ) : filteredModels.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 xl:gap-8">
            {filteredModels.map((model) => (
              <div key={model.id} className="mb-6 break-inside-avoid">
                <ModelCard model={model} />
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">No Models Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your search filters to find more results.</p>
            </div>
        )}
      </main>
    </>
  );
}
