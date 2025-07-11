# 🚀 BooksBoardroom Deployment Scripts

This directory contains comprehensive deployment scripts for the BooksBoardroom project, including the project tracker and full application deployment.

## 📋 Available Scripts

### 🧪 `test-deployment.sh`
**Purpose**: Comprehensive testing of deployment setup and configuration
```bash
# Test everything
./test-deployment.sh

# Test specific components
./test-deployment.sh firebase    # Test Firebase CLI and auth
./test-deployment.sh structure   # Test project structure
./test-deployment.sh build      # Test build process
./test-deployment.sh scripts    # Test deployment scripts
./test-deployment.sh config     # Test Firebase configuration
./test-deployment.sh live       # Test live deployment
```

### 🔧 `setup-firebase.sh`
**Purpose**: Initialize Firebase project and configuration
```bash
./setup-firebase.sh
```
**Features**:
- Installs Firebase CLI if needed
- Authenticates with Firebase
- Creates/verifies Firebase project
- Sets up firebase.json, .firebaserc
- Creates Firestore rules and Storage rules
- Validates setup

### 📊 `deploy-tracker.sh`
**Purpose**: Deploy project tracker HTML file only
```bash
./deploy-tracker.sh
```
**Features**:
- Creates automatic backups
- Builds React/Vite project if available
- Copies tracker HTML to dist folder
- Deploys to Firebase Hosting
- Shows deployment URLs and rollback instructions

### 🚀 `deploy-full.sh`
**Purpose**: Full application deployment (main project + OSX template)
```bash
./deploy-full.sh
```
**Features**:
- Comprehensive backup system
- Builds both main project and OSX template
- Merges builds and assets
- Deploys Firebase services (Firestore, Storage, Hosting)
- Runs post-deployment tests
- Shows all available URLs

### 💾 `backup-deployment.sh`
**Purpose**: Create comprehensive backups and restore functionality
```bash
# Create backup
./backup-deployment.sh

# List backups
./backup-deployment.sh list

# Restore specific backup
./backup-deployment.sh restore TIMESTAMP

# Cleanup old backups
./backup-deployment.sh cleanup
```

## 🏗️ Project Structure

```
BooksBoardroom/
├── src/                           # Main React application source
├── OSX-template-financial/        # OSX template application
│   ├── src/                      # OSX template source
│   ├── dist/                     # OSX template build output
│   └── firebase.json             # OSX template Firebase config
├── dist/                         # Main build output
├── booksboardroom-tracker.html   # Project tracker HTML
├── firebase.json                 # Firebase configuration
├── firestore.rules              # Firestore security rules
├── storage.rules                # Storage security rules
├── firestore.indexes.json       # Firestore indexes
├── .firebaserc                  # Firebase project configuration
└── deployment-backups/          # Backup storage
```

## 🔥 Firebase Configuration

### Hosting Setup
The firebase.json is configured to support:
- **Main App**: React/Vite application at root
- **Project Tracker**: `/tracker` → `tracker.html`
- **Operations Dashboard**: `/operations` → `operations.html`
- **SPA Routes**: All app routes handled by React Router

### Firestore Rules
```javascript
// Authenticated users have full access
match /{document=**} {
  allow read, write: if request.auth != null;
}

// Demo data is publicly readable
match /demo/{document=**} {
  allow read: if true;
}
```

### Storage Rules
```javascript
// User-specific uploads
match /uploads/{userId}/{allPaths=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Public assets
match /public/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

## 🚀 Quick Start Guide

### 1. First Time Setup
```bash
# 1. Test current setup
./test-deployment.sh

# 2. Setup Firebase (if needed)
./setup-firebase.sh

# 3. Test again to verify
./test-deployment.sh
```

### 2. Deploy Project Tracker Only
```bash
# Quick deployment of just the tracker
./deploy-tracker.sh
```
**Result**: https://booksboardroom.web.app/tracker

### 3. Deploy Full Application
```bash
# Full deployment with all features
./deploy-full.sh
```
**Result**: 
- Main App: https://booksboardroom.web.app/
- Project Tracker: https://booksboardroom.web.app/tracker
- Operations Dashboard: https://booksboardroom.web.app/operations

## 🔧 Prerequisites

### Required Tools
- **Node.js** (v18+)
- **npm** (v9+)
- **Firebase CLI** (v14+)
- **bash** (Linux/macOS/WSL)

### Optional Tools
- **curl** (for deployment testing)
- **jq** (for JSON validation)

### Firebase Setup
1. **Firebase Project**: Create project at https://console.firebase.google.com
2. **Services Enabled**:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
   - Hosting

## 📊 Deployment URLs

After successful deployment, your application will be available at:

| Service | URL | Description |
|---------|-----|-------------|
| Main App | https://booksboardroom.web.app/ | React application |
| Back Office | https://booksboardroom.web.app/back-office | Back office portal |
| CRM | https://booksboardroom.web.app/crm | CRM dashboard |
| Financial | https://booksboardroom.web.app/financial | Financial dashboard |
| Project Tracker | https://booksboardroom.web.app/tracker | Project management |
| Operations | https://booksboardroom.web.app/operations | Operations dashboard |

## 🔄 Backup & Recovery

### Automatic Backups
All deployment scripts create automatic backups:
```
deployment-backups/
├── YYYYMMDD_HHMMSS/
│   ├── source/           # Source code backup
│   ├── builds/           # Build artifacts
│   ├── configs/          # Configuration files
│   ├── firebase-state/   # Firebase deployment state
│   ├── docs/            # Documentation
│   └── BACKUP_MANIFEST.md
```

### Recovery
```bash
# List available backups
./backup-deployment.sh list

