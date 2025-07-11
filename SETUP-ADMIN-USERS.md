# Setting Up Admin and Super Admin Users

## Method 1: Firebase Console (Quick Setup)

### Step 1: Create User in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/project/booksboardroom)
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"**
4. Enter email and password for the admin user
5. Click **"Add User"**

### Step 2: Set User Role in Firestore
1. Go to **Firestore Database** → **Data**
2. Navigate to the `users` collection
3. Create a new document with the user's UID as the document ID
4. Add the following fields:

```json
{
  "uid": "USER_UID_FROM_AUTH",
  "email": "admin@yourcompany.com",
  "role": "superAdmin",
  "permissions": [
    "user:create",
    "user:read", 
    "user:update",
    "user:delete",
    "account:create",
    "account:read",
    "account:update", 
    "account:delete",
    "system:manage",
    "demo:manage"
  ],
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "displayName": "Super Admin",
  "isEmailVerified": true,
  "lastLoginAt": "2024-01-01T00:00:00.000Z"
}
```

### Step 3: For Admin Users (Not Super Admin)
Use the same process but set:
```json
{
  "role": "admin",
  "accountId": "ACCOUNT_ID",
  "permissions": [
    "user:read",
    "user:update",
    "account:read", 
    "account:update",
    "demo:manage"
  ]
}
```

## Method 2: Using the App Interface

### For Super Admin Users:
1. Login as an existing super admin
2. Go to **User Management** (in profile menu)
3. Click **"Create User"**
4. Fill in user details
5. Set **Role** to "superAdmin"
6. Click **"Create User"**

### For Admin Users:
1. Login as a super admin
2. Go to **User Management**
3. Click **"Create User"**
4. Fill in user details
5. Set **Role** to "admin"
6. Select an **Account** for the admin
7. Click **"Create User"**

## Method 3: Using the Setup Script

### Prerequisites:
- Node.js installed
- Firebase CLI installed and authenticated

### Steps:
1. Create a user in Firebase Authentication
2. Run the setup script:
```bash
node scripts/setup-super-admin.js admin@yourcompany.com password123
```

## Role Definitions

### Super Admin Permissions:
- Create, read, update, delete any user
- Create, read, update, delete any account
- Manage system settings
- Access all data across all accounts
- Manage demo data for any account

### Admin Permissions:
- Read and update users in their account
- Read and update their account
- Manage demo data for their account
- Cannot delete users or accounts
- Cannot access other accounts

### Regular User Permissions:
- Read and update their own profile
- Access their own data
- Cannot manage other users or accounts

## Testing the Setup

1. **Login** with the new admin/super admin account
2. **Check the profile menu** - you should see "User Management" option
3. **Navigate to User Management** to verify access
4. **Try creating a test user** to verify permissions

## Troubleshooting

### If User Management is not visible:
- Check that the user document exists in Firestore
- Verify the role is set correctly
- Check that permissions array includes required permissions

### If permissions are denied:
- Verify Firestore rules are deployed
- Check that the user document structure matches the expected format
- Ensure the user is authenticated

### Common Issues:
1. **User document missing**: Create the user document in Firestore
2. **Wrong role**: Update the role field in the user document
3. **Missing permissions**: Add required permissions to the permissions array
4. **Firestore rules not deployed**: Run `firebase deploy --only firestore:rules` 