# भवानी प्रॉपर्टी मैनेजमेंट सिस्टम - Complete Models Package

## 📦 Package Contents

यह package में दो databases के लिए complete Sequelize TypeScript models हैं:

### 1. **Master Database Models** (`/models/master-db/`)
Multi-tenant architecture के लिए master database models:
- ✅ **Client** - Client/Tenant management
- ✅ **SuperUser** - System और client admins
- ✅ **Subscription** - Subscription और billing management

### 2. **Client Database Models** (`/models/`)
Individual client databases के लिए models:

#### Role & Permission Management:
- ✅ **QEntityAction** - Entity actions (CRUD operations)
- ✅ **QRole** - User roles
- ✅ **QPermission** - Role-based permissions

#### User Management:
- ✅ **User** - Client users with role integration

#### Property Management:
- ✅ **Property** - Properties/Projects
- ✅ **MapImage** - Property layout images
- ✅ **Plot** - Individual plots

#### Transaction Management:
- ✅ **Buyer** - Buyers/Customers
- ✅ **Agreement** - Sales agreements
- ✅ **LedgerEntry** - Payment transactions

---

## 🏗️ Database Architecture

```
┌─────────────────────────────────────────┐
│     MASTER DATABASE (master_db)        │
│  ┌─────────┐  ┌──────────────┐         │
│  │ Clients │──┤Subscriptions │         │
│  └────┬────┘  └──────────────┘         │
│       │                                 │
│       │      ┌──────────────┐           │
│       └─────→│ Super Users  │           │
│              └──────────────┘           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  CLIENT DATABASES (client_xxx_db)       │
│                                         │
│  Role System:                           │
│  ┌──────────────┐  ┌──────────┐        │
│  │ QEntityAction│←─┤QPermission│        │
│  └──────────────┘  └────┬─────┘        │
│                          │              │
│  ┌────────┐             │              │
│  │ QRole  │←────────────┘              │
│  └───┬────┘                            │
│      │                                 │
│  ┌───▼────┐                            │
│  │ Users  │                            │
│  └────────┘                            │
│                                         │
│  Property Management:                  │
│  ┌──────────┐  ┌──────────┐            │
│  │Properties│──┤MapImages │            │
│  └────┬─────┘  └──────────┘            │
│       │                                │
│       │        ┌───────┐               │
│       └───────→│ Plots │               │
│                └───┬───┘               │
│                    │                   │
│  Transactions:     │                   │
│  ┌────────┐       │                   │
│  │ Buyers │       │                   │
│  └───┬────┘       │                   │
│      │            │                   │
│      │   ┌────────▼──────┐            │
│      └──→│  Agreements   │            │
│          └───────┬───────┘            │
│                  │                    │
│          ┌───────▼──────────┐         │
│          │  Ledger Entries  │         │
│          └──────────────────┘         │
└─────────────────────────────────────────┘
```

---

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install sequelize sequelize-typescript mysql2
npm install --save-dev @types/node
```

### 2. Import Models

```typescript
// Master Database Models
import { Client, SuperUser, Subscription } from './models/master-db';

// Client Database Models
import { 
  User, 
  Property, 
  Plot, 
  Buyer, 
  Agreement,
  QRole,
  QPermission 
} from './models';
```

### 3. Initialize Databases

```typescript
import { Sequelize } from 'sequelize-typescript';
import { masterModels } from './models/master-db';
import { models as clientModels } from './models';

