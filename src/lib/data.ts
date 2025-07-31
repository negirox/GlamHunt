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
