#!/bin/bash

echo "📊 BooksBoardroom Project Tracker Deployment Script"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"

# Configuration
FIREBASE_PROJECT="booksboardroom"
BUILD_DIR="dist"
TRACKER_FILE="booksboardroom-tracker.html"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}📋 Project Directory: $PROJECT_DIR${NC}"
echo -e "${BLUE}📁 Build Directory: $BUILD_DIR${NC}"
echo -e "${BLUE}📄 Tracker File: $TRACKER_FILE${NC}"
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

# Function to check Firebase authentication
check_firebase_auth() {
    echo -e "${BLUE}🔐 Checking Firebase authentication...${NC}"
    if firebase projects:list &>/dev/null; then
        echo -e "${GREEN}✅ Firebase authentication confirmed${NC}"
        return 0
    else
        echo -e "${RED}❌ Not logged in to Firebase${NC}"
        echo -e "${YELLOW}🔑 Please run: firebase login --reauth${NC}"
        return 1
    fi
}

# Function to create backup
create_backup() {
    echo -e "${BLUE}💾 Creating backup...${NC}"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup current dist folder if it exists
    if [ -d "$BUILD_DIR" ]; then
        cp -r "$BUILD_DIR" "$BACKUP_DIR/dist_backup"
        echo -e "${GREEN}✅ Backed up existing build to $BACKUP_DIR${NC}"
    fi
    
    # Backup firebase.json
    if [ -f "firebase.json" ]; then
        cp "firebase.json" "$BACKUP_DIR/firebase.json.bak"
        echo -e "${GREEN}✅ Backed up firebase.json${NC}"
    fi
    
    echo -e "${GREEN}💾 Backup created in: $BACKUP_DIR${NC}"
}

# Function to prepare build directory
prepare_build() {
    echo -e "${BLUE}🏗️  Preparing build directory...${NC}"
    
    # Create dist directory if it doesn't exist
    mkdir -p "$BUILD_DIR"
    
    # Check if we have a React/Vite project to build
    if [ -f "package.json" ] && [ -f "vite.config.ts" ]; then
        echo -e "${BLUE}🔨 Building React/Vite project...${NC}"
        
        # Install dependencies if node_modules doesn't exist
        if [ ! -d "node_modules" ]; then
            echo -e "${BLUE}📦 Installing dependencies...${NC}"
            npm install
        fi
        
        # Build the project
        npm run build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Build failed!${NC}"
            return 1
        fi
        
        echo -e "${GREEN}✅ React/Vite build completed${NC}"
    fi
    
    # Copy tracker HTML file to dist
    if [ -f "$TRACKER_FILE" ]; then
        cp "$TRACKER_FILE" "$BUILD_DIR/tracker.html"
        echo -e "${GREEN}✅ Copied tracker file to $BUILD_DIR/tracker.html${NC}"
    fi
    
    # Copy any static HTML files from root
    for html_file in *.html; do
        if [ -f "$html_file" ] && [ "$html_file" != "$TRACKER_FILE" ]; then
            cp "$html_file" "$BUILD_DIR/"
            echo -e "${GREEN}✅ Copied $html_file to build directory${NC}"
        fi
    done
    
    return 0
}

# Function to deploy to Firebase
deploy_firebase() {
    echo -e "${BLUE}🚀 Deploying to Firebase Hosting...${NC}"
    
    # Set Firebase project
    firebase use "$FIREBASE_PROJECT"
    
    # Deploy hosting only
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
        echo ""
        echo -e "${GREEN}🌐 Your BooksBoardroom Project Tracker is now live at:${NC}"
        echo -e "   ${BLUE}https://$FIREBASE_PROJECT.web.app${NC}"
        echo -e "   ${BLUE}https://$FIREBASE_PROJECT.firebaseapp.com${NC}"
        echo ""
        echo -e "${GREEN}📊 Available Pages:${NC}"
        echo -e "   ${BLUE}Main App: https://$FIREBASE_PROJECT.web.app/${NC}"
        echo -e "   ${BLUE}Project Tracker: https://$FIREBASE_PROJECT.web.app/tracker.html${NC}"
        echo ""
        return 0
    else
        echo ""
        echo -e "${RED}❌ Deployment failed!${NC}"
        echo -e "${YELLOW}📝 Check the error messages above and ensure:${NC}"
        echo -e "   - Firebase project exists and you have access"
        echo -e "   - Firebase.json is properly configured"
        echo -e "   - Build files exist in $BUILD_DIR directory"
        return 1
    fi
}

# Function to show rollback instructions
show_rollback_instructions() {
    echo ""
    echo -e "${YELLOW}🔄 Rollback Instructions:${NC}"
    echo -e "   To rollback to previous version:"
    echo -e "   ${BLUE}firebase hosting:channel:delete live${NC}"
    echo -e "   ${BLUE}cp -r $BACKUP_DIR/dist_backup/* $BUILD_DIR/${NC}"
    echo -e "   ${BLUE}firebase deploy --only hosting${NC}"
    echo ""
    echo -e "   Or restore backup:"
    echo -e "   ${BLUE}rm -rf $BUILD_DIR${NC}"
    echo -e "   ${BLUE}cp -r $BACKUP_DIR/dist_backup $BUILD_DIR${NC}"
    echo -e "   ${BLUE}firebase deploy --only hosting${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check required commands
    check_command "firebase" || exit 1
    check_command "npm" || exit 1
    
    # Check Firebase authentication
    check_firebase_auth || {
        echo -e "${YELLOW}⚠️  Skipping deployment due to authentication issues${NC}"
        echo -e "${YELLOW}💡 Run 'firebase login --reauth' then try again${NC}"
        exit 1
    }
    
    # Create backup
    create_backup
    
    # Prepare build
    prepare_build || {
        echo -e "${RED}❌ Build preparation failed${NC}"
        exit 1
    }
    
    # Deploy
    deploy_firebase || {
        echo -e "${RED}❌ Deployment failed${NC}"
        show_rollback_instructions
        exit 1
    }
    
    # Show rollback instructions
    show_rollback_instructions
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
}

# Run main function
main "$@"