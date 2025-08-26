import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
const mockOptions = [
  {
    id: 'a330e262-30dc-4aab-8193-9685efb096bb',
    name: 'Axios Effective',
    description: 'optional description here',
    customizationType: {
      id: 'e980d5b5-c190-4bf5-b706-9db9b1353480',
      name: 'Lace Type'
    },
    assignedProducts: 1,
    status: 'active',
    createdAt: '2025-07-28T01:33:08.941Z',
    updatedAt: '2025-08-14T13:20:48.345Z',
    deletedAt: null
  },
  {
    id: '0caf0312-eaa3-4502-ab81-8f077c6d2878',
    name: 'Coduet elastica',
    description: 'optional description here',
    customizationType: {
      id: 'e980d5b5-c190-4bf5-b706-9db9b1353480',
      name: 'Lace Type'
    },
    assignedProducts: 3,
    status: 'active',
    createdAt: '2025-07-28T01:33:08.941Z',
    updatedAt: '2025-08-14T13:21:03.596Z',
    deletedAt: null
  },
  {
    id: '511b834d-9a58-46e5-8f51-f51c94be8974',
    name: 'Burgundy',
    description: 'optional description here',
    customizationType: {
      id: 'e980d5b5-c190-4bf5-b706-9db9b1353480',
      name: 'Lace Type'
    },
    assignedProducts: 8,
    status: 'active',
    createdAt: '2025-07-12T05:07:05.406Z',
    updatedAt: '2025-07-23T20:04:53.900Z',
    deletedAt: null
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const typeId = searchParams.get('typeId') || '';

    let filteredOptions = [...mockOptions];

    // Apply search filter
    if (search) {
      filteredOptions = filteredOptions.filter(option =>
        option.name.toLowerCase().includes(search.toLowerCase()) ||
        option.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filteredOptions = filteredOptions.filter(option => option.status === status);
    }

    // Apply type filter
    if (typeId) {
      filteredOptions = filteredOptions.filter(option => option.customizationType.id === typeId);
    }

    // Apply pagination
    let paginatedOptions = filteredOptions;
    const totalItems = filteredOptions.length;
    let totalPages = 1;

    if (limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      paginatedOptions = filteredOptions.slice(startIndex, endIndex);
      totalPages = Math.ceil(totalItems / limit);
    }

    const meta = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json({
      message: 'All customization options fetched successfully',
      data: paginatedOptions,
      meta
    });
  } catch (error) {
    console.error('Error fetching customization options:', error);
    return NextResponse.json(
      { message: 'Failed to fetch customization options' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, typeId, status } = body;

    // Validation
    if (!name || !typeId || !status) {
      return NextResponse.json(
        { message: 'Name, typeId, and status are required' },
        { status: 400 }
      );
    }

    // Validate status enum
    if (!['active', 'hidden'].includes(status)) {
      return NextResponse.json(
        { message: 'Status must be either "active" or "hidden"' },
        { status: 400 }
      );
    }

    // Create new option
    const newOption = {
      id: crypto.randomUUID(),
      name,
      description: description || '',
      customizationType: {
        id: typeId,
        name: 'Lace Type' // This would come from the types API in real implementation
      },
      assignedProducts: 0,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    mockOptions.push(newOption);

    return NextResponse.json({
      message: 'Customization option created successfully',
      option: newOption
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customization option:', error);
    return NextResponse.json(
      { message: 'Failed to create customization option' },
      { status: 500 }
    );
  }
}
