import Link from 'next/link';
import Image from 'next/image';
import type { Model } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/models/${model.id}`} className="group block w-full">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:shadow-2xl border-transparent group-hover:border-primary/50 relative">
        <Image
          src={model.profileImage}
          alt={`Portfolio image of ${model.name}`}
          width={400}
          height={600}
          className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="fashion portrait"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-headline text-xl font-bold truncate">{model.name}</h3>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{model.location}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
