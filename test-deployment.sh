#!/bin/bash

echo "🧪 BooksBoardroom Deployment Test Script"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FIREBASE_PROJECT="booksboardroom"
TEST_URL="https://$FIREBASE_PROJECT.web.app"

# Function to test command availability
test_command() {
    local cmd=$1
    local name=${2:-$1}
    
    if command -v "$cmd" &> /dev/null; then
        echo -e "${GREEN}✅ $name is available${NC}"
        return 0
    else
        echo -e "${RED}❌ $name is not available${NC}"
        return 1
    fi
}

# Function to test Firebase CLI
test_firebase_cli() {
    echo -e "${BLUE}🔥 Testing Firebase CLI...${NC}"
    
    if ! test_command "firebase" "Firebase CLI"; then
        return 1
    fi
    
    echo -e "${BLUE}📋 Firebase CLI version:${NC}"
    firebase --version
    
    echo -e "${BLUE}🔐 Testing Firebase authentication...${NC}"
    if firebase projects:list &>/dev/null; then
        echo -e "${GREEN}✅ Firebase authentication working${NC}"
        
        echo -e "${BLUE}📊 Available projects:${NC}"
        firebase projects:list
        
        # Test project selection
        if firebase use --project "$FIREBASE_PROJECT" &>/dev/null; then
            echo -e "${GREEN}✅ Project '$FIREBASE_PROJECT' accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  Project '$FIREBASE_PROJECT' not found or inaccessible${NC}"
        fi
    else
        echo -e "${RED}❌ Firebase authentication failed${NC}"
        echo -e "${YELLOW}💡 Run 'firebase login --reauth' to fix${NC}"
        return 1
    fi
    
    return 0
}

# Function to test project structure
test_project_structure() {
    echo -e "${BLUE}📁 Testing project structure...${NC}"
    
    # Test essential files
    local files=(
        "package.json"
        "firebase.json"
        "firestore.rules"
        "storage.rules"
        "firestore.indexes.json"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅ $file exists${NC}"
        else
            echo -e "${YELLOW}⚠️  $file missing${NC}"
        fi
    done
    
    # Test source directories
    local dirs=(
        "src"
        "public"
        "OSX-template-financial"
    )
    
    for dir in "${dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "${GREEN}✅ $dir directory exists${NC}"
        else
            echo -e "${YELLOW}⚠️  $dir directory missing${NC}"
        fi
    done
    
    # Test HTML files
    if [ -f "booksboardroom-tracker.html" ]; then
        echo -e "${GREEN}✅ Project tracker HTML exists${NC}"
    else
        echo -e "${YELLOW}⚠️  Project tracker HTML missing${NC}"
    fi
}

# Function to test build process
test_build_process() {
    echo -e "${BLUE}🏗️  Testing build process...${NC}"
    
    # Test Node.js and npm
    if ! test_command "node" "Node.js"; then
        return 1
    fi
    
    if ! test_command "npm" "npm"; then
        return 1
    fi
    
    echo -e "${BLUE}📦 Node.js version:${NC}"
    node --version
    
    echo -e "${BLUE}📦 npm version:${NC}"
    npm --version
    
    # Test if package.json has required scripts
    if [ -f "package.json" ]; then
        if grep -q '"build"' package.json; then
            echo -e "${GREEN}✅ Build script found in package.json${NC}"
        else
            echo -e "${YELLOW}⚠️  No build script in package.json${NC}"
        fi
        
        if grep -q '"dev"' package.json; then
            echo -e "${GREEN}✅ Dev script found in package.json${NC}"
        else
            echo -e "${YELLOW}⚠️  No dev script in package.json${NC}"
        fi
    fi
    
    # Test if node_modules exists
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Dependencies not installed - run 'npm install'${NC}"
    fi
}

# Function to test deployment scripts
test_deployment_scripts() {
    echo -e "${BLUE}📜 Testing deployment scripts...${NC}"
    
    local scripts=(
        "deploy-tracker.sh"
        "deploy-full.sh"
        "setup-firebase.sh"
        "backup-deployment.sh"
        "test-deployment.sh"
    )
    
    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                echo -e "${GREEN}✅ $script exists and is executable${NC}"
            else
                echo -e "${YELLOW}⚠️  $script exists but not executable${NC}"
            fi
        else
            echo -e "${RED}❌ $script missing${NC}"
        fi
    done
}

# Function to test Firebase configuration
test_firebase_config() {
    echo -e "${BLUE}⚙️  Testing Firebase configuration...${NC}"
    
    # Test firebase.json
    if [ -f "firebase.json" ]; then
        if jq empty firebase.json &>/dev/null; then
            echo -e "${GREEN}✅ firebase.json is valid JSON${NC}"
            
            # Check for required sections
            if jq -e '.hosting' firebase.json &>/dev/null; then
                echo -e "${GREEN}✅ Hosting configuration found${NC}"
            else
                echo -e "${YELLOW}⚠️  No hosting configuration${NC}"
            fi
            
            if jq -e '.firestore' firebase.json &>/dev/null; then
                echo -e "${GREEN}✅ Firestore configuration found${NC}"
            else
                echo -e "${YELLOW}⚠️  No Firestore configuration${NC}"
            fi
            
            if jq -e '.storage' firebase.json &>/dev/null; then
                echo -e "${GREEN}✅ Storage configuration found${NC}"
            else
                echo -e "${YELLOW}⚠️  No Storage configuration${NC}"
            fi
        else
            echo -e "${RED}❌ firebase.json is invalid JSON${NC}"
        fi
    else
        echo -e "${RED}❌ firebase.json missing${NC}"
    fi
    
    # Test .firebaserc
    if [ -f ".firebaserc" ]; then
        echo -e "${GREEN}✅ .firebaserc exists${NC}"
        if grep -q "$FIREBASE_PROJECT" .firebaserc; then
            echo -e "${GREEN}✅ Project ID found in .firebaserc${NC}"
        else
            echo -e "${YELLOW}⚠️  Project ID not found in .firebaserc${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  .firebaserc missing${NC}"
    fi
}

# Function to test live deployment (if URL is accessible)
test_live_deployment() {
    echo -e "${BLUE}🌐 Testing live deployment...${NC}"
    
    if ! test_command "curl" "curl"; then
        echo -e "${YELLOW}⚠️  curl not available, skipping live tests${NC}"
        return 0
    fi
    
    echo -e "${BLUE}🔍 Testing main URL: $TEST_URL${NC}"
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" || echo "000")
    
    case "$status_code" in
        "200")
            echo -e "${GREEN}✅ Main site is live and accessible${NC}"
            ;;
        "404")
            echo -e "${YELLOW}⚠️  Site returns 404 - may not be deployed yet${NC}"
            ;;
        "000")
            echo -e "${YELLOW}⚠️  Cannot connect to site - may not be deployed${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠️  Site returns status code: $status_code${NC}"
            ;;
    esac
    
    # Test specific pages
    local pages=(
        "/tracker.html"
        "/operations.html"
    )
    
    for page in "${pages[@]}"; do
        local page_status=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL$page" || echo "000")
        case "$page_status" in
            "200")
                echo -e "${GREEN}✅ $page is accessible${NC}"
                ;;
            "404")
                echo -e "${YELLOW}⚠️  $page returns 404${NC}"
                ;;
            *)
                echo -e "${YELLOW}⚠️  $page returns status: $page_status${NC}"
                ;;
        esac
    done
}

