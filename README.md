# Bhawani Property Management System - Backend Setup Guide

## विशेषताएं (Features)

### Core Features

1. **Multi-tenant Architecture** - Master DB + Client DBs
2. **Hindi Unicode Support** - पूर्ण हिंदी समर्थन
3. **Property Management** - संपत्ति प्रबंधन
4. **Plot Management with Maps** - नक्शा आधारित प्लॉट प्रबंधन
5. **Buyer/Seller/Agent Management** - खरीदार/विक्रेता/एजेंट
6. **Agreement Management** - अनुबंध प्रबंधन
7. **Ledger & Accounting** - खाता बही
8. **Notifications & Reminders** - सूचनाएं और रिमाइंडर
9. **Follow-up System** - फॉलोअप प्रणाली
10. **Reports & Printing** - रिपोर्ट और प्रिंटिंग

## System Requirements

- Node.js >= 20.0.0 < 21.0.0
- NPM >= 10.2.3
- MySQL 8.0+
- TypeScript 5.1+

## Installation Steps

### IMPORTANT: Fix "Cannot find module" Errors

**यदि आपको "Cannot find module" errors मिल रही हैं, तो यह करें:**

#### Quick Fix (अनुशंसित):

```bash
# Windows
fix-errors.bat

# Linux/Mac
chmod +x fix-errors.sh
./fix-errors.sh
```

#### Manual Fix:

```bash
# Project folder में जाएं
cd bhawani-backend-setup

# सभी dependencies install करें (2-3 मिनट लगेंगे)
npm install

# Verify installation
npm list @nestjs/common
npm list @types/node
```

**विस्तृत troubleshooting के लिए देखें:** `TROUBLESHOOTING-HINDI.md`

---

### 1. Prerequisites Installation

```bash
# Check Node.js version
node --version  # Should be 20.x.x

# Check NPM version
npm --version  # Should be >= 10.2.3
```

### 2. Extract और Navigate

```bash
# Zip file extract करें
unzip bhawani-backend-setup.zip

# Project directory में जाएं
cd bhawani-backend-setup
```

### 3. Install Dependencies (सबसे महत्वपूर्ण Step!)

```bash
# एक ही command से सब कुछ install हो जाएगा
npm install

# Installation verify करें
ls -la node_modules/@nestjs/  # Linux/Mac
dir node_modules\@nestjs\     # Windows
```

**Note:** यह step **अनिवार्य** है! इसके बिना कोई भी file काम नहीं करेगी।

## Database Design

### Master Database (master_db)

- clients (क्लाइंट)
- super_users (सुपर यूजर)
- subscriptions (सदस्यता)
- licenses (लाइसेंस)

### Client Databases (client\_{id}\_db)

Each client has their own database with:

- users (उपयोगकर्ता)
- properties (संपत्ति)
- plots (प्लॉट)
- buyers (खरीदार)
- sellers (विक्रेता)
- agents (एजेंट)
- agreements (अनुबंध)
- ledger_entries (खाता प्रविष्टियां)
- notifications (सूचनाएं)
- reminders (रिमाइंडर)
- followups (फॉलोअप)
- cities (शहर)
- tehsils (तहसील)
- map_images (नक्शा छवियां)
- map_plots (नक्शा प्लॉट)

## Environment Configuration

Create `.env` file:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Master Database
MASTER_DB_HOST=localhost
MASTER_DB_PORT=3306
MASTER_DB_USERNAME=root
MASTER_DB_PASSWORD=your_password
MASTER_DB_DATABASE=master_db
MASTER_DB_CHARSET=utf8mb4
MASTER_DB_COLLATE=utf8mb4_unicode_ci

# Client Database Template
CLIENT_DB_HOST=localhost
CLIENT_DB_PORT=3306
CLIENT_DB_USERNAME=root
CLIENT_DB_PASSWORD=your_password
CLIENT_DB_CHARSET=utf8mb4
CLIENT_DB_COLLATE=utf8mb4_unicode_ci

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=30d

# AWS S3 (for map images and documents)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=bhawani-property

# Session
SESSION_SECRET=your-session-secret-key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DESTINATION=./uploads
```

## Project Structure

```
bhawani-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── utils/
│   ├── config/
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   ├── database/
│   │   ├── master/
│   │   │   └── models/
│   │   ├── client/
│   │   │   └── models/
│   │   └── database.module.ts
│   ├── auth/
│   ├── users/
│   ├── properties/
│   ├── plots/
│   ├── buyers/
│   ├── sellers/
│   ├── agents/
│   ├── agreements/
│   ├── ledger/
│   ├── notifications/
│   └── reports/
├── uploads/
├── .env
├── package.json
└── tsconfig.json
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## API Documentation

Once running, visit:

- Swagger UI: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/v1/health

## Key Features Implementation

### 1. Multi-tenant Database Switching

- Automatic client DB selection based on JWT token
- Super user can access all client databases
- Master DB for centralized management

### 2. Hindi Unicode Support

- All databases use utf8mb4 charset
- All text fields support Devanagari script
- Google Input Hindi compatible

### 3. Map/Naksha Management

- Image upload to S3/local storage
- Plot coordinates storage
- Dynamic plot selection and zoom
- Runtime plot highlighting and printing

### 4. Plot Management

- विभिन्न आकार (Different sizes)
- प्लॉट नंबर (Plot numbers)
- स्थिति (Status): उपलब्ध/बुक/बेचा गया
- नक्शे से लिंक (Map linking)

### 5. Document Management

- Agreement typing and printing
- PDF generation with Hindi support
- Template system for documents

## Next Steps

1. Copy all files from this setup to your project
2. Update .env with your database credentials
3. Run migrations to create tables
4. Start development server
5. Test API endpoints

## Support

For issues or questions, refer to:

- NestJS Documentation: https://docs.nestjs.com
- Sequelize Documentation: https://sequelize.org
- MySQL UTF-8 Setup: https://dev.mysql.com/doc/refman/8.0/en/charset-unicode.html
