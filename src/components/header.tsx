'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Camera, Menu, X, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Discover' },
  { href: '/profile', label: 'Profile' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <Camera className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold">GlamHunt</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild>
            <Link href="/auth/register"><UserPlus className="mr-2" /> Register as Model</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className={cn('fixed inset-0 top-16 z-40 grid grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden')}>
            <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                 {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline" onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2">
                   <Button asChild>
                     <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}><UserPlus className="mr-2" /> Register as Model</Link>
                   </Button>
                </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
