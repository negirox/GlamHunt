export type Model = {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  bio: string;
  stats: {
    height: string;
    bust: number;
    waist: number;
    hips: number;
    shoe: number;
    eyes: string;
    hair: string;
  };
  profileImage: string;
  images: { url: string, hint: string }[];
};

export const models: Model[] = [
  {
    id: '1',
    name: 'Elara Vance',
    location: 'New York, USA',
    specialties: ['Fashion', 'Editorial'],
    bio: "Elara is a versatile fashion model with a striking presence, known for her captivating editorial shoots and runway walks. With 5 years of experience, she brings professionalism and a unique artistic flair to every project.",
    stats: {
      height: "5'11\"",
      bust: 32,
      waist: 24,
      hips: 35,
      shoe: 9,
      eyes: 'Blue',
      hair: 'Blonde',
    },
    profileImage: 'https://placehold.co/400x600.png',
    images: [
      { url: 'https://placehold.co/600x800.png', hint: 'fashion editorial' },
      { url: 'https://placehold.co/600x800.png', hint: 'studio portrait' },
      { url: 'https://placehold.co/800x600.png', hint: 'urban fashion' },
      { url: 'https://placehold.co/600x800.png', hint: 'beauty shot' },
      { url: 'https://placehold.co/800x600.png', hint: 'runway fashion' },
      { url: 'https://placehold.co/600x800.png', hint: 'avant garde' },
    ],
  },
  {
    id: '2',
    name: 'Jaxson Cole',
    location: 'Los Angeles, USA',
    specialties: ['Commercial', 'Fitness'],
    bio: "Jaxson's athletic build and approachable look make him a favorite for commercial and fitness campaigns. He's dedicated, energetic, and passionate about promoting a healthy lifestyle through his work.",
    stats: {
      height: "6'2\"",
      bust: 40,
      waist: 32,
      hips: 38,
      shoe: 11,
      eyes: 'Brown',
      hair: 'Brown',
    },
    profileImage: 'https://placehold.co/400x600.png',
    images: [
      { url: 'https://placehold.co/600x800.png', hint: 'fitness workout' },
      { url: 'https://placehold.co/800x600.png', hint: 'lifestyle commercial' },
      { url: 'https://placehold.co/600x800.png', hint: 'activewear catalogue' },
      { url: 'https://placehold.co/600x800.png', hint: 'male portrait' },
      { url: 'https://placehold.co/800x600.png', hint: 'sports action' },
      { url: 'https://placehold.co/600x800.png', hint: 'casual fashion' },
    ],
  },
  {
    id: '3',
    name: 'Seraphina Moon',
    location: 'Paris, France',
    specialties: ['Haute Couture', 'Avant-Garde'],
    bio: "With an ethereal and unique look, Seraphina is a rising star in the haute couture world. She thrives in creative, avant-garde projects and has walked for several major designers in Paris Fashion Week.",
    stats: {
      height: "5'10\"",
      bust: 31,
      waist: 23,
      hips: 34,
      shoe: 8.5,
      eyes: 'Green',
      hair: 'Red',
    },
    profileImage: 'https://placehold.co/400x600.png',
    images: [
      { url: 'https://placehold.co/600x800.png', hint: 'haute couture' },
      { url: 'https://placehold.co/800x600.png', hint: 'fantasy photoshoot' },
      { url: 'https://placehold.co/600x800.png', hint: 'dramatic makeup' },
      { url: 'https://placehold.co/600x800.png', hint: 'elegant gown' },
      { url: 'https://placehold.co/800x600.png', hint: 'conceptual art' },
      { url: 'https://placehold.co/600x800.png', hint: 'profile shot' },
    ],
  },
  {
    id: '4',
    name: 'Kenji Tanaka',
    location: 'Milan, Italy',
    specialties: ['Runway', 'Luxury Brands'],
    bio: "Kenji's sharp features and powerful walk have made him a sought-after runway model in Milan. He has a keen eye for fashion and has collaborated with some of the world's most prestigious luxury brands.",
    stats: {
      height: "6'1\"",
      bust: 38,
      waist: 30,
      hips: 36,
      shoe: 10,
      eyes: 'Dark Brown',
      hair: 'Black',
    },
    profileImage: 'https://placehold.co/400x600.png',
    images: [
      { url: 'https://placehold.co/600x800.png', hint: 'mens suit' },
      { url: 'https://placehold.co/800x600.png', hint: 'luxury watch' },
      { url: 'https://placehold.co/600x800.png', hint: 'street style' },
      { url: 'https://placehold.co/600x800.png', hint: 'monochrome portrait' },
      { url: 'https://placehold.co/800x600.png', hint: 'fashion week' },
      { url: 'https://placehold.co/600x800.png', hint: 'high fashion' },
    ],
  },
];
