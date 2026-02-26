# भवानी प्रॉपर्टी मैनेजमेंट सिस्टम - Models

## Overview
This directory contains Sequelize TypeScript models for the Bhavani Property Management System with integrated role-based permission management.

## Models Structure

### 1. Role & Permission Management Models

#### QEntityAction (`q-entity-action.model.ts`)
Defines available actions on different entities/models.

**Fields:**
- `id` (BIGINT) - Primary key
- `BaseModel` (VARCHAR) - Model/Entity name (e.g., 'properties', 'buyers')
- `Action` (VARCHAR) - Action name (e.g., 'create', 'read', 'update', 'delete')
- `description` (TEXT) - Description of the action

**Relationships:**
- Has many `QPermission`

#### QRole (`q-role.model.ts`)
Defines user roles with associated permissions.

**Fields:**
- `id` (INT) - Primary key
- `name` (VARCHAR) - Role name (e.g., 'admin', 'manager', 'accountant')
- `display_name` (VARCHAR) - Display name in Hindi/English
- `permissions` (JSON) - Menu and route permissions
  ```json
  {
    "menus": ["dashboard", "properties", "buyers"],
    "routes": ["create", "read", "update"]
  }
  ```
- `description` (TEXT) - Role description
- `status` (ENUM) - 'active' or 'inactive'

**Relationships:**
- Has many `QPermission`
- Has many `User`

#### QPermission (`q-permission.model.ts`)
Maps roles to entity actions with permission status.

**Fields:**
- `id` (INT) - Primary key
- `entity_action_id` (BIGINT) - Foreign key to QEntityAction
- `role_id` (INT) - Foreign key to QRole
- `status` (TINYINT) - Permission status (0=denied, 1=allowed)
- `from_ips` (VARCHAR) - Comma-separated allowed IP addresses

**Relationships:**
- Belongs to `QEntityAction`
- Belongs to `QRole`

**Unique Index:** Combination of `entity_action_id` and `role_id`

---

### 2. User Management

#### User (`user.model.ts`)
User accounts with role-based access control.

**Fields:**
- `id` (UUID) - Primary key
- `name` (VARCHAR) - User name
- `email` (VARCHAR) - Email address (unique)
- `mobile` (VARCHAR) - Mobile number (unique)
- `password` (VARCHAR) - Hashed password
- `role` (ENUM) - Legacy role field ('admin', 'manager', 'user', 'accountant')
- `role_id` (INT) - New role system (foreign key to QRole)
- `status` (ENUM) - 'active' or 'inactive'
- `address` (TEXT) - Address
- `city` (VARCHAR) - City
- `pincode` (VARCHAR) - PIN code
- `permissions` (JSON) - Additional custom permissions
- `profile_photo` (VARCHAR) - Profile photo URL
- `last_login` (TIMESTAMP) - Last login timestamp

**Relationships:**
- Belongs to `QRole`

---

### 3. Property Management

#### Property (`property.model.ts`)
Real estate properties/projects.

**Fields:**
- `id` (UUID) - Primary key
- `property_code` (VARCHAR) - Property code
- `property_name` (VARCHAR) - Property name
- `property_type` (ENUM) - 'residential', 'commercial', 'agricultural', 'industrial', 'mixed'
- `address` (TEXT) - Address
- `city` (VARCHAR) - City
- `tehsil` (VARCHAR) - Tehsil
- `district` (VARCHAR) - District
- `state` (VARCHAR) - State
- `pincode` (VARCHAR) - PIN code
- `latitude` (DECIMAL) - Latitude coordinates
- `longitude` (DECIMAL) - Longitude coordinates
- `total_area` (DECIMAL) - Total area
- `area_unit` (VARCHAR) - Area unit (sq.meter, sq.feet, acre)
- `total_plots` (INT) - Total number of plots
- `available_plots` (INT) - Available plots
- `sold_plots` (INT) - Sold plots
- `booked_plots` (INT) - Booked plots
- `status` (ENUM) - 'active', 'inactive', 'completed'
- `description` (TEXT) - Property description
- `amenities` (JSON) - Amenities in JSON format
- `notes` (TEXT) - Notes

