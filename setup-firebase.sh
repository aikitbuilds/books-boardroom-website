#!/bin/bash

echo "🔧 BooksBoardroom Firebase Setup Script"
echo "======================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
FIREBASE_PROJECT="booksboardroom"
REGION="us-central1"

echo -e "${BLUE}🔥 Firebase Project: $FIREBASE_PROJECT${NC}"
echo -e "${BLUE}🌍 Region: $REGION${NC}"
echo ""

# Function to check command availability
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed or not in PATH${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ $1 is available${NC}"
    return 0
}

# Function to install Firebase CLI if needed
install_firebase_cli() {
    echo -e "${BLUE}📦 Checking Firebase CLI installation...${NC}"
    
    if ! check_command "firebase"; then
        echo -e "${YELLOW}⚠️  Firebase CLI not found. Installing...${NC}"
        npm install -g firebase-tools
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Firebase CLI installed successfully${NC}"
        else
            echo -e "${RED}❌ Failed to install Firebase CLI${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ Firebase CLI already installed${NC}"
        firebase --version
    fi
    
    return 0
}

# Function to authenticate Firebase
authenticate_firebase() {
    echo -e "${BLUE}🔐 Authenticating with Firebase...${NC}"
    
    # Check if already authenticated
    if firebase projects:list &>/dev/null; then
        echo -e "${GREEN}✅ Already authenticated with Firebase${NC}"
        firebase projects:list
        return 0
    fi
    
    echo -e "${YELLOW}🔑 Please authenticate with Firebase...${NC}"
    firebase login
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Firebase authentication successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Firebase authentication failed${NC}"
        return 1
    fi
}

# Function to check if project exists
check_project_exists() {
    echo -e "${BLUE}🔍 Checking if Firebase project exists...${NC}"
    
    if firebase projects:list | grep -q "$FIREBASE_PROJECT"; then
        echo -e "${GREEN}✅ Firebase project '$FIREBASE_PROJECT' found${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Firebase project '$FIREBASE_PROJECT' not found${NC}"
        return 1
    fi
}

# Function to create Firebase project
create_firebase_project() {
    echo -e "${BLUE}🏗️  Creating Firebase project...${NC}"
    
    echo -e "${YELLOW}📝 Note: Project creation requires Firebase console${NC}"
    echo -e "${YELLOW}🌐 Please visit: https://console.firebase.google.com${NC}"
    echo -e "${YELLOW}➕ Click 'Add project' and create project with ID: $FIREBASE_PROJECT${NC}"
    echo ""
    
    read -p "Press Enter after creating the project in Firebase Console..."
    
    # Check if project now exists
    if check_project_exists; then
        echo -e "${GREEN}✅ Project creation confirmed${NC}"
        return 0
    else
        echo -e "${RED}❌ Project not found. Please ensure it was created correctly${NC}"
        return 1
    fi
}

# Function to initialize Firebase in project
init_firebase_project() {
    echo -e "${BLUE}🚀 Initializing Firebase in project...${NC}"
    
    # Use existing firebase.json if available, otherwise create new
    if [ -f "firebase.json" ]; then
        echo -e "${GREEN}✅ firebase.json already exists${NC}"
        cat firebase.json
    else
        echo -e "${BLUE}📝 Creating firebase.json...${NC}"
        
        cat > firebase.json << EOF
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|jsx|ts|tsx)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(css|scss)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8081
    },
    "storage": {
      "port": 9199
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
EOF
        echo -e "${GREEN}✅ firebase.json created${NC}"
    fi
    
    # Create .firebaserc file
    echo -e "${BLUE}📝 Setting up .firebaserc...${NC}"
    cat > .firebaserc << EOF
{
  "projects": {
    "default": "$FIREBASE_PROJECT"
  }
}
EOF
    echo -e "${GREEN}✅ .firebaserc created${NC}"
    
    # Use the project
    firebase use "$FIREBASE_PROJECT"
    
    return 0
}

