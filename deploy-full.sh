#!/bin/bash

echo "🚀 BooksBoardroom Full Stack Deployment Script"
echo "=============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"

# Configuration
FIREBASE_PROJECT="booksboardroom"
BUILD_DIR="dist"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
OSX_TEMPLATE_DIR="OSX-template-financial"

echo -e "${BLUE}📁 Project Directory: $PROJECT_DIR${NC}"
echo -e "${BLUE}📁 OSX Template Directory: $OSX_TEMPLATE_DIR${NC}"
echo -e "${BLUE}🏗️  Build Directory: $BUILD_DIR${NC}"
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
    echo -e "${BLUE}💾 Creating comprehensive backup...${NC}"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup current dist folder if it exists
    if [ -d "$BUILD_DIR" ]; then
        cp -r "$BUILD_DIR" "$BACKUP_DIR/dist_backup"
        echo -e "${GREEN}✅ Backed up existing build${NC}"
    fi
    
    # Backup OSX template dist if it exists
    if [ -d "$OSX_TEMPLATE_DIR/dist" ]; then
        cp -r "$OSX_TEMPLATE_DIR/dist" "$BACKUP_DIR/osx_dist_backup"
        echo -e "${GREEN}✅ Backed up OSX template build${NC}"
    fi
    
    # Backup configuration files
    for config_file in firebase.json firestore.rules firestore.indexes.json storage.rules; do
        if [ -f "$config_file" ]; then
            cp "$config_file" "$BACKUP_DIR/${config_file}.bak"
            echo -e "${GREEN}✅ Backed up $config_file${NC}"
        fi
    done
    
    # Backup OSX template configs
    if [ -d "$OSX_TEMPLATE_DIR" ]; then
        for config_file in firebase.json firestore.rules firestore.indexes.json; do
            if [ -f "$OSX_TEMPLATE_DIR/$config_file" ]; then
                cp "$OSX_TEMPLATE_DIR/$config_file" "$BACKUP_DIR/osx_${config_file}.bak"
                echo -e "${GREEN}✅ Backed up OSX $config_file${NC}"
            fi
        done
    fi
    
    echo -e "${GREEN}💾 Backup created in: $BACKUP_DIR${NC}"
}

# Function to build main project
build_main_project() {
    echo -e "${PURPLE}🏗️  Building main BooksBoardroom project...${NC}"
    
    # Check if we have a React/Vite project to build
    if [ -f "package.json" ] && [ -f "vite.config.ts" ]; then
        echo -e "${BLUE}📦 Installing dependencies...${NC}"
        npm install
        
        echo -e "${BLUE}🔨 Building main project...${NC}"
        npm run build
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Main project build failed!${NC}"
            return 1
        fi
        
        echo -e "${GREEN}✅ Main project build completed${NC}"
    else
        echo -e "${YELLOW}⚠️  No main project build configuration found${NC}"
    fi
    
    return 0
}

# Function to build OSX template
build_osx_template() {
    echo -e "${PURPLE}🏗️  Building OSX template project...${NC}"
    
    if [ -d "$OSX_TEMPLATE_DIR" ]; then
        cd "$OSX_TEMPLATE_DIR"
        
        if [ -f "package.json" ] && [ -f "vite.config.ts" ]; then
            echo -e "${BLUE}📦 Installing OSX template dependencies...${NC}"
            npm install
            
            echo -e "${BLUE}🔨 Building OSX template...${NC}"
            npm run build
            
            if [ $? -ne 0 ]; then
                echo -e "${RED}❌ OSX template build failed!${NC}"
                cd "$PROJECT_DIR"
                return 1
            fi
            
            echo -e "${GREEN}✅ OSX template build completed${NC}"
        else
            echo -e "${YELLOW}⚠️  No OSX template build configuration found${NC}"
        fi
        
        cd "$PROJECT_DIR"
    else
        echo -e "${YELLOW}⚠️  OSX template directory not found${NC}"
    fi
    
    return 0
}

# Function to merge builds and assets
merge_builds() {
    echo -e "${PURPLE}🔗 Merging builds and assets...${NC}"
    
    # Create main dist directory
    mkdir -p "$BUILD_DIR"
    
    # Copy main project build if it exists
    if [ -d "dist" ] && [ -f "vite.config.ts" ]; then
        echo -e "${BLUE}📁 Using main project as primary build${NC}"
    elif [ -d "$OSX_TEMPLATE_DIR/dist" ]; then
        echo -e "${BLUE}📁 Using OSX template as primary build${NC}"
        cp -r "$OSX_TEMPLATE_DIR/dist/"* "$BUILD_DIR/"
    fi
    
    # Add project tracker
    if [ -f "booksboardroom-tracker.html" ]; then
        cp "booksboardroom-tracker.html" "$BUILD_DIR/tracker.html"
        echo -e "${GREEN}✅ Added project tracker${NC}"
    fi
    
    # Add operations dashboard from OSX template
    if [ -f "$OSX_TEMPLATE_DIR/operations-dashboard.html" ]; then
        cp "$OSX_TEMPLATE_DIR/operations-dashboard.html" "$BUILD_DIR/operations.html"
        echo -e "${GREEN}✅ Added operations dashboard${NC}"
    fi
    
    # Add any additional HTML files
    for html_file in *.html; do
        if [ -f "$html_file" ] && [ "$html_file" != "index.html" ]; then
            cp "$html_file" "$BUILD_DIR/"
            echo -e "${GREEN}✅ Added $html_file${NC}"
        fi
    done
    
    echo -e "${GREEN}✅ Build merge completed${NC}"
}

