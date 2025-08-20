export interface AdminCategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  description?: string;
}

export const adminCategories: AdminCategory[] = [
  {
    id: '1',
    name: 'Bundles',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709605/21_a4hxqz.jpg',
    productCount: 12,
    status: 'Active',
    dateAdded: '01 May \'25',
    description: 'High-quality hair bundles for various styles'
  },
  {
    id: '2',
    name: 'Wigs',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709582/03_r5ltmy.png',
    productCount: 11,
    status: 'Active',
    dateAdded: '01 May \'25',
    description: 'Premium wigs in different lengths and styles'
  },
  {
    id: '3',
    name: 'Straight Hairs',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709582/20_wrxtjv.png',
    productCount: 5,
    status: 'Inactive',
    dateAdded: '01 May \'25',
    description: 'Straight hair extensions and weaves'
  },
  {
    id: '4',
    name: 'Closure',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709580/01_uvmgft.png',
    productCount: 15,
    status: 'Active',
    dateAdded: '01 May \'25',
    description: 'Hair closures for natural-looking finishes'
  },
  {
    id: '5',
    name: 'Frontal',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709577/02_h27ya4.png',
    productCount: 8,
    status: 'Active',
    dateAdded: '01 May \'25',
    description: 'Hair frontals for versatile styling'
  },
  {
    id: '6',
    name: 'Curly Hair',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709757/16_gappbe.jpg',
    productCount: 7,
    status: 'Active',
    dateAdded: '01 May \'25',
    description: 'Curly and wavy hair extensions'
  },
  {
    id: '7',
    name: 'Synthetic Hair',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709580/01_uvmgft.png',
    productCount: 9,
    status: 'Active',
    dateAdded: '30 Apr \'25',
    description: 'Affordable synthetic hair options'
  },
  {
    id: '8',
    name: 'Accessories',
    image: 'https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709577/02_h27ya4.png',
    productCount: 3,
    status: 'Inactive',
    dateAdded: '29 Apr \'25',
    description: 'Hair care and styling accessories'
  }
];