**Relationships:**
- Has many `MapImage`
- Has many `Plot`

#### MapImage (`map-image.model.ts`)
Property map/layout images.

**Fields:**
- `id` (UUID) - Primary key
- `property_id` (UUID) - Foreign key to Property
- `title` (VARCHAR) - Map image title
- `image_url` (VARCHAR) - Image URL
- `thumbnail_url` (VARCHAR) - Thumbnail URL
- `image_width` (INT) - Image width in pixels
- `image_height` (INT) - Image height in pixels
- `file_type` (VARCHAR) - File type
- `file_size` (BIGINT) - File size in bytes
- `is_default` (BOOLEAN) - Is default map
- `display_order` (INT) - Display order
- `status` (ENUM) - 'active' or 'inactive'
- `description` (TEXT) - Description

**Relationships:**
- Belongs to `Property`

#### Plot (`plot.model.ts`)
Individual plots within a property.

**Fields:**
- `id` (UUID) - Primary key
- `property_id` (UUID) - Foreign key to Property
- `plot_number` (VARCHAR) - Plot number
- `plot_name` (VARCHAR) - Plot name
- `area` (DECIMAL) - Plot area
- `area_unit` (VARCHAR) - Area unit
- `length` (DECIMAL) - Length
- `width` (DECIMAL) - Width
- `price_per_unit` (DECIMAL) - Price per unit
- `total_price` (DECIMAL) - Total price
- `status` (ENUM) - 'available', 'booked', 'sold', 'hold'
- `category` (ENUM) - 'corner', 'park_facing', 'road_facing', 'normal'
- `direction` (VARCHAR) - Direction
- `map_coordinates` (JSON) - Map coordinates
- `map_image_id` (UUID) - Map image reference
- `khasra_number` (VARCHAR) - Khasra number
- `description` (TEXT) - Description
- `notes` (TEXT) - Notes

**Relationships:**
- Belongs to `Property`
- Has many `Agreement`

---

### 4. Sales & Transaction Management

#### Buyer (`buyer.model.ts`)
Buyer/customer information.

**Fields:**
- `id` (UUID) - Primary key
- `buyer_code` (VARCHAR) - Buyer code
- `name` (VARCHAR) - Buyer name
- `father_husband_name` (VARCHAR) - Father/Husband name
- `mobile` (VARCHAR) - Mobile number
- `alternate_mobile` (VARCHAR) - Alternate mobile
- `email` (VARCHAR) - Email address
- `aadhaar_number` (VARCHAR) - Aadhaar number
- `pan_number` (VARCHAR) - PAN number
- `address` (TEXT) - Current address
- `city` (VARCHAR) - City
- `state` (VARCHAR) - State
- `pincode` (VARCHAR) - PIN code
- `permanent_address` (TEXT) - Permanent address
- `date_of_birth` (DATE) - Date of birth
- `occupation` (VARCHAR) - Occupation
- `photo_url` (VARCHAR) - Photo URL
- `documents` (JSON) - Documents in JSON
- `status` (ENUM) - 'active', 'inactive', 'blacklisted'
- `notes` (TEXT) - Notes

**Relationships:**
- Has many `Agreement`

#### Agreement (`agreement.model.ts`)
Sales agreements between buyers and plots.

**Fields:**
- `id` (UUID) - Primary key
- `agreement_number` (VARCHAR) - Agreement number
- `plot_id` (UUID) - Foreign key to Plot
- `buyer_id` (UUID) - Foreign key to Buyer
- `agreement_date` (DATE) - Agreement date
- `total_amount` (DECIMAL) - Total amount
- `booking_amount` (DECIMAL) - Booking amount
- `paid_amount` (DECIMAL) - Total paid amount
- `balance_amount` (DECIMAL) - Balance amount
- `payment_type` (ENUM) - 'full_payment', 'installment', 'emi'
- `number_of_installments` (INT) - Number of installments
- `installment_amount` (DECIMAL) - Installment amount
- `status` (ENUM) - 'draft', 'active', 'completed', 'cancelled'
- `registration_date` (DATE) - Registration date
- `registration_number` (VARCHAR) - Registration number
- `agreement_document_url` (VARCHAR) - Agreement document URL
- `terms_and_conditions` (JSON) - Terms and conditions
- `notes` (TEXT) - Notes

