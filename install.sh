#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                                 ║"
echo "║     भवानी प्रॉपर्टी मैनेजमेंट सिस्टम                         ║"
echo "║     Bhawani Property Management System                         ║"
echo "║     Backend Installation Script                                ║"
echo "║                                                                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${YELLOW}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ] || [ "$NODE_VERSION" -ge 21 ]; then
    echo -e "${RED}Error: Node.js version must be >= 20.0.0 and < 21.0.0${NC}"
    echo -e "${RED}Current version: $(node -v)${NC}"
    echo -e "${YELLOW}Please install Node.js 20.x from https://nodejs.org${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Node.js version $(node -v) is compatible${NC}"
fi

# Check npm version
echo -e "${YELLOW}Checking npm version...${NC}"
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 10 ]; then
    echo -e "${RED}Error: npm version must be >= 10.2.3${NC}"
    echo -e "${RED}Current version: $(npm -v)${NC}"
    echo -e "${YELLOW}Run: npm install -g npm@latest${NC}"
    exit 1
else
    echo -e "${GREEN}✓ npm version $(npm -v) is compatible${NC}"
fi

# Install NestJS CLI globally
echo -e "${YELLOW}Installing NestJS CLI globally...${NC}"
npm install -g @nestjs/cli
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ NestJS CLI installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install NestJS CLI${NC}"
    exit 1
fi

# Create new NestJS project
echo -e "${YELLOW}Creating new NestJS project...${NC}"
read -p "Enter project name (default: bhawani-backend): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-bhawani-backend}

nest new $PROJECT_NAME
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Project created successfully${NC}"
else
    echo -e "${RED}✗ Failed to create project${NC}"
    exit 1
fi

cd $PROJECT_NAME

# Install core dependencies
echo -e "${YELLOW}Installing core dependencies...${NC}"
npm install @nestjs/sequelize sequelize sequelize-typescript mysql2 \
    @nestjs/config @nestjs/jwt @nestjs/swagger \
    class-validator class-transformer \
    @nestjs/schedule @nestjs/event-emitter \
    @nestjs/platform-socket.io @nestjs/websockets \
    nestjs-cls uuid date-fns \
    express-session aws-sdk axios @nestjs/axios

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Core dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install core dependencies${NC}"
    exit 1
fi

# Install dev dependencies
echo -e "${YELLOW}Installing dev dependencies...${NC}"
npm install --save-dev @types/express @types/node @types/sequelize \
    @types/express-session @types/uuid @types/multer \
    eslint-plugin-unused-imports

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dev dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dev dependencies${NC}"
    exit 1
fi

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p src/config
mkdir -p src/common/{decorators,guards,interceptors,filters,utils}
mkdir -p src/database/master/models
mkdir -p src/database/client/models
mkdir -p uploads

# Create .env file
echo -e "${YELLOW}Creating .env file...${NC}"
cat > .env << 'EOF'
# Application Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Master Database Configuration
MASTER_DB_HOST=localhost
MASTER_DB_PORT=3306
MASTER_DB_USERNAME=root
MASTER_DB_PASSWORD=your_password_here
MASTER_DB_DATABASE=master_db
MASTER_DB_CHARSET=utf8mb4
MASTER_DB_COLLATE=utf8mb4_unicode_ci

# Client Database Configuration
CLIENT_DB_HOST=localhost
CLIENT_DB_PORT=3306
CLIENT_DB_USERNAME=root
CLIENT_DB_PASSWORD=your_password_here
CLIENT_DB_CHARSET=utf8mb4
CLIENT_DB_COLLATE=utf8mb4_unicode_ci

# JWT Configuration
JWT_SECRET=change-this-to-a-super-secret-key-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=change-this-refresh-secret-key
JWT_REFRESH_EXPIRATION=30d

# Session Configuration
SESSION_SECRET=change-this-session-secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DESTINATION=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3001
EOF

echo -e "${GREEN}✓ .env file created${NC}"
echo -e "${YELLOW}⚠ Please update database credentials in .env file${NC}"

# Update package.json with correct configuration
echo -e "${YELLOW}Updating package.json...${NC}"
npm pkg set engines.node=">=20.0.0 <21.0.0"
npm pkg set engines.npm=">= 10.2.3"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                 ║${NC}"
echo -e "${GREEN}║     ✓ Installation completed successfully!                     ║${NC}"
echo -e "${GREEN}║                                                                 ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Update database credentials in .env file"
echo -e "2. Create MySQL databases:"
echo -e "   - Master database: master_db"
echo -e "3. Copy model files from setup folder to src/database/"
echo -e "4. Run: ${GREEN}npm run start:dev${NC}"
echo -e "5. Visit: ${GREEN}http://localhost:3000/api/docs${NC}"
echo ""
