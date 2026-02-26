# भवानी प्रॉपर्टी मैनेजमेंट सिस्टम - Master Database Models

## Overview
This directory contains Sequelize TypeScript models for the **Master Database** (`master_db`). The master database handles multi-tenant architecture, managing multiple clients, their subscriptions, and super admin users.

## Database Architecture

```
┌─────────────────────────────────────────────────────┐
│              MASTER DATABASE (master_db)            │
│                                                     │
│  ┌─────────┐      ┌──────────────┐   ┌──────────┐ │
│  │ Clients │──┬──→│ Subscriptions│   │  Super   │ │
│  └─────────┘  │   └──────────────┘   │  Users   │ │
│               │                       └──────────┘ │
│               └───────────────────────────┘         │
└─────────────────────────────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │  CLIENT DATABASES             │
        │  (client_abc_db, etc.)        │
        │                               │
        │  - Users                      │
        │  - Properties                 │
        │  - Plots                      │
        │  - Buyers                     │
        │  - Agreements                 │
        │  - Ledger Entries             │
        │  - Role & Permission System   │
        └──────────────────────────────┘
```

## Models

### 1. Client (`client.model.ts`)

Represents a tenant/client company in the multi-tenant system. Each client gets their own isolated database.

**Fields:**
- `id` (UUID) - Primary key
- `client_code` (VARCHAR, UNIQUE) - Unique client identifier code
- `company_name` (VARCHAR) - Company/organization name
- `contact_person` (VARCHAR) - Primary contact person name
- `email` (VARCHAR, UNIQUE) - Client email address
- `mobile` (VARCHAR) - Contact mobile number
- `address` (TEXT) - Full address
- `city` (VARCHAR) - City
- `state` (VARCHAR) - State
- `pincode` (VARCHAR) - PIN code
- `database_name` (VARCHAR) - Dedicated database name for this client
- `status` (ENUM) - Client status: 'active', 'inactive', 'suspended'
- `license_expiry_date` (DATE) - When the license expires
- `max_users` (INT) - Maximum users allowed
- `max_properties` (INT) - Maximum properties allowed
- `notes` (TEXT) - Additional notes

**Relationships:**
- Has many `SuperUser` (client-specific admins)
- Has many `Subscription` (subscription history)

**Example:**
```typescript
const client = await Client.create({
  id: uuidv4(),
  client_code: 'CLI_001',
  company_name: 'ABC प्रॉपर्टीज',
  email: 'info@abcproperties.com',
  mobile: '9876543210',
  database_name: 'client_abc_db',
  status: 'active',
  max_users: 10,
  max_properties: 50
});
```

---

### 2. SuperUser (`super-user.model.ts`)

System administrators and client-specific admins who can manage the platform.

**Fields:**
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Admin name
- `email` (VARCHAR, UNIQUE) - Email address
- `mobile` (VARCHAR, UNIQUE) - Mobile number
- `password` (VARCHAR) - Hashed password
- `role` (ENUM) - Role type:
  - `super_admin` - Full system access across all clients
  - `admin` - Client-specific admin
  - `support` - Support staff with limited access
- `status` (ENUM) - 'active' or 'inactive'
- `client_id` (UUID, nullable) - Associated client (null for system super_admins)
- `permissions` (JSON) - Custom permissions
- `last_login` (TIMESTAMP) - Last login time

