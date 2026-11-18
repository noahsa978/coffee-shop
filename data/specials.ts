export interface SpecialItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80";

export const specials: SpecialItem[] = [
  {
    id: "special-1",
    name: "Velvet Flat White",
    tag: "Signature Blend",
    description: "Double ristretto poured with micro-foamed organic whole milk and subtle hazelnut notes.",
    price: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-2",
    name: "Burnt Honey Basque Cheesecake",
    tag: "House Favorite",
    description: "Caramelized crust with an ultra-creamy, custard-like center infused with wild thyme honey.",
    price: 6.95,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-3",
    name: "Caramel Sea Salt Cortado",
    tag: "New Arrival",
    description: "Equal parts espresso and textured milk, balanced with fleur de sel and house-made caramel drizzle.",
    price: 5.25,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-4",
    name: "Pistachio Rose Brioche Knot",
    tag: "Fresh Baked",
    description: "Slow-proved braided brioche layered with toasted Iranian pistachios and organic rosewater syrup.",
    price: 5.45,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-5",
    name: "Valrhona Triple Chocolate Fudge Cake",
    tag: "Decadent",
    description: "Three layers of dark chocolate sponge enveloped in 70% Guanaja chocolate ganache.",
    price: 7.50,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-6",
    name: "Wild Lavender Honey Latte",
    tag: "Seasonal",
    description: "Single-origin espresso paired with organic French culinary lavender syrup and clover honey.",
    price: 5.65,
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-7",
    name: "Almond Frangipane Croissant",
    tag: "Chef's Special",
    description: "Twice-baked butter croissant generously filled with almond cream and capped with toasted flaked almonds.",
    price: 5.20,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "special-8",
    name: "Smoked Salmon & Herbed Boursin Brioche",
    tag: "Savory Pick",
    description: "Cold-smoked Norwegian salmon, whipped garlic-herb cream cheese, and pickled capers on toasted brioche.",
    price: 9.85,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1920&q=80",
  },
];
