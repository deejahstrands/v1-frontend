export interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface Order {
  orderId: string;
  product: string;
  total: string;
  status: 'Completed' | 'Processing' | 'Cancelled';
  date: string;
}

export interface WishlistItem {
  product: string;
  category: string;
  status: 'In Stock' | 'Out of Stock';
  date: string;
}

export interface Consultation {
  id: string;
  date: string;
  type: 'In Studio' | 'Home Visit';
  notes: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: string;
  lastOrder: string;
  consultation: 'Yes' | 'No';
  consultations: Consultation[];
  addresses: Address[];
  orders: Order[];
  wishlist: WishlistItem[];
  firstName: string;
  lastName: string;
  image: string;
  isAuthenticated: boolean;
  hasPurchased: boolean;
  purchases: { productId: string; date: string }[];
}

export const users: User[] = [
  {
    id: '1',
    name: 'Collins Jacob',
    email: 'CollinsJacob@gmail.com',
    phone: '08180161116',
    totalOrders: 1,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'Yes',
    consultations: [
      {
        id: '1',
        date: "01 May '25",
        type: 'In Studio',
        notes: "Needs 14\" curly",
        status: 'Completed'
      },
      {
        id: '2',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Upcoming'
      },
      {
        id: '3',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Cancelled'
      }
    ],
    addresses: [
      {
        id: '1',
        label: 'Home',
        address: '23A Lekki Phase 1, Lagos',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: '#2341',
        product: '14" Bob Wig',
        total: '₦65,000',
        status: 'Completed',
        date: "01 May '25"
      }
    ],
    wishlist: [
      {
        product: '14" Bob Wig',
        category: 'Wigs / Curly',
        status: 'In Stock',
        date: "01 May '25"
      }
    ],
    firstName: 'Reiley',
    lastName: 'Evans',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    isAuthenticated: true,
    hasPurchased: true,
    purchases: [
      { productId: "1", date: "2024-07-01" },
      { productId: "2", date: "2024-07-02" }
    ],
  },
  {
    id: '2',
    name: 'Sunday Lucky',
    email: 'Sundaylucky@gmail.com',
    phone: '08180161116',
    totalOrders: 0,
    totalSpend: '₦4,009,284',
    lastOrder: '--',
    consultation: 'No',
    consultations: [],
    addresses: [],
    orders: [],
    wishlist: [],
    firstName: 'Funmi',
    lastName: 'L.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    isAuthenticated: false,
    hasPurchased: false,
    purchases: [],
  },
  {
    id: '3',
    name: 'Roland Tony',
    email: 'amarachi@example.com',
    phone: '08180161116',
    totalOrders: 3,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'Yes',
    consultations: [
      {
        id: '1',
        date: "01 May '25",
        type: 'In Studio',
        notes: "Needs 14\" curly",
        status: 'Completed'
      },
      {
        id: '2',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Upcoming'
      },
      {
        id: '3',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Cancelled'
      },  
      {
        id: '4',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Cancelled'
      },
      {
        id: '5',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Cancelled'
      },
      {
        id: '6',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Cancelled'
      },
      {
        id: '7',
        date: "01 May '25",
        type: 'Home Visit',
        notes: "Looking for frontal",
        status: 'Cancelled'
      }
    ],
    addresses: [
      {
        id: '2',
        label: 'Home',
        address: '23A Lekki Phase 1, Lagos',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: '#2341',
        product: '14" Bob Wig',
        total: '₦65,000',
        status: 'Completed',
        date: "01 May '25"
      },
      {
        orderId: '#32876',
        product: 'Raw Tape-In Bundle',
        total: '₦65,000',
        status: 'Processing',
        date: "01 May '25"
      },
      {
        orderId: '#99822',
        product: '22" HD Lace Wig (Curly)',
        total: '₦65,000',
        status: 'Completed',
        date: "01 May '25"
      }
    ],
    wishlist: [
      {
        product: '14" Bob Wig',
        category: 'Wigs / Curly',
        status: 'In Stock',
        date: "01 May '25"
      },
      {
        product: 'Raw Tape-In Bundle',
        category: 'Closure',
        status: 'Out of Stock',
        date: "01 May '25"
      }
    ],
    firstName: 'Roland',
    lastName: 'Tony',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    isAuthenticated: true,
    hasPurchased: true,
    purchases: [],
  },
  {
    id: '4',
    name: 'Princess Divine',
    email: 'princessdivine@gmail.com',
    phone: '08180161116',
    totalOrders: 2,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'Yes',
    consultations: [],
    addresses: [
      {
        id: '3',
        label: 'Home',
        address: '15B Victoria Island, Lagos',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: '#2342',
        product: '18" Straight Wig',
        total: '₦75,000',
        status: 'Completed',
        date: "01 May '25"
      },
      {
        orderId: '#2343',
        product: 'Closure Bundle',
        total: '₦85,000',
        status: 'Processing',
        date: "01 May '25"
      }
    ],
    wishlist: [],
    firstName: 'Princess',
    lastName: 'Divine',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    isAuthenticated: true,
    hasPurchased: true,
    purchases: [],
  },
  {
    id: '5',
    name: 'Queen Ini',
    email: 'queenini@gmail.com',
    phone: '08180161116',
    totalOrders: 3,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'Yes',
    consultations: [],
    addresses: [
      {
        id: '4',
        label: 'Home',
        address: '7A Ikeja GRA, Lagos',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: '#2344',
        product: '20" Wavy Wig',
        total: '₦95,000',
        status: 'Completed',
        date: "01 May '25"
      }
    ],
    wishlist: [
      {
        product: 'Tape-In Extensions',
        category: 'Extensions',
        status: 'In Stock',
        date: "01 May '25"
      }
    ],
    firstName: 'Queen',
    lastName: 'Ini',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    isAuthenticated: true,
    hasPurchased: true,
    purchases: [],
  },
  {
    id: '6',
    name: 'Erna Esema',
    email: 'ernaesema@gmail.com',
    phone: '08180161116',
    totalOrders: 4,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'Yes',
    consultations: [],
    addresses: [
      {
        id: '5',
        label: 'Home',
        address: '25C Ajah, Lagos',
        isDefault: true
      }
    ],
    orders: [],
    wishlist: [],
    firstName: 'Erna',
    lastName: 'Esema',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    isAuthenticated: true,
    hasPurchased: true,
    purchases: [],
  },
  {
    id: '7',
    name: 'Abdullahi Yusuff',
    email: 'abdullahiyusuff@gmail.com',
    phone: '08180161116',
    totalOrders: 10,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'No',
    consultations: [],
    addresses: [],
    orders: [],
    wishlist: [],
    firstName: 'Abdullahi',
    lastName: 'Yusuff',
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
    isAuthenticated: false,
    hasPurchased: false,
    purchases: [],
  },
  {
    id: '8',
    name: 'Kate Ahurika',
    email: 'kateahurika@gmail.com',
    phone: '08180161116',
    totalOrders: 6,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'Yes',
    consultations: [],
    addresses: [],
    orders: [],
    wishlist: [],
    firstName: 'Kate',
    lastName: 'Ahurika',
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
    isAuthenticated: true,
    hasPurchased: true,
    purchases: [],
  },
  {
    id: '9',
    name: 'Rebecca Eze',
    email: 'rebeccaeze@gmail.com',
    phone: '08180161116',
    totalOrders: 10,
    totalSpend: '₦4,009,284',
    lastOrder: "01 May '25",
    consultation: 'No',
    consultations: [],
    addresses: [],
    orders: [],
    wishlist: [],
    firstName: 'Rebecca',
    lastName: 'Eze',
    image: 'https://randomuser.me/api/portraits/women/9.jpg',
    isAuthenticated: false,
    hasPurchased: false,
    purchases: [],
  }
]; 