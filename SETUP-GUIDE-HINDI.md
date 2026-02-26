# भवानी प्रॉपर्टी मैनेजमेंट सिस्टम - सेटअप गाइड
# Bhawani Property Management System - Setup Guide

## पूर्व आवश्यकताएं (Prerequisites)

### 1. सॉफ्टवेयर इंस्टॉलेशन (Software Installation)

#### Node.js 20.x
```bash
# Windows/Linux/Mac के लिए डाउनलोड करें
# Download for Windows/Linux/Mac from:
https://nodejs.org/download/release/latest-v20.x/

# वर्जन चेक करें (Check version)
node --version  # Output: v20.x.x

# NPM वर्जन चेक करें (Check NPM version)
npm --version   # Output: 10.x.x या उससे अधिक (or higher)
```

#### MySQL 8.0+
```bash
# MySQL डाउनलोड करें (Download MySQL)
https://dev.mysql.com/downloads/mysql/

# MySQL इंस्टॉल करने के बाद, सर्विस शुरू करें
# After installing MySQL, start the service:

# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
# या (or)
sudo service mysql start

# MySQL में लॉगिन करें (Login to MySQL)
mysql -u root -p
```

## स्टेप 1: प्रोजेक्ट सेटअप (Step 1: Project Setup)

### Option A: इंस्टॉलेशन स्क्रिप्ट का उपयोग (Using Installation Script)

```bash
# स्क्रिप्ट को executable बनाएं (Make script executable)
chmod +x install.sh

# स्क्रिप्ट चलाएं (Run the script)
./install.sh
```

### Option B: मैनुअल इंस्टॉलेशन (Manual Installation)

```bash
# 1. NestJS CLI इंस्टॉल करें (Install NestJS CLI)
npm install -g @nestjs/cli

# 2. नया प्रोजेक्ट बनाएं (Create new project)
nest new bhawani-backend
cd bhawani-backend

# 3. Dependencies इंस्टॉल करें (Install dependencies)
npm install @nestjs/sequelize sequelize sequelize-typescript mysql2 \
    @nestjs/config @nestjs/jwt @nestjs/swagger \
    class-validator class-transformer \
    @nestjs/schedule @nestjs/event-emitter \
    @nestjs/platform-socket.io @nestjs/websockets \
    nestjs-cls uuid date-fns \
    express-session aws-sdk axios @nestjs/axios

# 4. Dev dependencies इंस्टॉल करें (Install dev dependencies)
npm install --save-dev @types/express @types/node @types/sequelize \
    @types/express-session @types/uuid @types/multer \
    eslint-plugin-unused-imports

# 5. फोल्डर स्ट्रक्चर बनाएं (Create folder structure)
mkdir -p src/config
mkdir -p src/common/{decorators,guards,interceptors,filters,utils}
mkdir -p src/database/master/models
mkdir -p src/database/client/models
mkdir -p uploads
```

## स्टेप 2: डेटाबेस सेटअप (Step 2: Database Setup)

### MySQL में UTF-8 सपोर्ट एनेबल करें (Enable UTF-8 Support in MySQL)

```bash
# MySQL कॉन्फ़िगरेशन फाइल खोलें (Open MySQL configuration file)
# Windows: C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
# Linux: /etc/mysql/my.cnf
# Mac: /usr/local/etc/my.cnf

# निम्नलिखित लाइनें जोड़ें (Add the following lines):
```

```ini
[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4

[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init-connect = 'SET NAMES utf8mb4'
```

```bash
# MySQL सर्विस रीस्टार्ट करें (Restart MySQL service)
# Windows
net stop MySQL80
net start MySQL80

# Linux/Mac
sudo systemctl restart mysql
# या (or)
sudo service mysql restart
```

### डेटाबेस बनाएं (Create Databases)

```bash
# MySQL में लॉगिन करें (Login to MySQL)
mysql -u root -p

# Database setup script चलाएं (Run database setup script)
SOURCE /path/to/database-setup.sql;

# या मैनुअली कमांड चलाएं (Or run commands manually):
```

```sql
-- Master Database बनाएं (Create Master Database)
CREATE DATABASE master_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Demo Client Database बनाएं (Create Demo Client Database)
CREATE DATABASE client_demo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- डेटाबेस देखें (View databases)
SHOW DATABASES;

-- बाहर निकलें (Exit)
EXIT;
```

## स्टेप 3: प्रोजेक्ट फाइलें कॉपी करें (Step 3: Copy Project Files)

