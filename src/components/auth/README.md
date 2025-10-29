# Login Modal System

This system provides a reusable login modal that can be triggered from anywhere in the application when users need to authenticate to perform certain actions.

## Components

### LoginModal

A reusable modal component that handles user authentication with email and password.

**Props:**

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Function to close the modal
- `title?: string` - Dynamic title for the modal (default: "Login Required")
- `onSuccess?: () => void` - Callback function executed after successful login

### LoginModalProvider

A provider component that renders the login modal globally. This should be added to the root layout.

### useLoginModal Hook

A Zustand store hook that manages the login modal state globally.

**Methods:**

- `openModal(title?: string, onSuccess?: () => void)` - Opens the modal with optional title and success callback
- `closeModal()` - Closes the modal
- `isOpen: boolean` - Current modal state
- `title: string` - Current modal title
- `onSuccess?: () => void` - Current success callback

## Usage

### 1. Setup (Already done in layout.tsx)

The `LoginModalProvider` is already added to the root layout, so the modal is available globally.

### 2. Using in Components

```tsx
import { useAuth } from '@/store/use-auth';
import { useLoginModal } from '@/hooks/use-login-modal';

function MyComponent() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useLoginModal();

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      openModal("Action Required", () => {
        // This will be called after successful login
        performAction();
      });
      return;
    }
    
    performAction();
  };

  const performAction = () => {
    // Your protected action here
    console.log('Action performed!');
  };

  return (
    <button onClick={handleProtectedAction}>
      Perform Action
    </button>
  );
}
```

### 3. Example with Product Card

The `ProductCard` component now automatically shows the login modal when unauthenticated users try to:

- Add items to cart
- Add items to wishlist

The modal title will dynamically change based on the action:

- "Add Item to Cart" for cart actions
- "Add Item to Wishlist" for wishlist actions

## Features

- **Responsive Design**: Works on all screen sizes
- **Dynamic Titles**: Modal title changes based on the triggering action
- **Success Callbacks**: Execute custom logic after successful login
- **Form Validation**: Uses the same validation as the login page
- **Error Handling**: Displays appropriate error messages
- **Navigation**: Links to signup and forgot password pages
- **Keyboard Support**: ESC key closes the modal
- **Body Scroll Lock**: Prevents background scrolling when modal is open

## Styling

The modal uses the same styling as the login page for consistency:

- Same logo and branding
- Same input field styling
- Same button styling
- Same color scheme

## Integration with Auth Store

The modal integrates seamlessly with the existing auth store:

- Uses the same login function
- Handles loading states
- Displays error messages
- Updates authentication state