# Function to show recommendations
show_recommendations() {
    echo ""
    echo -e "${BLUE}💡 Recommendations:${NC}"
    
    # Check if Firebase CLI needs login
    if ! firebase projects:list &>/dev/null; then
        echo -e "${YELLOW}🔑 Run: firebase login --reauth${NC}"
    fi
    
    # Check if dependencies need installation
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Run: npm install${NC}"
    fi
    
    # Check if project needs to be built
    if [ ! -d "dist" ]; then
        echo -e "${YELLOW}🏗️  Run: npm run build${NC}"
    fi
    
    # Check deployment readiness
    if [ -f "firebase.json" ] && [ -d "dist" ] && firebase projects:list &>/dev/null; then
        echo -e "${GREEN}🚀 Ready for deployment! Run: ./deploy-tracker.sh or ./deploy-full.sh${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🧪 Running comprehensive deployment tests...${NC}"
    echo ""
    
    # Run all tests
    test_firebase_cli
    echo ""
    
    test_project_structure
    echo ""
    
    test_build_process
    echo ""
    
    test_deployment_scripts
    echo ""
    
    test_firebase_config
    echo ""
    
    test_live_deployment
    echo ""
    
    show_recommendations
    
    echo ""
    echo -e "${GREEN}🎉 Deployment test completed!${NC}"
}

# Handle command line arguments
case "${1:-}" in
    "firebase")
        test_firebase_cli
        ;;
    "structure")
        test_project_structure
        ;;
    "build")
        test_build_process
        ;;
    "scripts")
        test_deployment_scripts
        ;;
    "config")
        test_firebase_config
        ;;
    "live")
        test_live_deployment
        ;;
    *)
        main "$@"
        ;;
esac