**Relationships:**
- Belongs to `Client` (nullable - system admins don't belong to any client)

**Example:**
```typescript
// System Super Admin (no client_id)
const systemAdmin = await SuperUser.create({
  id: uuidv4(),
  name: 'System Admin',
  email: 'admin@bhavani.com',
  password: hashedPassword,
  role: 'super_admin',
  status: 'active',
  client_id: null
});

// Client-specific Admin
const clientAdmin = await SuperUser.create({
  id: uuidv4(),
  name: 'राजेश शर्मा',
  email: 'rajesh@abcproperties.com',
  password: hashedPassword,
  role: 'admin',
  status: 'active',
  client_id: 'client-uuid-here'
});
```

---

### 3. Subscription (`subscription.model.ts`)

Manages subscription plans and billing for each client.

**Fields:**
- `id` (UUID) - Primary key
- `client_id` (UUID) - Foreign key to Client
- `plan_name` (VARCHAR) - Plan name (Basic, Premium, Enterprise, etc.)
- `billing_cycle` (ENUM) - Billing frequency:
  - `monthly` - Monthly billing
  - `quarterly` - Quarterly billing
  - `yearly` - Annual billing
  - `lifetime` - One-time lifetime purchase
- `amount` (DECIMAL) - Subscription amount
- `start_date` (DATE) - Subscription start date
- `end_date` (DATE) - Subscription end date
- `status` (ENUM) - Subscription status:
  - `active` - Currently active
  - `expired` - Subscription expired
  - `cancelled` - Cancelled by client
- `max_users` (INT) - Maximum users allowed in this plan
- `max_properties` (INT) - Maximum properties allowed in this plan
- `auto_renewal` (BOOLEAN) - Auto-renewal enabled/disabled
- `notes` (TEXT) - Additional notes

**Relationships:**
- Belongs to `Client`

**Example:**
```typescript
const subscription = await Subscription.create({
  id: uuidv4(),
  client_id: 'client-uuid',
  plan_name: 'Premium',
  billing_cycle: 'yearly',
  amount: 50000.00,
  start_date: new Date('2024-01-01'),
  end_date: new Date('2024-12-31'),
  status: 'active',
  max_users: 25,
  max_properties: 100,
  auto_renewal: true
});
```

---

## Usage Examples

### 1. Create New Client with Subscription

```typescript
import { Client, Subscription } from './models/master-db';
import { v4 as uuidv4 } from 'uuid';

async function onboardNewClient(clientData: any, subscriptionData: any) {
  // Create client
  const client = await Client.create({
    id: uuidv4(),
    ...clientData,
    database_name: `client_${clientData.client_code.toLowerCase()}_db`
  });

  // Create initial subscription
  const subscription = await Subscription.create({
    id: uuidv4(),
    client_id: client.id,
    ...subscriptionData,
    status: 'active'
  });

  return { client, subscription };
}
```

### 2. Check Client License Validity

```typescript
import { Client, Subscription } from './models/master-db';
import { Op } from 'sequelize';

async function checkClientLicense(clientId: string): Promise<boolean> {
  const client = await Client.findByPk(clientId, {
    include: [{
      model: Subscription,
      where: {
        status: 'active',
        end_date: {
          [Op.gte]: new Date() // end_date >= today
        }
      },
      required: false
    }]
  });

  if (!client) return false;
  if (client.status !== 'active') return false;
  if (client.subscriptions.length === 0) return false;

  return true;
}
```

### 3. Get All Active Clients with Expiring Subscriptions

```typescript
import { Client, Subscription } from './models/master-db';
import { Op } from 'sequelize';

async function getExpiringSubscriptions(daysAhead: number = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return await Client.findAll({
    include: [{
      model: Subscription,
      where: {
        status: 'active',
        end_date: {
          [Op.between]: [new Date(), futureDate]
        }
      }
    }],
    where: {
      status: 'active'
    }
  });
}
```

### 4. Update Client Usage Limits

```typescript
async function updateClientLimits(clientId: string, limits: any) {
  const client = await Client.findByPk(clientId);
  
  if (!client) throw new Error('Client not found');

  await client.update({
    max_users: limits.max_users,
    max_properties: limits.max_properties
  });

  return client;
}
```

### 5. Renew Subscription

```typescript
async function renewSubscription(subscriptionId: string) {
  const subscription = await Subscription.findByPk(subscriptionId);
  
  if (!subscription) throw new Error('Subscription not found');

  const newStartDate = subscription.end_date;
  const newEndDate = new Date(newStartDate);
  
  // Add period based on billing cycle
  switch (subscription.billing_cycle) {
    case 'monthly':
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      break;
    case 'quarterly':
      newEndDate.setMonth(newEndDate.getMonth() + 3);
      break;
    case 'yearly':
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      break;
  }

  await subscription.update({
    start_date: newStartDate,
    end_date: newEndDate,
    status: 'active'
  });

  return subscription;
}
```

## Database Initialization

### Initialize Master Database

```typescript
import { Sequelize } from 'sequelize-typescript';
import { masterModels } from './models/master-db';

const masterSequelize = new Sequelize({
  database: 'master_db',
  dialect: 'mysql',
  username: 'your_username',
  password: 'your_password',
  host: 'localhost',
  models: masterModels,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

await masterSequelize.sync();
```

### Multi-Database Connection Manager

```typescript
import { Sequelize } from 'sequelize-typescript';
import { masterModels } from './models/master-db';
import { models as clientModels } from './models';

class DatabaseManager {
  private masterDb: Sequelize;
  private clientDatabases: Map<string, Sequelize> = new Map();

  async initializeMaster() {
    this.masterDb = new Sequelize({
      database: 'master_db',
      dialect: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      models: masterModels,
    });
    await this.masterDb.sync();
  }

  async getClientDatabase(databaseName: string): Promise<Sequelize> {
    if (!this.clientDatabases.has(databaseName)) {
      const clientDb = new Sequelize({
        database: databaseName,
        dialect: 'mysql',
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        models: clientModels,
      });
      this.clientDatabases.set(databaseName, clientDb);
    }
    return this.clientDatabases.get(databaseName)!;
  }
}
```

## Best Practices

1. **Client Isolation**: Each client has their own database for complete data isolation
2. **Subscription Management**: Always check subscription status before allowing access
3. **License Expiry**: Set up cron jobs to check and notify about expiring licenses
4. **Auto-renewal**: Handle auto-renewal logic before subscription end_date
5. **Usage Limits**: Enforce max_users and max_properties limits in application logic
6. **Audit Trail**: Log all changes to subscriptions and client status

## Security Considerations

- Never expose `database_name` to client-side applications
- Store passwords using bcrypt with high salt rounds
- Implement rate limiting for super user login attempts
- Use separate database credentials for master and client databases
- Regularly backup both master and client databases
- Monitor for suspicious activity across client databases
