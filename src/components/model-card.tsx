import Link from 'next/link';
import Image from 'next/image';
import type { Model } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/models/${model.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:shadow-2xl group-hover:border-primary/50 group-hover:-translate-y-2">
        <CardHeader className="p-0">
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={model.profileImage}
              alt={`Portfolio image of ${model.name}`}
              width={400}
              height={600}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="fashion portrait"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-xl mb-2 truncate">{model.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{model.location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {model.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="bg-secondary/20 text-secondary border-secondary/50">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