# Restore specific backup
./backup-deployment.sh restore 20241201_143000

# Manual restore
cp -r deployment-backups/20241201_143000/source/* ./
firebase deploy --only hosting
```

## 🧪 Testing & Validation

### Pre-deployment Tests
```bash
# Run all tests
./test-deployment.sh

# Test specific areas
./test-deployment.sh firebase    # Firebase CLI
./test-deployment.sh build      # Build process
./test-deployment.sh config     # Configuration
```

### Post-deployment Tests
```bash
# Test live deployment
./test-deployment.sh live

# Manual testing
curl -I https://booksboardroom.web.app/
curl -I https://booksboardroom.web.app/tracker
curl -I https://booksboardroom.web.app/operations
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Error
```bash
# Error: Authentication Error: Your credentials are no longer valid
firebase login --reauth
```

#### 2. Project Not Found
```bash
# Error: Project not found
# 1. Check project exists in Firebase Console
# 2. Verify project ID in .firebaserc
# 3. Ensure you have access to the project
firebase use --add  # Select correct project
```

#### 3. Build Failures
```bash
# Error: Build failed
npm install          # Install dependencies
npm run build       # Test build locally
./test-deployment.sh build  # Diagnose build issues
```

#### 4. Permission Errors
```bash
# Error: Permission denied
chmod +x *.sh       # Make scripts executable
```

#### 5. Deployment Failures
```bash
# Check Firebase status
firebase projects:list
firebase use booksboardroom

# Check build output
ls -la dist/

# Check configuration
./test-deployment.sh config
```

### Debug Mode
Add debugging to any script:
```bash
# Enable debug output
set -x
./deploy-tracker.sh
set +x
```

## 📝 Script Options

### Environment Variables
```bash
# Override default project
FIREBASE_PROJECT=your-project-id ./deploy-full.sh

# Skip backup creation
SKIP_BACKUP=true ./deploy-tracker.sh

# Force rebuild
FORCE_BUILD=true ./deploy-full.sh
```

### Advanced Usage
```bash
# Deploy specific services only
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only storage

# Deploy with preview
firebase hosting:channel:deploy preview

# Rollback deployment
firebase hosting:clone source-site-id:source-channel-id target-site-id:target-channel-id
```

## 🔐 Security Considerations

### Firestore Rules
- **Production**: Requires authentication for read/write
- **Demo Mode**: Public read access for demo data only
- **User Data**: Isolated by user ID

### Storage Rules
- **User Uploads**: Private to authenticated user
- **Public Assets**: Public read, authenticated write
- **File Types**: Restricted by application logic

### Environment Variables
Never commit sensitive data:
```bash
# Use environment files (not committed)
echo "FIREBASE_API_KEY=your-key" > .env.local
echo "FIREBASE_PROJECT_ID=your-project" >> .env.local
```

## 📈 Performance Optimization

### Caching Headers
```javascript
// Static assets (1 year)
"**/*.@(js|jsx|ts|tsx|css|scss|png|jpg|jpeg|gif|svg|ico)": "max-age=31536000"

// HTML files (1 hour)
"**/*.html": "max-age=3600"
```

### Build Optimization
```bash
# Enable production build
NODE_ENV=production npm run build

# Analyze bundle size
npm run build -- --analyze
```

## 🤝 Contributing

### Adding New Deployment Scripts
1. Follow naming convention: `action-target.sh`
2. Include error handling and color output
3. Add backup functionality
4. Update this README
5. Test with `./test-deployment.sh`

### Modifying Existing Scripts
1. Test changes thoroughly
2. Update version comments
3. Maintain backward compatibility
4. Document breaking changes

---

## 📞 Support

For deployment issues:
1. **Run diagnostics**: `./test-deployment.sh`
2. **Check logs**: Firebase Console → Functions/Hosting logs
3. **Verify setup**: `./setup-firebase.sh`
4. **Create backup**: `./backup-deployment.sh`

**Firebase Console**: https://console.firebase.google.com/project/booksboardroom

---

*Last updated: $(date)*
*Generated for BooksBoardroom v1.0*