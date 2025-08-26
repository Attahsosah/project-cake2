export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'chocolate',
    name: 'Chocolate Cakes',
    emoji: '🍫',
    description: 'Rich and decadent chocolate cakes'
  },
  {
    id: 'vanilla',
    name: 'Vanilla & Classic',
    emoji: '🍰',
    description: 'Traditional and classic cakes'
  },
  {
    id: 'fruit',
    name: 'Fruit Cakes',
    emoji: '🍓',
    description: 'Fresh and fruity cakes'
  },
  {
    id: 'cheesecake',
    name: 'Cheesecakes',
    emoji: '🧀',
    description: 'Creamy and smooth cheesecakes'
  },
  {
    id: 'layer',
    name: 'Layer Cakes',
    emoji: '🎂',
    description: 'Multi-layered and fancy cakes'
  },
  {
    id: 'specialty',
    name: 'Specialty Cakes',
    emoji: '⭐',
    description: 'Unique and special cakes'
  },
  {
    id: 'cupcakes',
    name: 'Cupcakes',
    emoji: '🧁',
    description: 'Individual sized cakes'
  },
  {
    id: 'mousse',
    name: 'Mousse Cakes',
    emoji: '☁️',
    description: 'Light and airy mousse cakes'
  },
  {
    id: 'international',
    name: 'International',
    emoji: '🌍',
    description: 'Cakes from around the world'
  },
  {
    id: 'seasonal',
    name: 'Seasonal & Holiday',
    emoji: '🎄',
    description: 'Holiday and seasonal cakes'
  },
  {
    id: 'pies',
    name: 'Pies & Tarts',
    emoji: '🥧',
    description: 'Delicious pies and tarts'
  },
  {
    id: 'other',
    name: 'Other',
    emoji: '🍪',
    description: 'Other delicious desserts'
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryName = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.name : 'Other';
};

export const getCategoryEmoji = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.emoji : '🍪';
};