**Relationships:**
- Belongs to `Plot`
- Belongs to `Buyer`
- Has many `LedgerEntry`

#### LedgerEntry (`ledger-entry.model.ts`)
Payment transactions for agreements.

**Fields:**
- `id` (UUID) - Primary key
- `agreement_id` (UUID) - Foreign key to Agreement
- `receipt_number` (VARCHAR) - Receipt number
- `transaction_date` (DATE) - Transaction date
- `entry_type` (ENUM) - 'debit' or 'credit'
- `amount` (DECIMAL) - Amount
- `payment_method` (ENUM) - 'cash', 'cheque', 'online_transfer', 'upi', 'card', 'demand_draft'
- `transaction_reference` (VARCHAR) - Transaction reference (UTR, Transaction ID)
- `bank_name` (VARCHAR) - Bank name
- `cheque_date` (DATE) - Cheque date
- `description` (TEXT) - Description
- `receipt_url` (VARCHAR) - Receipt URL
- `created_by` (UUID) - Created by user ID
- `status` (ENUM) - 'pending', 'completed', 'cancelled'
- `notes` (TEXT) - Notes

**Relationships:**
- Belongs to `Agreement`

---

## Usage Examples

### 1. Check User Permissions

```typescript
import { User, QPermission, QEntityAction } from './models';

async function checkUserPermission(userId: string, modelName: string, action: string): Promise<boolean> {
  const user = await User.findByPk(userId, {
    include: [{
      model: QRole,
      include: [{
        model: QPermission,
        include: [QEntityAction]
      }]
    }]
  });

  if (!user || !user.user_role) return false;

  const permission = user.user_role.role_permissions?.find(p => 
    p.entity_action.BaseModel === modelName && 
    p.entity_action.Action === action
  );

  return permission?.status === 1;
}

// Usage
const canCreate = await checkUserPermission('user-uuid', 'properties', 'create');
```

### 2. Get Available Plots for a Property

```typescript
import { Property, Plot } from './models';

async function getAvailablePlots(propertyId: string) {
  return await Plot.findAll({
    where: {
      property_id: propertyId,
      status: 'available'
    },
    order: [['plot_number', 'ASC']]
  });
}
```

### 3. Create Agreement with Payment

```typescript
import { Agreement, LedgerEntry } from './models';

async function createAgreementWithPayment(agreementData: any, paymentData: any) {
  const agreement = await Agreement.create(agreementData);
  
  const ledgerEntry = await LedgerEntry.create({
    ...paymentData,
    agreement_id: agreement.id
  });

  return { agreement, ledgerEntry };
}
```

## Database Initialization

To use these models with Sequelize:

```typescript
import { Sequelize } from 'sequelize-typescript';
import { models } from './models';

const sequelize = new Sequelize({
  database: 'client_demo_db',
  dialect: 'mysql',
  username: 'your_username',
  password: 'your_password',
  host: 'localhost',
  models: models,
});

await sequelize.sync();
```

## Notes

1. **Timestamps**: All models have `createdAt` and `updatedAt` fields automatically managed by Sequelize.

2. **Character Set**: All tables use UTF-8 (`utf8mb4_unicode_ci`) for proper Hindi text support.

3. **UUID**: Most primary keys use UUID v4 for better distribution in multi-tenant systems.

4. **Role Migration**: The `User` model has both `role` (legacy enum) and `role_id` (new system) for backward compatibility during migration.

5. **Cascading Deletes**: 
   - Deleting a Property cascades to MapImages and Plots
   - Deleting a QRole cascades to QPermissions
   - Agreements and LedgerEntries use RESTRICT to prevent accidental deletion

## Default Roles

The system comes with 5 predefined roles:

1. **Super Admin** - Full system access
2. **Admin** - Full access to all modules except system configuration
3. **Manager** - Property and buyer management (no delete permissions)
4. **Accountant** - Financial and reporting access
5. **User** - Read-only access to properties and buyers
