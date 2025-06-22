# PhoneAuth Integration with React Frontend

This integration adds phone number + OTP authentication to the React frontend application, working with the Laravel PhoneAuth package in the backend.

## Core Authentication Flow

1. **Login Flow**:
   - User enters phone number
   - OTP is sent via SMS using Twilio
   - User enters OTP
   - Upon verification, a token is issued and saved in localStorage

2. **Registration Flow**:
   - User enters phone number and other required information
   - Backend creates a new customer account
   - OTP is sent to verify the phone number
   - User enters OTP to verify and receive authentication token

## Integration Points

### Authentication
- The `AuthContext.jsx` handles login, registration, and token management
- Phone number validation and OTP verification are managed through the PhoneAuth API endpoints
- JWT tokens are stored in localStorage as 'auth_token'
- All API requests include the authentication token in headers

### Cart & Checkout
- Cart operations adapt based on authentication status
- Authenticated users use `/api/v1/customer/cart` endpoints with their token
- Guest users use `/api/cart` endpoints with cart_id stored in localStorage
- All cart contexts include fallbacks to handle transitions between logged-in/out states

### Orders
- Order management is handled through the OrderContext
- All order operations require authentication
- API endpoints prioritize PhoneAuth endpoints but include fallbacks

### Account
- User profile and address management through AccountContext
- All profile operations require authentication
- Multiple API endpoints are tried to ensure compatibility

## API Endpoints Used

### Authentication
- `/api/phone-auth/send-otp` - Send OTP to phone number
- `/api/phone-auth/verify-otp` - Verify OTP and get token
- `/api/phone-auth/register` - Register new user
- `/api/phone-auth/login` - Login with phone number (sends OTP)
- `/api/phone-auth/logout` - Logout and invalidate token

### Cart & Checkout
- `/api/v1/customer/cart` - Get authenticated user cart
- `/api/v1/customer/cart/add` - Add item to authenticated cart
- `/api/v1/customer/cart/update` - Update cart item
- `/api/v1/customer/cart/remove` - Remove cart item or clear cart
- `/api/v1/customer/checkout/...` - Checkout operations

### Orders
- `/api/v1/customer/orders` - Get all orders
- `/api/v1/customer/orders/{id}` - Get specific order
- `/api/v1/customer/orders/{id}/cancel` - Cancel order
- `/api/v1/customer/orders/reorder/{id}` - Reorder items from past order

## Fallback Strategy

For compatibility, the application attempts to use PhoneAuth endpoints first and falls back to legacy endpoints if needed. This ensures the app works regardless of which authentication method is active.

## Error Handling

- 401 errors automatically clear the invalid token
- Network errors maintain local state when possible
- All API calls include proper error handling

## Testing Notes

When testing the PhoneAuth integration:
1. Ensure Twilio is properly configured in the Laravel backend
2. For development, you can set `sms_provider` to 'log' in the phoneauth.php config
3. Valid phone numbers should follow the E.164 format (e.g., +12345678901)