```bash
# सेटअप फोल्डर से फाइलें कॉपी करें (Copy files from setup folder)

# 1. Main files
cp bhawani-backend-setup/src/main.ts src/
cp bhawani-backend-setup/src/app.module.ts src/

# 2. Configuration
cp -r bhawani-backend-setup/src/config/ src/

# 3. Database module and models
cp -r bhawani-backend-setup/src/database/ src/

# 4. Environment file
cp bhawani-backend-setup/.env.example .env
```

## स्टेप 4: Environment Configuration

### .env फाइल अपडेट करें (Update .env file)

```bash
# .env फाइल खोलें और अपडेट करें (Open and update .env file)
nano .env
# या (or)
vim .env
# या (or) अपने पसंदीदा एडिटर में खोलें
```

```env
# डेटाबेस क्रेडेंशियल्स अपडेट करें (Update database credentials)
MASTER_DB_PASSWORD=your_actual_mysql_password
CLIENT_DB_PASSWORD=your_actual_mysql_password

# JWT सीक्रेट बदलें (Change JWT secrets - important for security!)
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-also-very-long
SESSION_SECRET=your-session-secret-key
```

## स्टेप 5: एप्लिकेशन शुरू करें (Step 5: Start the Application)

```bash
# Development mode में शुरू करें (Start in development mode)
npm run start:dev

# या Production build के लिए (Or for production build)
npm run build
npm run start:prod
```

## स्टेप 6: वेरिफिकेशन (Step 6: Verification)

### API Documentation देखें (View API Documentation)
```bash
# ब्राउज़र में खोलें (Open in browser):
http://localhost:3000/api/docs
```

### हिंदी सपोर्ट टेस्ट करें (Test Hindi Support)
```bash
# MySQL में टेस्ट करें (Test in MySQL)
mysql -u root -p

USE client_demo_db;

# हिंदी डेटा इन्सर्ट करें (Insert Hindi data)
INSERT INTO buyers (id, buyer_code, name, mobile, city, status, created_at, updated_at) 
VALUES (UUID(), 'TEST001', 'राजेश कुमार शर्मा', '9876543210', 'इंदौर', 'active', NOW(), NOW());

# डेटा देखें (View data)
SELECT * FROM buyers;

# बाहर निकलें (Exit)
EXIT;
```

## Common Issues और Solutions

### Issue 1: MySQL Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:**
```bash
# MySQL password रीसेट करें (Reset MySQL password)
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Issue 2: Hindi Characters Showing as ????
```
हिंदी टेक्स्ट ???? के रूप में दिखाई देता है
```
**Solution:**
```sql
-- Database charset चेक करें (Check database charset)
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';

-- अगर utf8mb4 नहीं है तो बदलें (If not utf8mb4, change it)
ALTER DATABASE client_demo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue 3: Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# .env फाइल में पोर्ट बदलें (Change port in .env)
PORT=3001

# या चल रहे प्रोसेस को बंद करें (Or kill the running process)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## अगले कदम (Next Steps)

1. **Authentication Module बनाएं (Create Authentication Module)**
   ```bash
   nest g module auth
   nest g service auth
   nest g controller auth
   ```

2. **Properties Module बनाएं (Create Properties Module)**
   ```bash
   nest g resource properties
   ```

3. **File Upload सेटअप करें (Setup File Upload)**
   - AWS S3 या Local Storage configure करें
   - Map images के लिए endpoint बनाएं

4. **Frontend Integration**
   - React/Next.js के साथ connect करें
   - Map viewer component बनाएं

## उपयोगी कमांड्स (Useful Commands)

```bash
# Development server
npm run start:dev

# Production build
npm run build
npm run start:prod

# Linting
npm run lint

# Testing
npm run test

# Database migration (future)
npm run migration:run
npm run migration:revert

# Generate new module
nest g module <name>

# Generate new service
nest g service <name>

# Generate new controller
nest g controller <name>

# Generate complete resource (CRUD)
nest g resource <name>
```

## सपोर्ट (Support)

किसी भी समस्या के लिए:
- GitHub Issues: [repository-link]
- Email: support@bhawani-property.com
- Documentation: http://localhost:3000/api/docs

---

**नोट:** यह सेटअप गाइड development environment के लिए है। Production deployment के लिए अतिरिक्त सुरक्षा और optimization की जरूरत होगी।

**Note:** This setup guide is for development environment. Production deployment will require additional security and optimization measures.
