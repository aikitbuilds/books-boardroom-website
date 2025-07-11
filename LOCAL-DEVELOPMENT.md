# Local Firebase Development Setup

## 🚀 Quick Start

### Option 1: Use the startup script
```bash
# Double-click start-local.bat (Windows)
# This will start both Firebase emulators and the dev server
```

### Option 2: Manual startup
```bash
# Terminal 1: Start Firebase emulators
npm run emulators

# Terminal 2: Start development server  
npm run dev
```

## 🔧 Configuration

### Environment Variables (.env)
```
VITE_USE_EMULATORS=true
VITE_FIREBASE_API_KEY=AIzaSyCNM1u_mE8j9k3LBq3mnZDGn96C9yh2DNw
VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0686783756.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0686783756
VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0686783756.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=942449514075
VITE_FIREBASE_APP_ID=1:942449514075:web:sps-osx-solar-ops
VITE_USE_EMULATORS=true
VITE_EMULATOR_HOST=localhost
```

## 📍 Local URLs

- **Your App**: http://localhost:5173/ (or next available port)
- **Firebase Emulator UI**: http://localhost:4000/
- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8081  
- **Storage Emulator**: http://localhost:9199

## 🔥 Firebase Emulator Features

### Authentication
- **Anonymous Auth**: Enabled for testing
- **Google Auth**: Works with emulator
- **Test Users**: Create test accounts in emulator UI

### Firestore Database
- **Local Database**: All data stored locally
- **Real-time Updates**: Full real-time functionality
- **Rules Testing**: Test security rules locally

### Storage
- **File Uploads**: Test file upload functionality
- **Local Storage**: Files stored in local emulator

## 🧪 Testing

### Test Firebase Connection
```bash
# Run the test script
node test-firebase.js
```

### Test Authentication
1. Open http://localhost:5173/
2. Click "Sign in with Google"
3. Use emulator auth (no real Google account needed)

### Test Data Operations
1. Create a project or customer
2. Check Firestore emulator UI at http://localhost:4000/
3. Verify data appears in local database

## 🐛 Troubleshooting

### Emulators Won't Start
```bash
# Kill any existing processes
taskkill /F /IM java.exe
taskkill /F /IM node.exe

# Restart emulators
firebase emulators:start --only auth,firestore,storage,ui
```

### Port Conflicts
- Emulators use ports: 4000, 8081, 9099, 9199
- Dev server auto-selects available port (5173, 5174, 5175, etc.)
- Check `netstat -ano | findstr :PORT` to see what's using ports

### Connection Errors
1. **Check emulators are running**: Visit http://localhost:4000/
2. **Check environment**: Ensure `VITE_USE_EMULATORS=true`
3. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
4. **Check console**: Look for Firebase connection messages

## 🔄 Switching Between Local and Production

### Force Local Development
```bash
# Set in .env
VITE_USE_EMULATORS=true
```

### Force Production
```bash
# Set in .env  
VITE_USE_EMULATORS=false
```

## 📊 Data Management

### Export Local Data
```bash
firebase emulators:export ./emulator-data
```

### Import Local Data
```bash
firebase emulators:start --import=./emulator-data
```

### Clear Local Data
- Stop emulators
- Delete `firebase-debug.log`
- Restart emulators

## ✅ Verification Checklist

- [ ] Firebase emulators running (check http://localhost:4000/)
- [ ] Development server running (check http://localhost:5173/)
- [ ] Environment variables set correctly
- [ ] Authentication working (can sign in)
- [ ] Database writes working (can create data)
- [ ] Real-time updates working (data syncs)
- [ ] No console errors related to Firebase

## 🚀 Production Deployment

When ready for production:
1. Set `VITE_USE_EMULATORS=false`
2. Run `npm run build`
3. Deploy with `firebase deploy` 