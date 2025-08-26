import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration (this would be imported from a shared file in real implementation)
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { optionId: string } }
) {
  try {
    const { optionId } = params;
    const body = await request.json();
    const { name, description, typeId, status } = body;

    // Validation
    if (!optionId) {
      return NextResponse.json(
        { message: 'Option ID is required' },
        { status: 400 }
      );
    }

    // Check if at least one field is provided
    if (!name && !description && !typeId && !status) {
      return NextResponse.json(
        { message: 'At least one field must be provided for update' },
        { status: 400 }
      );
    }

    // Find the option to update
    const optionIndex = mockOptions.findIndex(option => option.id === optionId);
    if (optionIndex === -1) {
      return NextResponse.json(
        { message: 'Customization option not found' },
        { status: 404 }
      );
    }

    // Update only the provided fields
    if (name !== undefined) mockOptions[optionIndex].name = name;
    if (description !== undefined) mockOptions[optionIndex].description = description;
    if (status !== undefined) {
      if (!['active', 'hidden'].includes(status)) {
        return NextResponse.json(
          { message: 'Status must be either "active" or "hidden"' },
          { status: 400 }
        );
      }
      mockOptions[optionIndex].status = status;
    }
    if (typeId !== undefined) {
      mockOptions[optionIndex].customizationType = {
        id: typeId,
        name: 'Lace Type' // This would come from the types API in real implementation
      };
    }

    // Update timestamp
    mockOptions[optionIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({
      message: 'Customization option updated successfully'
    });
  } catch (error) {
    console.error('Error updating customization option:', error);
    return NextResponse.json(
      { message: 'Failed to update customization option' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { optionId: string } }
) {
  try {
    const { optionId } = params;

    // Validation
    if (!optionId) {
      return NextResponse.json(
        { message: 'Option ID is required' },
        { status: 400 }
      );
    }

    // Find the option to delete
    const optionIndex = mockOptions.findIndex(option => option.id === optionId);
    if (optionIndex === -1) {
      return NextResponse.json(
        { message: 'Customization option not found' },
        { status: 404 }
      );
    }

    // Remove the option (in real implementation, this would trigger cascading deletions)
    mockOptions.splice(optionIndex, 1);

    return NextResponse.json({
      message: 'Customization option deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customization option:', error);
    return NextResponse.json(
      { message: 'Failed to delete customization option' },
      { status: 500 }
    );
  }
}
