#!/bin/bash

echo "💾 BooksBoardroom Deployment Backup Script"
echo "=========================================="
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
BACKUP_ROOT="deployment-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"

echo -e "${BLUE}📁 Project Directory: $PROJECT_DIR${NC}"
echo -e "${BLUE}💾 Backup Directory: $BACKUP_DIR${NC}"
echo -e "${BLUE}🕒 Timestamp: $TIMESTAMP${NC}"
echo ""

# Function to create backup directory structure
create_backup_structure() {
    echo -e "${BLUE}📁 Creating backup directory structure...${NC}"
    
    mkdir -p "$BACKUP_DIR"/{source,builds,configs,firebase-state,docs}
    
    echo -e "${GREEN}✅ Backup structure created${NC}"
}

# Function to backup source code
backup_source() {
    echo -e "${BLUE}💾 Backing up source code...${NC}"
    
    # Backup main src directory
    if [ -d "src" ]; then
        cp -r src "$BACKUP_DIR/source/"
        echo -e "${GREEN}✅ Main src backed up${NC}"
    fi
    
    # Backup OSX template src
    if [ -d "OSX-template-financial/src" ]; then
        cp -r OSX-template-financial/src "$BACKUP_DIR/source/osx-template-src"
        echo -e "${GREEN}✅ OSX template src backed up${NC}"
    fi
    
    # Backup HTML files
    cp *.html "$BACKUP_DIR/source/" 2>/dev/null && echo -e "${GREEN}✅ HTML files backed up${NC}"
    
    # Backup package.json files
    cp package.json "$BACKUP_DIR/source/" 2>/dev/null && echo -e "${GREEN}✅ Main package.json backed up${NC}"
    cp OSX-template-financial/package.json "$BACKUP_DIR/source/osx-package.json" 2>/dev/null && echo -e "${GREEN}✅ OSX package.json backed up${NC}"
}

# Function to backup builds
backup_builds() {
    echo -e "${BLUE}🏗️  Backing up build artifacts...${NC}"
    
    # Backup main dist
    if [ -d "dist" ]; then
        cp -r dist "$BACKUP_DIR/builds/main-dist"
        echo -e "${GREEN}✅ Main build backed up${NC}"
    fi
    
    # Backup OSX template dist
    if [ -d "OSX-template-financial/dist" ]; then
        cp -r OSX-template-financial/dist "$BACKUP_DIR/builds/osx-dist"
        echo -e "${GREEN}✅ OSX template build backed up${NC}"
    fi
    
    # Backup node_modules info (package-lock.json)
    cp package-lock.json "$BACKUP_DIR/builds/" 2>/dev/null && echo -e "${GREEN}✅ Package lock backed up${NC}"
    cp OSX-template-financial/package-lock.json "$BACKUP_DIR/builds/osx-package-lock.json" 2>/dev/null && echo -e "${GREEN}✅ OSX package lock backed up${NC}"
}

# Function to backup configuration files
backup_configs() {
    echo -e "${BLUE}⚙️  Backing up configuration files...${NC}"
    
    # Firebase configs
    for config in firebase.json .firebaserc firestore.rules firestore.indexes.json storage.rules; do
        if [ -f "$config" ]; then
            cp "$config" "$BACKUP_DIR/configs/"
            echo -e "${GREEN}✅ $config backed up${NC}"
        fi
    done
    
    # OSX template configs
    for config in firebase.json firestore.rules firestore.indexes.json; do
        if [ -f "OSX-template-financial/$config" ]; then
            cp "OSX-template-financial/$config" "$BACKUP_DIR/configs/osx-$config"
            echo -e "${GREEN}✅ OSX $config backed up${NC}"
        fi
    done
    
    # TypeScript and build configs
    for config in tsconfig.json vite.config.ts tailwind.config.ts; do
        if [ -f "$config" ]; then
            cp "$config" "$BACKUP_DIR/configs/"
            echo -e "${GREEN}✅ $config backed up${NC}"
        fi
    done
    
    # OSX template build configs
    for config in tsconfig.json vite.config.ts tailwind.config.ts; do
        if [ -f "OSX-template-financial/$config" ]; then
            cp "OSX-template-financial/$config" "$BACKUP_DIR/configs/osx-$config"
            echo -e "${GREEN}✅ OSX $config backed up${NC}"
        fi
    done
}

