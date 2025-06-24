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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: string;
  lastOrder: string;
  consultation: 'Yes' | 'No';
  addresses: Address[];
  orders: Order[];
  wishlist: WishlistItem[];
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
    ]
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
    addresses: [],
    orders: [],
    wishlist: []
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
    ]
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
    wishlist: []
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
    ]
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
    addresses: [
      {
        id: '5',
        label: 'Home',
        address: '25C Ajah, Lagos',
        isDefault: true
      }
    ],
    orders: [],
    wishlist: []
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
    addresses: [],
    orders: [],
    wishlist: []
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
    addresses: [],
    orders: [],
    wishlist: []
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
    addresses: [],
    orders: [],
    wishlist: []
  }
]; 