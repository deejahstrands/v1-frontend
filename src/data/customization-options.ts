export interface CustomizationOption {
  id: string;
  name: string;
  description?: string;
  customizationTypeId: string;
  customizationTypeName: string;
  status: 'active' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

export const customizationOptions: CustomizationOption[] = [
  // Lace Type Options
  {
    id: '1',
    name: 'HD Lace',
    description: 'High definition lace for natural look',
    customizationTypeId: '1',
    customizationTypeName: 'Lace Type',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Swiss Lace',
    description: 'Premium Swiss lace material',
    customizationTypeId: '1',
    customizationTypeName: 'Lace Type',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'French Lace',
    description: 'Classic French lace style',
    customizationTypeId: '1',
    customizationTypeName: 'Lace Type',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },

  // Color Options
  {
    id: '4',
    name: 'Natural Black',
    description: 'Classic natural black color',
    customizationTypeId: '2',
    customizationTypeName: 'Color',
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'Dark Brown',
    description: 'Rich dark brown shade',
    customizationTypeId: '2',
    customizationTypeName: 'Color',
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '6',
    name: 'Blonde',
    description: 'Light blonde color',
    customizationTypeId: '2',
    customizationTypeName: 'Color',
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '7',
    name: 'Burgundy',
    description: 'Deep burgundy red',
    customizationTypeId: '2',
    customizationTypeName: 'Color',
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },

  // Density Options
  {
    id: '8',
    name: 'Light',
    description: 'Light hair density',
    customizationTypeId: '3',
    customizationTypeName: 'Density',
    status: 'active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '9',
    name: 'Medium',
    description: 'Medium hair density',
    customizationTypeId: '3',
    customizationTypeName: 'Density',
    status: 'active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '10',
    name: 'Heavy',
    description: 'Heavy hair density',
    customizationTypeId: '3',
    customizationTypeName: 'Density',
    status: 'active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  },

  // Length Options
  {
    id: '11',
    name: 'Short (12-14 inches)',
    description: 'Short hair length',
    customizationTypeId: '4',
    customizationTypeName: 'Length',
    status: 'active',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '12',
    name: 'Medium (16-18 inches)',
    description: 'Medium hair length',
    customizationTypeId: '4',
    customizationTypeName: 'Length',
    status: 'active',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '13',
    name: 'Long (20-22 inches)',
    description: 'Long hair length',
    customizationTypeId: '4',
    customizationTypeName: 'Length',
    status: 'active',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '14',
    name: 'Extra Long (24-26 inches)',
    description: 'Extra long hair length',
    customizationTypeId: '4',
    customizationTypeName: 'Length',
    status: 'active',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },

  // Texture Options
  {
    id: '15',
    name: 'Straight',
    description: 'Straight hair texture',
    customizationTypeId: '5',
    customizationTypeName: 'Texture',
    status: 'active',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '16',
    name: 'Wavy',
    description: 'Wavy hair texture',
    customizationTypeId: '5',
    customizationTypeName: 'Texture',
    status: 'active',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '17',
    name: 'Curly',
    description: 'Curly hair texture',
    customizationTypeId: '5',
    customizationTypeName: 'Texture',
    status: 'active',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];