# Function to backup Firebase deployment state
backup_firebase_state() {
    echo -e "${BLUE}🔥 Backing up Firebase deployment state...${NC}"
    
    # Check if Firebase CLI is available and authenticated
    if command -v firebase &> /dev/null && firebase projects:list &>/dev/null; then
        # Get current project
        firebase use > "$BACKUP_DIR/firebase-state/current-project.txt" 2>&1
        
        # Get hosting releases (last 5)
        firebase hosting:channel:list --project "$FIREBASE_PROJECT" > "$BACKUP_DIR/firebase-state/hosting-channels.txt" 2>&1
        
        # Get Firestore indexes
        firebase firestore:indexes --project "$FIREBASE_PROJECT" > "$BACKUP_DIR/firebase-state/firestore-indexes.txt" 2>&1
        
        # Get deployed functions (if any)
        firebase functions:list --project "$FIREBASE_PROJECT" > "$BACKUP_DIR/firebase-state/functions.txt" 2>&1
        
        echo -e "${GREEN}✅ Firebase state backed up${NC}"
    else
        echo -e "${YELLOW}⚠️  Firebase CLI not available or not authenticated${NC}"
        echo "Firebase CLI not available" > "$BACKUP_DIR/firebase-state/status.txt"
    fi
}

# Function to backup documentation
backup_docs() {
    echo -e "${BLUE}📚 Backing up documentation...${NC}"
    
    # Backup markdown files
    cp *.md "$BACKUP_DIR/docs/" 2>/dev/null && echo -e "${GREEN}✅ Root markdown files backed up${NC}"
    
    # Backup OSX template docs
    if [ -d "OSX-template-financial" ]; then
        cp OSX-template-financial/*.md "$BACKUP_DIR/docs/" 2>/dev/null && echo -e "${GREEN}✅ OSX template docs backed up${NC}"
    fi
    
    # Backup docs directory if it exists
    if [ -d "docs" ]; then
        cp -r docs "$BACKUP_DIR/docs/docs-folder"
        echo -e "${GREEN}✅ Docs folder backed up${NC}"
    fi
}

# Function to create backup manifest
create_backup_manifest() {
    echo -e "${BLUE}📋 Creating backup manifest...${NC}"
    
    cat > "$BACKUP_DIR/BACKUP_MANIFEST.md" << EOF
# BooksBoardroom Deployment Backup

**Backup Created:** $(date)
**Project:** $FIREBASE_PROJECT
**Backup ID:** $TIMESTAMP

## Backup Contents

### Source Code
- Main project source code (\`src/\`)
- OSX template source code (\`OSX-template-financial/src/\`)
- HTML files
- Package configuration files

### Build Artifacts
- Main project build (\`dist/\`)
- OSX template build (\`OSX-template-financial/dist/\`)
- Package lock files

### Configuration Files
- Firebase configuration (\`firebase.json\`, \`.firebaserc\`)
- Firestore rules and indexes
- Storage rules
- TypeScript configuration
- Vite configuration
- Tailwind configuration

### Firebase State
- Current project configuration
- Hosting channels
- Firestore indexes
- Functions list

### Documentation
- All markdown files
- Documentation folders

## Restoration Instructions

### Quick Restore
To restore this backup:
\`\`\`bash
# Restore source code
cp -r $BACKUP_DIR/source/* ./

# Restore configurations
cp -r $BACKUP_DIR/configs/* ./

# Restore builds (if needed)
cp -r $BACKUP_DIR/builds/main-dist ./dist
cp -r $BACKUP_DIR/builds/osx-dist ./OSX-template-financial/dist
\`\`\`

### Firebase Restore
\`\`\`bash
# Set project
firebase use $FIREBASE_PROJECT

# Deploy from backup
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only storage
\`\`\`

### Build from Source
\`\`\`bash
# Rebuild main project
npm install
npm run build

# Rebuild OSX template
cd OSX-template-financial
npm install
npm run build
cd ..
\`\`\`

## Backup Statistics
- **Total Size:** $(du -sh "$BACKUP_DIR" | cut -f1)
- **Files Backed Up:** $(find "$BACKUP_DIR" -type f | wc -l)
- **Directories:** $(find "$BACKUP_DIR" -type d | wc -l)

EOF

    # Add file listing
    echo "## File Listing" >> "$BACKUP_DIR/BACKUP_MANIFEST.md"
    echo '```' >> "$BACKUP_DIR/BACKUP_MANIFEST.md"
    find "$BACKUP_DIR" -type f | sort >> "$BACKUP_DIR/BACKUP_MANIFEST.md"
    echo '```' >> "$BACKUP_DIR/BACKUP_MANIFEST.md"
    
    echo -e "${GREEN}✅ Backup manifest created${NC}"
}

# Function to compress backup
compress_backup() {
    echo -e "${BLUE}🗜️  Compressing backup...${NC}"
    
    cd "$BACKUP_ROOT"
    tar -czf "${TIMESTAMP}_booksboardroom_backup.tar.gz" "$TIMESTAMP"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup compressed: ${TIMESTAMP}_booksboardroom_backup.tar.gz${NC}"
        echo -e "${GREEN}📊 Compressed size: $(du -sh "${TIMESTAMP}_booksboardroom_backup.tar.gz" | cut -f1)${NC}"
    else
        echo -e "${YELLOW}⚠️  Compression failed, keeping uncompressed backup${NC}"
    fi
    
    cd "$PROJECT_DIR"
}

# Function to cleanup old backups
cleanup_old_backups() {
    echo -e "${BLUE}🧹 Cleaning up old backups...${NC}"
    
    # Keep last 5 backups
    cd "$BACKUP_ROOT" 2>/dev/null
    
    # Count backups
    backup_count=$(ls -1 | grep -E '^[0-9]{8}_[0-9]{6}$' | wc -l)
    
    if [ "$backup_count" -gt 5 ]; then
        echo -e "${YELLOW}🗑️  Found $backup_count backups, keeping newest 5${NC}"
        
        # Remove oldest backups
        ls -1 | grep -E '^[0-9]{8}_[0-9]{6}$' | sort | head -n -5 | xargs rm -rf
        
        # Remove oldest compressed backups
        ls -1 *.tar.gz 2>/dev/null | sort | head -n -5 | xargs rm -f 2>/dev/null
        
        echo -e "${GREEN}✅ Old backups cleaned up${NC}"
    else
        echo -e "${GREEN}✅ No cleanup needed (${backup_count} backups)${NC}"
    fi
    
    cd "$PROJECT_DIR"
}

# Function to show backup summary
show_backup_summary() {
    echo ""
    echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📊 Backup Summary:${NC}"
    echo -e "   ${YELLOW}Backup ID:${NC} $TIMESTAMP"
    echo -e "   ${YELLOW}Location:${NC} $BACKUP_DIR"
    echo -e "   ${YELLOW}Size:${NC} $(du -sh "$BACKUP_DIR" | cut -f1)"
    echo -e "   ${YELLOW}Files:${NC} $(find "$BACKUP_DIR" -type f | wc -l)"
    echo ""
    echo -e "${BLUE}🔗 Quick Commands:${NC}"
    echo -e "   ${YELLOW}View manifest:${NC} cat \"$BACKUP_DIR/BACKUP_MANIFEST.md\""
    echo -e "   ${YELLOW}Restore backup:${NC} cp -r \"$BACKUP_DIR/source\"/* ./"
    echo -e "   ${YELLOW}List backups:${NC} ls -la \"$BACKUP_ROOT\""
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}💾 Starting comprehensive backup...${NC}"
    
    # Create backup structure
    create_backup_structure
    
    # Perform backups
    backup_source
    backup_builds
    backup_configs
    backup_firebase_state
    backup_docs
    
    # Create manifest
    create_backup_manifest
    
    # Compress backup
    read -p "Compress backup? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        compress_backup
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Show summary
    show_backup_summary
}

# Handle command line arguments
case "${1:-}" in
    "cleanup")
        cleanup_old_backups
        ;;
    "list")
        echo -e "${BLUE}📋 Available backups:${NC}"
        ls -la "$BACKUP_ROOT" 2>/dev/null || echo "No backups found"
        ;;
    "restore")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Please specify backup ID${NC}"
            echo -e "${YELLOW}Usage: $0 restore TIMESTAMP${NC}"
            exit 1
        fi
        
        RESTORE_DIR="$BACKUP_ROOT/$2"
        if [ -d "$RESTORE_DIR" ]; then
            echo -e "${BLUE}🔄 Restoring backup $2...${NC}"
            cp -r "$RESTORE_DIR/source"/* ./
            cp -r "$RESTORE_DIR/configs"/* ./
            echo -e "${GREEN}✅ Backup restored${NC}"
        else
            echo -e "${RED}❌ Backup $2 not found${NC}"
        fi
        ;;
    *)
        main "$@"
        ;;
esac