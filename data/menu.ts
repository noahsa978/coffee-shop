// Central café configuration
export const CAFE_CONFIG = {
  name: "Cake Eats",
  tagline: "Handcrafted Coffee & Artisan Bakehouse",
  heroSubtitle: "Freshly roasted specialty coffees, buttery laminated pastries, and layered cakes baked every morning.",
  currencySymbol: "$",
} as const;

export interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  tag: "New" | "Popular" | null;
  isFeatured: boolean;
}

// Neutral warm-toned base64 blur placeholder for next/image
// Displays instantly while images load, preventing layout shift and empty white flashes
export const WARM_PLACEHOLDER_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP49fkFAAXAAtZBXivhAAAAAElFTkSuQmCC";

export const mockCategories: Category[] = [
  { id: "coffee", name: "Coffee", displayOrder: 1 },
  { id: "cake", name: "Cake", displayOrder: 2 },
  { id: "pastries", name: "Pastries", displayOrder: 3 },
  { id: "tea", name: "Artisanal Tea", displayOrder: 4 },
  { id: "savory", name: "Savory Bites", displayOrder: 5 },
];

export const mockProducts: Product[] = [
  // COFFEE
  {
    id: "prod-c1",
    categoryId: "coffee",
    name: "Velvet Flat White",
    price: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: true,
  },
  {
    id: "prod-c2",
    categoryId: "coffee",
    name: "Caramel Sea Salt Cortado",
    price: 5.25,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: true,
  },
  {
    id: "prod-c3",
    categoryId: "coffee",
    name: "Brown Butter Vanilla Latte",
    price: 5.75,
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-c4",
    categoryId: "coffee",
    name: "Cold Brew Reserve",
    price: 4.95,
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-c5",
    categoryId: "coffee",
    name: "Single Origin Espresso",
    price: 3.85,
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-c6",
    categoryId: "coffee",
    name: "Cardamom Spiced Mocha",
    price: 6.15,
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    isAvailable: false, // Sold out demonstration
    tag: null,
    isFeatured: false,
  },

  // CAKE
  {
    id: "prod-k1",
    categoryId: "cake",
    name: "Basque Burnt Cheesecake",
    price: 7.50,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: true,
  },
  {
    id: "prod-k2",
    categoryId: "cake",
    name: "Honey Lavender Sponge",
    price: 6.95,
    imageUrl: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: true,
  },
  {
    id: "prod-k3",
    categoryId: "cake",
    name: "Dark Chocolate Truffle Torte",
    price: 7.85,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-k4",
    categoryId: "cake",
    name: "Pecan Carrot Cake Slice",
    price: 6.75,
    imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-k5",
    categoryId: "cake",
    name: "Meyer Lemon Raspberry Tart",
    price: 7.15,
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    isAvailable: false, // Sold out demonstration
    tag: null,
    isFeatured: false,
  },

  // PASTRIES
  {
    id: "prod-p1",
    categoryId: "pastries",
    name: "Brown Butter Flaky Croissant",
    price: 4.50,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: true,
  },
  {
    id: "prod-p2",
    categoryId: "pastries",
    name: "Valrhona Pain au Chocolat",
    price: 5.25,
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-p3",
    categoryId: "pastries",
    name: "Swedish Cardamom Morning Bun",
    price: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: true,
  },
  {
    id: "prod-p4",
    categoryId: "pastries",
    name: "Toasted Almond Frangipane",
    price: 5.45,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-p5",
    categoryId: "pastries",
    name: "Cinnamon Glazed Brioche",
    price: 4.75,
    imageUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
    isAvailable: false, // Sold out demonstration
    tag: null,
    isFeatured: false,
  },

  // ARTISANAL TEA
  {
    id: "prod-t1",
    categoryId: "tea",
    name: "Ceremonial Uji Matcha Latte",
    price: 5.85,
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-t2",
    categoryId: "tea",
    name: "Earl Grey Lavender Fog",
    price: 5.25,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: false,
  },
  {
    id: "prod-t3",
    categoryId: "tea",
    name: "Spiced Masala Chai Brew",
    price: 5.15,
    imageUrl: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-t4",
    categoryId: "tea",
    name: "Organic Chamomile Blossom",
    price: 4.25,
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },

  // SAVORY BITES
  {
    id: "prod-s1",
    categoryId: "savory",
    name: "Gruyère & Smoked Ham Croissant",
    price: 6.85,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-s2",
    categoryId: "savory",
    name: "Whipped Ricotta & Fig Toast",
    price: 7.25,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: false,
  },
  {
    id: "prod-s3",
    categoryId: "savory",
    name: "Sundried Tomato Herb Focaccia",
    price: 5.95,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: null,
    isFeatured: false,
  },
  {
    id: "prod-s4",
    categoryId: "savory",
    name: "Spinach & Aged Goat Cheese Danish",
    price: 5.75,
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
    isAvailable: false, // Sold out demonstration
    tag: null,
    isFeatured: false,
  },
];

// Slides come from a "featured items" array in the mock data
export const featuredProducts: Product[] = mockProducts.filter(
  (product) => product.isFeatured
);