# Function to deploy Firebase services
deploy_firebase_services() {
    echo -e "${PURPLE}🚀 Deploying Firebase services...${NC}"
    
    # Set Firebase project
    firebase use "$FIREBASE_PROJECT"
    
    # Deploy in stages
    echo -e "${BLUE}📊 Deploying Firestore rules and indexes...${NC}"
    firebase deploy --only firestore
    
    echo -e "${BLUE}💾 Deploying Storage rules...${NC}"
    firebase deploy --only storage
    
    echo -e "${BLUE}🌐 Deploying Hosting...${NC}"
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 Full deployment successful!${NC}"
        echo ""
        echo -e "${GREEN}🌐 Your BooksBoardroom Portal is now live at:${NC}"
        echo -e "   ${BLUE}https://$FIREBASE_PROJECT.web.app${NC}"
        echo -e "   ${BLUE}https://$FIREBASE_PROJECT.firebaseapp.com${NC}"
        echo ""
        echo -e "${GREEN}📊 Available Pages:${NC}"
        echo -e "   ${BLUE}Main Portal: https://$FIREBASE_PROJECT.web.app/${NC}"
        echo -e "   ${BLUE}Project Tracker: https://$FIREBASE_PROJECT.web.app/tracker.html${NC}"
        echo -e "   ${BLUE}Operations Dashboard: https://$FIREBASE_PROJECT.web.app/operations.html${NC}"
        echo -e "   ${BLUE}Back Office: https://$FIREBASE_PROJECT.web.app/back-office${NC}"
        echo -e "   ${BLUE}CRM: https://$FIREBASE_PROJECT.web.app/crm${NC}"
        echo -e "   ${BLUE}Financial Dashboard: https://$FIREBASE_PROJECT.web.app/financial${NC}"
        echo ""
        return 0
    else
        echo ""
        echo -e "${RED}❌ Deployment failed!${NC}"
        return 1
    fi
}

# Function to run deployment tests
run_deployment_tests() {
    echo -e "${PURPLE}🧪 Running post-deployment tests...${NC}"
    
    # Test main pages
    local base_url="https://$FIREBASE_PROJECT.web.app"
    
    echo -e "${BLUE}🔍 Testing main page...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$base_url" | grep -q "200"; then
        echo -e "${GREEN}✅ Main page accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Main page test failed${NC}"
    fi
    
    echo -e "${BLUE}🔍 Testing project tracker...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$base_url/tracker.html" | grep -q "200"; then
        echo -e "${GREEN}✅ Project tracker accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Project tracker test failed${NC}"
    fi
}

# Function to show rollback instructions
show_rollback_instructions() {
    echo ""
    echo -e "${YELLOW}🔄 Rollback Instructions:${NC}"
    echo -e "   To rollback to previous version:"
    echo -e "   ${BLUE}rm -rf $BUILD_DIR${NC}"
    echo -e "   ${BLUE}cp -r $BACKUP_DIR/dist_backup $BUILD_DIR${NC}"
    echo -e "   ${BLUE}firebase deploy --only hosting${NC}"
    echo ""
    echo -e "   To restore configuration files:"
    echo -e "   ${BLUE}cp $BACKUP_DIR/*.bak ./$(echo '${BACKUP_DIR}' | sed 's/.bak$//')${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check required commands
    check_command "firebase" || exit 1
    check_command "npm" || exit 1
    check_command "curl" || echo -e "${YELLOW}⚠️  curl not available - skipping deployment tests${NC}"
    
    # Check Firebase authentication
    check_firebase_auth || {
        echo -e "${YELLOW}⚠️  Skipping deployment due to authentication issues${NC}"
        echo -e "${YELLOW}💡 Run 'firebase login --reauth' then try again${NC}"
        exit 1
    }
    
    # Create backup
    create_backup
    
    # Build projects
    echo -e "${PURPLE}🏗️  Building all projects...${NC}"
    build_main_project || {
        echo -e "${RED}❌ Main project build failed${NC}"
        exit 1
    }
    
    build_osx_template || {
        echo -e "${RED}❌ OSX template build failed${NC}"
        exit 1
    }
    
    # Merge builds
    merge_builds
    
    # Deploy to Firebase
    deploy_firebase_services || {
        echo -e "${RED}❌ Deployment failed${NC}"
        show_rollback_instructions
        exit 1
    }
    
    # Run tests
    if command -v curl &> /dev/null; then
        run_deployment_tests
    fi
    
    # Show rollback instructions
    show_rollback_instructions
    
    echo -e "${GREEN}🎉 Full deployment completed successfully!${NC}"
}

# Run main function
main "$@"