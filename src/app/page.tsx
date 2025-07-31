import Link from 'next/link';
import { ModelCard } from '@/components/model-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Model } from '@/lib/data';
import fs from 'fs/promises';
import path from 'path';

async function getModels(): Promise<Model[]> {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'models.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function Home() {
  const models = await getModels();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary">GlamHunt</h1>
        <p className="text-lg md:text-xl text-foreground/80 mt-4">Find Your Next Star. Discover and book top talent.</p>
      </header>
      
      <div className="bg-card/50 p-4 sm:p-6 rounded-lg shadow-lg mb-8 sticky top-16 z-10 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
             <label htmlFor="search" className="block text-sm font-medium text-foreground/80 mb-1">Search Models</label>
            <Input id="search" placeholder="Name, keyword..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-foreground/80 mb-1">Specialty</label>
            <Select>
              <SelectTrigger id="specialty">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="editorial">Editorial</SelectItem>
                <SelectItem value="sabyasachi">Sabyasachi</SelectItem>
                <SelectItem value="myntra">Myntra</SelectItem>
                <SelectItem value="manish-malhotra">Manish Malhotra</SelectItem>
                <SelectItem value="raymond">Raymond</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
             <label htmlFor="location" className="block text-sm font-medium text-foreground/80 mb-1">Location</label>
            <Select>
              <SelectTrigger id="location">
                <SelectValue placeholder="Any Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="jaipur">Jaipur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Apply Filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}
