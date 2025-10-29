export interface CustomizationOption {
  label: string;
  price?: number;
}

export interface CustomizationType {
  type: string;
  options: CustomizationOption[];
}

export interface WigType {
  id: string;
  name: string;
  basePrice: number;
  customizations: CustomizationType[];
}

export const wigTypes: WigType[] = [
  {
    id: 'straight',
    name: 'Straight',
    basePrice: 50000,
    customizations: [
      {
        type: 'Length',
        options: [
          { label: '12 inches', price: 0 },
          { label: '14 inches', price: 5000 },
          { label: '16 inches', price: 10000 },
          { label: '18 inches', price: 15000 },
          { label: '20 inches', price: 20000 },
          { label: '22 inches', price: 25000 },
        ]
      },
      {
        type: 'Color',
        options: [
          { label: 'Natural Black', price: 0 },
          { label: 'Dark Brown', price: 3000 },
          { label: 'Medium Brown', price: 5000 },
          { label: 'Light Brown', price: 7000 },
          { label: 'Blonde', price: 10000 },
          { label: 'Red', price: 8000 },
        ]
      },
      {
        type: 'Density',
        options: [
          { label: '130%', price: 0 },
          { label: '150%', price: 5000 },
          { label: '180%', price: 10000 },
          { label: '200%', price: 15000 },
        ]
      },
      {
        type: 'Lace Type',
        options: [
          { label: 'Swiss Lace', price: 0 },
          { label: 'French Lace', price: 3000 },
          { label: 'HD Lace', price: 8000 },
        ]
      },
      {
        type: 'Cap Size',
        options: [
          { label: 'Small (21.5")', price: 0 },
          { label: 'Medium (22.5")', price: 2000 },
          { label: 'Large (23.5")', price: 4000 },
        ]
      },
      {
        type: 'Parting',
        options: [
          { label: 'Middle Part', price: 0 },
          { label: 'Side Part', price: 2000 },
          { label: 'Freestyle', price: 5000 },
        ]
      },
      {
        type: 'Lace Cut',
        options: [
          { label: 'Pre-cut', price: 0 },
          { label: 'Custom Cut', price: 3000 },
        ]
      }
    ]
  },
  {
    id: 'wavy',
    name: 'Wavy',
    basePrice: 20000,
    customizations: [
      {
        type: 'Length',
        options: [
          { label: '12 inches', price: 0 },
          { label: '14 inches', price: 5000 },
          { label: '16 inches', price: 10000 },
          { label: '18 inches', price: 15000 },
          { label: '20 inches', price: 20000 },
        ]
      },
      {
        type: 'Color',
        options: [
          { label: 'Natural Black', price: 0 },
          { label: 'Dark Brown', price: 3000 },
          { label: 'Medium Brown', price: 5000 },
          { label: 'Light Brown', price: 7000 },
          { label: 'Blonde', price: 10000 },
        ]
      },
      {
        type: 'Density',
        options: [
          { label: '130%', price: 0 },
          { label: '150%', price: 5000 },
          { label: '180%', price: 10000 },
        ]
      },
      {
        type: 'Wave Pattern',
        options: [
          { label: 'Light Wave', price: 0 },
          { label: 'Medium Wave', price: 3000 },
          { label: 'Deep Wave', price: 6000 },
        ]
      },
      {
        type: 'Lace Type',
        options: [
          { label: 'Swiss Lace', price: 0 },
          { label: 'French Lace', price: 3000 },
          { label: 'HD Lace', price: 8000 },
        ]
      },
      {
        type: 'Cap Size',
        options: [
          { label: 'Small (21.5")', price: 0 },
          { label: 'Medium (22.5")', price: 2000 },
          { label: 'Large (23.5")', price: 4000 },
        ]
      }
    ]
  },
  {
    id: 'bouncy',
    name: 'Bouncy',
    basePrice: 35000,
    customizations: [
      {
        type: 'Length',
        options: [
          { label: '12 inches', price: 0 },
          { label: '14 inches', price: 5000 },
          { label: '16 inches', price: 10000 },
          { label: '18 inches', price: 15000 },
        ]
      },
      {
        type: 'Color',
        options: [
          { label: 'Natural Black', price: 0 },
          { label: 'Dark Brown', price: 3000 },
          { label: 'Medium Brown', price: 5000 },
          { label: 'Light Brown', price: 7000 },
        ]
      },
      {
        type: 'Density',
        options: [
          { label: '130%', price: 0 },
          { label: '150%', price: 5000 },
          { label: '180%', price: 10000 },
          { label: '200%', price: 15000 },
        ]
      },
      {
        type: 'Bounce Level',
        options: [
          { label: 'Light Bounce', price: 0 },
          { label: 'Medium Bounce', price: 4000 },
          { label: 'High Bounce', price: 8000 },
        ]
      },
      {
        type: 'Lace Type',
        options: [
          { label: 'Swiss Lace', price: 0 },
          { label: 'French Lace', price: 3000 },
          { label: 'HD Lace', price: 8000 },
        ]
      },
      {
        type: 'Cap Size',
        options: [
          { label: 'Small (21.5")', price: 0 },
          { label: 'Medium (22.5")', price: 2000 },
          { label: 'Large (23.5")', price: 4000 },
        ]
      }
    ]
  },
  {
    id: 'curly',
    name: 'Curly',
    basePrice: 45000,
    customizations: [
      {
        type: 'Length',
        options: [
          { label: '12 inches', price: 0 },
          { label: '14 inches', price: 5000 },
          { label: '16 inches', price: 10000 },
          { label: '18 inches', price: 15000 },
          { label: '20 inches', price: 20000 },
        ]
      },
      {
        type: 'Color',
        options: [
          { label: 'Natural Black', price: 0 },
          { label: 'Dark Brown', price: 3000 },
          { label: 'Medium Brown', price: 5000 },
          { label: 'Light Brown', price: 7000 },
          { label: 'Blonde', price: 10000 },
        ]
      },
      {
        type: 'Density',
        options: [
          { label: '130%', price: 0 },
          { label: '150%', price: 5000 },
          { label: '180%', price: 10000 },
          { label: '200%', price: 15000 },
        ]
      },
      {
        type: 'Curl Pattern',
        options: [
          { label: 'Loose Curls', price: 0 },
          { label: 'Medium Curls', price: 5000 },
          { label: 'Tight Curls', price: 10000 },
          { label: 'Coily', price: 15000 },
        ]
      },
      {
        type: 'Lace Type',
        options: [
          { label: 'Swiss Lace', price: 0 },
          { label: 'French Lace', price: 3000 },
          { label: 'HD Lace', price: 8000 },
        ]
      },
      {
        type: 'Cap Size',
        options: [
          { label: 'Small (21.5")', price: 0 },
          { label: 'Medium (22.5")', price: 2000 },
          { label: 'Large (23.5")', price: 4000 },
        ]
      }
    ]
  }
]; 