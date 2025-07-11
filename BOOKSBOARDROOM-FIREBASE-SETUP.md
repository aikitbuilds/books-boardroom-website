# 🚀 BooksBoardroom Firebase Setup & Deployment Guide

## Step 1: Create Your BooksBoardroom Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it: **booksboardroom**
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Enable Required Services

In your Firebase Console for the booksboardroom project:

### Enable Authentication
1. Go to "Authentication" → "Get started"
2. Enable "Email/Password" provider
3. (Optional) Enable "Google" provider for Google login

### Enable Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Start in "production mode"
3. Choose your preferred location

### Enable Storage
1. Go to "Storage" → "Get started"
2. Start in production mode
3. Choose same location as Firestore

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" → Choose "Web" (</> icon)
4. Name it: "BooksBoardroom Portal"
5. Copy the configuration object

## Step 4: Update Your Local Configuration

Edit `src/lib/firebase-config.ts` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "booksboardroom.firebaseapp.com",
  projectId: "booksboardroom",
  storageBucket: "booksboardroom.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Deploy to Firebase

### First-time setup:
```bash
# Login to Firebase
firebase login

# Initialize hosting (if asked)
firebase init hosting
# - Use existing project: booksboardroom
# - Public directory: dist
# - Configure as SPA: Yes
# - Don't overwrite index.html
```

### Deploy:
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Step 6: Set Up Security Rules

### Firestore Rules
Deploy these rules to secure your database:

```bash
firebase deploy --only firestore:rules
```

### Storage Rules
Deploy storage security rules:

```bash
firebase deploy --only storage
```

## 🎉 Your BooksBoardroom Portal is Live!

After deployment, your portal will be available at:
- Primary: `https://booksboardroom.web.app`
- Alternative: `https://booksboardroom.firebaseapp.com`

## 📱 Features Available

Your deployed portal includes:

1. **Back Office Dashboard** - Central hub for all operations
2. **CRM System** - Contact and opportunity management
3. **Financial Dashboard** - Tax management and reporting
4. **Project Management** - Kanban boards with drag-and-drop
5. **File Management** - Secure document storage

## 🔧 Post-Deployment Setup

### 1. Enable Authentication
For production use, you'll need to:
1. Remove the authentication bypass in `src/App.tsx`
2. Set up user accounts in Firebase Authentication
3. Configure proper security rules

### 2. Custom Domain (Optional)
1. Go to Firebase Hosting settings
2. Click "Add custom domain"
3. Follow the DNS verification process

### 3. Monitor Usage
- Check Firebase Console for usage statistics
- Monitor Firestore reads/writes
- Track Storage usage
- Review Authentication metrics

## 📝 Quick Commands Reference

```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only rules
firebase deploy --only firestore:rules,storage

# Run locally
npm run dev

# Build for production
npm run build
```

## ⚠️ Important Notes

1. **API Keys**: The Firebase config API keys are meant to be public (they're restricted by domain)
2. **Security**: Always use proper security rules in production
3. **Costs**: Monitor your Firebase usage to avoid unexpected charges
4. **Backups**: Regular Firestore backups are recommended for production

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or the project's README.md