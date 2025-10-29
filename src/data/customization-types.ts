export interface CustomizationType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const customizationTypes: CustomizationType[] = [
  {
    id: '1',
    name: 'Lace Type',
    description: 'Different types of lace for wigs',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Color',
    description: 'Hair color variations',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Density',
    description: 'Hair density options',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Length',
    description: 'Hair length variations',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'Texture',
    description: 'Hair texture options',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];