// Master Database
const masterDb = new Sequelize({
  database: 'master_db',
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: masterModels,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

// Client Database
const clientDb = new Sequelize({
  database: 'client_demo_db',
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: clientModels,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

await masterDb.sync();
await clientDb.sync();
```

---

## 📚 Usage Examples

### Master Database Examples

#### Create New Client
```typescript
import { Client } from './models/master-db';

const client = await Client.create({
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

#### Add Subscription
```typescript
import { Subscription } from './models/master-db';

const subscription = await Subscription.create({
  client_id: client.id,
  plan_name: 'Premium',
  billing_cycle: 'yearly',
  amount: 50000.00,
  start_date: new Date(),
  end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  status: 'active',
  max_users: 25,
  max_properties: 100
});
```

### Client Database Examples

#### Check User Permission
```typescript
import { User, QPermission, QEntityAction, QRole } from './models';

async function hasPermission(
  userId: string, 
  modelName: string, 
  action: string
): Promise<boolean> {
  const user = await User.findByPk(userId, {
    include: [{
      model: QRole,
      include: [{
        model: QPermission,
        include: [{
          model: QEntityAction,
          where: { BaseModel: modelName, Action: action }
        }]
      }]
    }]
  });

  const permission = user?.user_role?.role_permissions?.[0];
  return permission?.status === 1;
}

// Usage
const canCreate = await hasPermission('user-id', 'properties', 'create');
```

#### Create Property with Plots
```typescript
import { Property, Plot } from './models';

const property = await Property.create({
  property_code: 'PROP001',
  property_name: 'श्री नगर कॉलोनी',
  property_type: 'residential',
  city: 'इंदौर',
  total_plots: 50,
  available_plots: 50
});

// Create plots
for (let i = 1; i <= 50; i++) {
  await Plot.create({
    property_id: property.id,
    plot_number: `P-${i}`,
    area: 100,
    area_unit: 'sq.meter',
    price_per_unit: 5000,
    total_price: 500000,
    status: 'available'
  });
}
```

#### Create Agreement
```typescript
import { Agreement, LedgerEntry } from './models';

const agreement = await Agreement.create({
  agreement_number: 'AGR001',
  plot_id: 'plot-id',
  buyer_id: 'buyer-id',
  agreement_date: new Date(),
  total_amount: 500000,
  booking_amount: 50000,
  paid_amount: 50000,
  balance_amount: 450000,
  payment_type: 'installment',
  number_of_installments: 10,
  installment_amount: 45000,
  status: 'active'
});

// Add payment entry
await LedgerEntry.create({
  agreement_id: agreement.id,
  receipt_number: 'RCP001',
  transaction_date: new Date(),
  entry_type: 'credit',
  amount: 50000,
  payment_method: 'upi',
  status: 'completed'
});
```

---

## 🔒 Default Roles & Permissions

System में 5 default roles हैं:

### 1. Super Admin
- **Access**: सभी modules में पूर्ण access
- **Permissions**: सभी CRUD operations

### 2. Admin
- **Access**: सभी modules (except system config)
- **Permissions**: सभी CRUD operations

### 3. Manager
- **Access**: Properties, Buyers, Agreements
- **Permissions**: Create, Read, Update (no Delete)

### 4. Accountant
- **Access**: Agreements, Ledger, Reports
- **Permissions**: Create, Read, Update for ledger

### 5. User
- **Access**: Properties, Buyers
- **Permissions**: Read only

---

## 📁 File Structure

```
models/
├── master-db/
│   ├── client.model.ts
│   ├── super-user.model.ts
│   ├── subscription.model.ts
│   ├── index.ts
│   └── README.md
│
├── q-entity-action.model.ts
├── q-role.model.ts
├── q-permission.model.ts
├── user.model.ts
├── property.model.ts
├── map-image.model.ts
├── plot.model.ts
├── buyer.model.ts
├── agreement.model.ts
├── ledger-entry.model.ts
├── index.ts
└── README.md
```

---

## 🛡️ Security Features

- ✅ **Multi-tenant isolation** - प्रत्येक client का अलग database
- ✅ **Role-based access control** - Granular permissions
- ✅ **Password hashing** - Bcrypt के साथ secure storage
- ✅ **UUID primary keys** - Better security और distribution
- ✅ **UTF-8 support** - Hindi text के लिए proper encoding
- ✅ **Foreign key constraints** - Data integrity
- ✅ **Cascading deletes** - Safe deletion handling

---

## 📖 Documentation

- **Master Database Models**: See `/models/master-db/README.md`
- **Client Database Models**: See `/models/README.md`

---

## 🤝 Support

किसी भी समस्या या सवाल के लिए, कृपया documentation देखें या support team से संपर्क करें।

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Database**: MySQL with UTF-8 (utf8mb4_unicode_ci)  
**ORM**: Sequelize TypeScript
