#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     Fixing Installation Errors - त्रुटियां ठीक कर रहे हैं       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Checking if npm is installed...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js 20.x from https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm is installed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Installing all dependencies...${NC}"
echo "This may take 2-3 minutes..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 3: Checking node_modules...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules folder created${NC}"
else
    echo -e "${RED}✗ node_modules folder not found${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 4: Verifying critical packages...${NC}"
PACKAGES=("@nestjs/common" "@nestjs/core" "@nestjs/config" "sequelize-typescript" "@types/node")
for pkg in "${PACKAGES[@]}"; do
    if [ -d "node_modules/$pkg" ]; then
        echo -e "${GREEN}✓ $pkg installed${NC}"
    else
        echo -e "${RED}✗ $pkg not found${NC}"
    fi
done
echo ""

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✓ All errors fixed!                                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify .env file is configured"
echo "2. Setup MySQL databases: ${GREEN}mysql -u root -p < database-setup.sql${NC}"
echo "3. Start development server: ${GREEN}npm run start:dev${NC}"
echo ""