# Function to create Firestore rules
create_firestore_rules() {
    echo -e "${BLUE}📝 Creating Firestore rules...${NC}"
    
    if [ ! -f "firestore.rules" ]; then
        cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow anonymous read for demo purposes
    match /demo/{document=**} {
      allow read: if true;
    }
    
    // Public read for landing page data
    match /public/{document=**} {
      allow read: if true;
    }
  }
}
EOF
        echo -e "${GREEN}✅ firestore.rules created${NC}"
    else
        echo -e "${GREEN}✅ firestore.rules already exists${NC}"
    fi
}

# Function to create Storage rules
create_storage_rules() {
    echo -e "${BLUE}📝 Creating Storage rules...${NC}"
    
    if [ ! -f "storage.rules" ]; then
        cat > storage.rules << 'EOF'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for public assets
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
EOF
        echo -e "${GREEN}✅ storage.rules created${NC}"
    else
        echo -e "${GREEN}✅ storage.rules already exists${NC}"
    fi
}

# Function to create Firestore indexes
create_firestore_indexes() {
    echo -e "${BLUE}📝 Creating Firestore indexes...${NC}"
    
    if [ ! -f "firestore.indexes.json" ]; then
        cat > firestore.indexes.json << 'EOF'
{
  "indexes": [],
  "fieldOverrides": []
}
EOF
        echo -e "${GREEN}✅ firestore.indexes.json created${NC}"
    else
        echo -e "${GREEN}✅ firestore.indexes.json already exists${NC}"
    fi
}

# Function to test Firebase setup
test_firebase_setup() {
    echo -e "${BLUE}🧪 Testing Firebase setup...${NC}"
    
    # Test Firebase CLI connection
    echo -e "${BLUE}🔍 Testing Firebase CLI connection...${NC}"
    if firebase projects:list | grep -q "$FIREBASE_PROJECT"; then
        echo -e "${GREEN}✅ Firebase CLI connection working${NC}"
    else
        echo -e "${RED}❌ Firebase CLI connection failed${NC}"
        return 1
    fi
    
    # Test project selection
    echo -e "${BLUE}🔍 Testing project selection...${NC}"
    firebase use --project "$FIREBASE_PROJECT"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Project selection working${NC}"
    else
        echo -e "${RED}❌ Project selection failed${NC}"
        return 1
    fi
    
    # Validate configuration files
    echo -e "${BLUE}🔍 Validating configuration files...${NC}"
    for file in firebase.json firestore.rules storage.rules firestore.indexes.json; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅ $file exists${NC}"
        else
            echo -e "${RED}❌ $file missing${NC}"
        fi
    done
    
    return 0
}

# Function to show next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Firebase setup completed!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo -e "   1. ${YELLOW}Enable services in Firebase Console:${NC}"
    echo -e "      - Authentication (Email/Password, Google)"
    echo -e "      - Firestore Database"
    echo -e "      - Storage"
    echo -e "      - Hosting"
    echo ""
    echo -e "   2. ${YELLOW}Deploy your application:${NC}"
    echo -e "      ${BLUE}./deploy-tracker.sh${NC}  (Project tracker only)"
    echo -e "      ${BLUE}./deploy-full.sh${NC}     (Full application)"
    echo ""
    echo -e "   3. ${YELLOW}Start local development:${NC}"
    echo -e "      ${BLUE}firebase emulators:start${NC}"
    echo ""
    echo -e "   4. ${YELLOW}Firebase Console:${NC}"
    echo -e "      ${BLUE}https://console.firebase.google.com/project/$FIREBASE_PROJECT${NC}"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Starting Firebase setup...${NC}"
    
    # Check prerequisites
    check_command "npm" || exit 1
    
    # Install Firebase CLI
    install_firebase_cli || exit 1
    
    # Authenticate
    authenticate_firebase || exit 1
    
    # Check if project exists, create if needed
    if ! check_project_exists; then
        echo -e "${YELLOW}🏗️  Project doesn't exist. Creating...${NC}"
        create_firebase_project || exit 1
    fi
    
    # Initialize Firebase in project
    init_firebase_project || exit 1
    
    # Create configuration files
    create_firestore_rules
    create_storage_rules
    create_firestore_indexes
    
    # Test setup
    test_firebase_setup || exit 1
    
    # Show next steps
    show_next_steps
    
    echo -e "${GREEN}✅ Firebase setup completed successfully!${NC}"
}

# Run main function
main "$@"