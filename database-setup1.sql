-- ===============================================
-- भवानी प्रॉपर्टी मैनेजमेंट सिस्टम
-- Database Setup Script with UTF-8 Support and Role Management
-- ===============================================

-- Create Master Database
CREATE DATABASE IF NOT EXISTS master_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE master_db;

-- Set character set for session
SET NAMES utf8mb4;

SET CHARACTER SET utf8mb4;

-- ===============================================
-- Master Database Tables
-- ===============================================

-- Clients Table
CREATE TABLE clients (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_code VARCHAR(100) UNIQUE NOT NULL COMMENT 'क्लाइंट कोड',
    company_name VARCHAR(255) NOT NULL COMMENT 'कंपनी का नाम',
    contact_person VARCHAR(255) COMMENT 'संपर्क व्यक्ति',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'ईमेल',
    mobile VARCHAR(20) NOT NULL COMMENT 'मोबाइल नंबर',
    address TEXT COMMENT 'पता',
    city VARCHAR(100) COMMENT 'शहर',
    state VARCHAR(100) COMMENT 'राज्य',
    pincode VARCHAR(10) COMMENT 'पिन कोड',
    database_name VARCHAR(100) NOT NULL COMMENT 'डेटाबेस नाम',
    status ENUM(
        'active',
        'inactive',
        'suspended'
    ) DEFAULT 'active' COMMENT 'स्थिति',
    license_expiry_date DATE COMMENT 'लाइसेंस समाप्ति तिथि',
    max_users INT DEFAULT 0 COMMENT 'अधिकतम उपयोगकर्ता',
    max_properties INT DEFAULT 0 COMMENT 'अधिकतम संपत्तियां',
    notes TEXT COMMENT 'टिप्पणी',
    allow_login INT NOT NULL DEFAULT 0 COMMENT 'लॉगिन अनुमति',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE clients
ADD COLUMN database_host VARCHAR(255) DEFAULT 'localhost' COMMENT 'SaaS DB Host' AFTER database_name,
ADD COLUMN database_port INT DEFAULT 3306 COMMENT 'SaaS DB Port' AFTER database_host,
ADD COLUMN database_username VARCHAR(100) COMMENT 'SaaS DB Username' AFTER database_port,
ADD COLUMN database_password VARCHAR(255) COMMENT 'SaaS DB Password' AFTER database_username,
ADD COLUMN standalone_db_host VARCHAR(255) DEFAULT 'localhost' COMMENT 'Standalone DB Host' AFTER standalone_db_name,
ADD COLUMN standalone_db_port INT DEFAULT 3306 COMMENT 'Standalone DB Port' AFTER standalone_db_host,
ADD COLUMN standalone_db_username VARCHAR(100) COMMENT 'Standalone DB Username' AFTER standalone_db_port,
ADD COLUMN standalone_db_password VARCHAR(255) COMMENT 'Standalone DB Password' AFTER standalone_db_username;

-- STEP 2: Now create Super User Table
CREATE TABLE super_user (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL COMMENT 'नाम',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'ईमेल',
    mobile VARCHAR(20) UNIQUE NOT NULL COMMENT 'मोबाइल नंबर',
    role ENUM(
        'super_admin',
        'admin',
        'support'
    ) DEFAULT 'super_admin' COMMENT 'भूमिका',
    client_id BIGINT UNSIGNED NULL,
    q_role_id INT NOT NULL DEFAULT 0 COMMENT 'Role ID',
    is_active TINYINT(1) DEFAULT 0 COMMENT 'Active Status',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'स्थिति',
    last_login TIMESTAMP NULL COMMENT 'अंतिम लॉगिन',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_client_id (client_id),
    CONSTRAINT fk_super_user_client FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE `super_user`
CHANGE `email` `email` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'ईमेल';

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NULL,
    plan_name VARCHAR(100) NOT NULL COMMENT 'योजना का नाम',
    billing_cycle ENUM(
        'monthly',
        'quarterly',
        'yearly',
        'lifetime'
    ) DEFAULT 'monthly' COMMENT 'बिलिंग चक्र',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'राशि',
    start_date DATE NOT NULL COMMENT 'आरंभ तिथि',
    end_date DATE NOT NULL COMMENT 'समाप्ति तिथि',
    status ENUM(
        'active',
        'expired',
        'cancelled'
    ) DEFAULT 'active' COMMENT 'स्थिति',
    max_users INT DEFAULT 0 COMMENT 'अधिकतम उपयोगकर्ता',
    max_properties INT DEFAULT 0 COMMENT 'अधिकतम संपत्तियां',
    auto_renewal BOOLEAN DEFAULT TRUE COMMENT 'स्वतः नवीनीकरण',
    notes TEXT COMMENT 'टिप्पणी',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE clients
ADD mode ENUM('saas', 'standalone') DEFAULT 'saas',
ADD converted_at TIMESTAMP NULL,
ADD standalone_db_name VARCHAR(100) NULL;
-- ===============================================
-- Create Sample Client Database
-- ===============================================

CREATE DATABASE IF NOT EXISTS client_demo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE client_demo_db;

SET NAMES utf8mb4;

SET CHARACTER SET utf8mb4;

-- ===============================================
-- Role and Permission Management Tables
-- ===============================================

-- Entity Actions Table (Q Entity Actions)
CREATE TABLE IF NOT EXISTS q_entity_actions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BaseModel VARCHAR(250) NULL COMMENT 'मॉडल/एंटिटी का नाम',
    Action VARCHAR(250) NULL COMMENT 'एक्शन का नाम',
    description TEXT COMMENT 'विवरण',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX BaseModelActionIndex ON q_entity_actions (BaseModel ASC, Action ASC);

-- Roles Table (Q Roles)
CREATE TABLE IF NOT EXISTS q_roles (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'भूमिका का नाम',
    display_name VARCHAR(255) COMMENT 'प्रदर्शन नाम',
    permissions JSON NULL COMMENT 'अनुमतियां (मेनू और रूट)',
    description TEXT COMMENT 'विवरण',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'स्थिति',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Permissions Table (Q Permissions)
CREATE TABLE IF NOT EXISTS q_permissions (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    entity_action_id BIGINT UNSIGNED NOT NULL COMMENT 'एंटिटी एक्शन आईडी',
    role_id INT(11) NOT NULL COMMENT 'भूमिका आईडी',
    status TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'अनुमति स्थिति (0=नहीं, 1=हां)',
    from_ips VARCHAR(255) DEFAULT NULL COMMENT 'अनुमत IP पते',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entity_action_id) REFERENCES q_entity_actions (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES q_roles (id) ON DELETE CASCADE,
    UNIQUE KEY unique_permission (entity_action_id, role_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX entity_action_id_idx ON q_permissions (entity_action_id);

CREATE INDEX role_id_idx ON q_permissions (role_id);

-- ===============================================
-- Client Database Tables
-- ===============================================

-- Users Table (Updated with role_id)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'नाम',
    username VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'ईमेल',
    mobile VARCHAR(20) UNIQUE NOT NULL COMMENT 'मोबाइल नंबर',
    password VARCHAR(255) NOT NULL COMMENT 'पासवर्ड',
    role ENUM(
        'admin',
        'manager',
        'user',
        'accountant'
    ) DEFAULT 'user' COMMENT 'भूमिका (पुरानी)',
    q_role_id INT(11) COMMENT 'भूमिका आईडी (नई प्रणाली)',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'स्थिति',
    address TEXT COMMENT 'पता',
    city VARCHAR(100) COMMENT 'शहर',
    pincode VARCHAR(10) COMMENT 'पिन कोड',
    permissions JSON COMMENT 'अनुमतियां (अतिरिक्त)',
    profile_photo VARCHAR(500) COMMENT 'प्रोफाइल फोटो',
    last_login TIMESTAMP NULL COMMENT 'अंतिम लॉगिन',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES q_roles (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id CHAR(36) PRIMARY KEY,
    property_code VARCHAR(100) NOT NULL COMMENT 'संपत्ति कोड',
    property_name VARCHAR(255) NOT NULL COMMENT 'संपत्ति का नाम',
    property_type ENUM(
        'residential',
        'commercial',
        'agricultural',
        'industrial',
        'mixed'
    ) NOT NULL COMMENT 'प्रकार',
    address TEXT COMMENT 'पता',
    city VARCHAR(100) NOT NULL COMMENT 'शहर',
    tehsil VARCHAR(100) COMMENT 'तहसील',
    district VARCHAR(100) COMMENT 'जिला',
    state VARCHAR(100) COMMENT 'राज्य',
    pincode VARCHAR(10) COMMENT 'पिन कोड',
    latitude DECIMAL(10, 6) COMMENT 'अक्षांश',
    longitude DECIMAL(10, 6) COMMENT 'देशांतर',
    total_area DECIMAL(15, 2) COMMENT 'कुल क्षेत्रफल',
    area_unit VARCHAR(50) COMMENT 'क्षेत्रफल इकाई',
    total_plots INT DEFAULT 0 COMMENT 'कुल प्लॉट',
    available_plots INT DEFAULT 0 COMMENT 'उपलब्ध प्लॉट',
    sold_plots INT DEFAULT 0 COMMENT 'बेचे गए प्लॉट',
    booked_plots INT DEFAULT 0 COMMENT 'बुक किए गए प्लॉट',
    status ENUM(
        'active',
        'inactive',
        'completed'
    ) DEFAULT 'active' COMMENT 'स्थिति',
    description TEXT COMMENT 'विवरण',
    amenities JSON COMMENT 'सुविधाएं',
    notes TEXT COMMENT 'टिप्पणी',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Map Images Table
CREATE TABLE IF NOT EXISTS map_images (
    id CHAR(36) PRIMARY KEY,
    property_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL COMMENT 'शीर्षक',
    image_url VARCHAR(500) NOT NULL COMMENT 'छवि URL',
    thumbnail_url VARCHAR(500) COMMENT 'थंबनेल URL',
    image_width INT COMMENT 'चौड़ाई',
    image_height INT COMMENT 'ऊंचाई',
    file_type VARCHAR(50) COMMENT 'फाइल प्रकार',
    file_size BIGINT COMMENT 'फाइल साइज',
    is_default BOOLEAN DEFAULT FALSE COMMENT 'डिफ़ॉल्ट नक्शा',
    display_order INT DEFAULT 1 COMMENT 'क्रम',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'स्थिति',
    description TEXT COMMENT 'विवरण',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Plots Table
-- CREATE TABLE IF NOT EXISTS plots (
--     id CHAR(36) PRIMARY KEY,
--     property_id CHAR(36) NOT NULL,
--     plot_number VARCHAR(100) NOT NULL COMMENT 'प्लॉट नंबर',
--     plot_name VARCHAR(255) COMMENT 'प्लॉट का नाम',
--     area DECIMAL(15, 2) NOT NULL COMMENT 'क्षेत्रफल',
--     area_unit VARCHAR(50) COMMENT 'क्षेत्रफल इकाई',
--     length DECIMAL(10, 2) COMMENT 'लंबाई',
--     width DECIMAL(10, 2) COMMENT 'चौड़ाई',
--     price_per_unit DECIMAL(15, 2) NOT NULL COMMENT 'मूल्य प्रति इकाई',
--     total_price DECIMAL(18, 2) NOT NULL COMMENT 'कुल मूल्य',
--     status ENUM(
--         'available',
--         'booked',
--         'sold',
--         'hold'
--     ) DEFAULT 'available' COMMENT 'स्थिति',
--     category ENUM(
--         'corner',
--         'park_facing',
--         'road_facing',
--         'normal'
--     ) COMMENT 'श्रेणी',
--     direction VARCHAR(100) COMMENT 'दिशा',
--     map_coordinates JSON COMMENT 'नक्शा निर्देशांक',
--     map_image_id CHAR(36) COMMENT 'नक्शा छवि आईडी',
--     khasra_number VARCHAR(50) COMMENT 'खाता संख्या',
--     description TEXT COMMENT 'विवरण',
--     notes TEXT COMMENT 'टिप्पणी',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
-- ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Buyers Table
-- CREATE TABLE IF NOT EXISTS buyers (
--     id CHAR(36) PRIMARY KEY,
--     buyer_code VARCHAR(100) NOT NULL COMMENT 'खरीदार कोड',
--     name VARCHAR(255) NOT NULL COMMENT 'नाम',
--     father_husband_name VARCHAR(255) COMMENT 'पिता/पति का नाम',
--     mobile VARCHAR(20) NOT NULL COMMENT 'मोबाइल नंबर',
--     alternate_mobile VARCHAR(20) COMMENT 'वैकल्पिक मोबाइल',
--     email VARCHAR(100) COMMENT 'ईमेल',
--     aadhaar_number VARCHAR(20) COMMENT 'आधार संख्या',
--     pan_number VARCHAR(20) COMMENT 'पैन संख्या',
--     address TEXT COMMENT 'पता',
--     city VARCHAR(100) COMMENT 'शहर',
--     state VARCHAR(100) COMMENT 'राज्य',
--     pincode VARCHAR(10) COMMENT 'पिन कोड',
--     permanent_address TEXT COMMENT 'स्थायी पता',
--     date_of_birth DATE COMMENT 'जन्म तिथि',
--     occupation VARCHAR(50) COMMENT 'व्यवसाय',
--     photo_url VARCHAR(500) COMMENT 'फोटो URL',
--     documents JSON COMMENT 'दस्तावेज',
--     status ENUM(
--         'active',
--         'inactive',
--         'blacklisted'
--     ) DEFAULT 'active' COMMENT 'स्थिति',
--     notes TEXT COMMENT 'टिप्पणी',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Agreements Table
CREATE TABLE IF NOT EXISTS agreements (
    id CHAR(36) PRIMARY KEY,
    agreement_number VARCHAR(100) NOT NULL COMMENT 'अनुबंध संख्या',
    plot_id CHAR(36) NOT NULL,
    buyer_id CHAR(36) NOT NULL,
    agreement_date DATE NOT NULL COMMENT 'अनुबंध तिथि',
    total_amount DECIMAL(18, 2) NOT NULL COMMENT 'कुल राशि',
    booking_amount DECIMAL(18, 2) COMMENT 'बुकिंग राशि',
    paid_amount DECIMAL(18, 2) COMMENT 'भुगतान राशि',
    balance_amount DECIMAL(18, 2) COMMENT 'शेष राशि',
    payment_type ENUM(
        'full_payment',
        'installment',
        'emi'
    ) DEFAULT 'installment' COMMENT 'भुगतान प्रकार',
    number_of_installments INT COMMENT 'किस्तों की संख्या',
    installment_amount DECIMAL(18, 2) COMMENT 'किस्त राशि',
    status ENUM(
        'draft',
        'active',
        'completed',
        'cancelled'
    ) DEFAULT 'active' COMMENT 'स्थिति',
    registration_date DATE COMMENT 'पंजीकरण तिथि',
    registration_number VARCHAR(100) COMMENT 'पंजीकरण संख्या',
    agreement_document_url VARCHAR(500) COMMENT 'अनुबंध दस्तावेज URL',
    terms_and_conditions JSON COMMENT 'नियम और शर्तें',
    notes TEXT COMMENT 'टिप्पणी',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plots (id) ON DELETE RESTRICT,
    FOREIGN KEY (buyer_id) REFERENCES buyers (id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Ledger Entries Table
CREATE TABLE IF NOT EXISTS ledger_entries (
    id CHAR(36) PRIMARY KEY,
    agreement_id CHAR(36) NOT NULL,
    receipt_number VARCHAR(100) NOT NULL COMMENT 'रसीद संख्या',
    transaction_date DATE NOT NULL COMMENT 'लेनदेन तिथि',
    entry_type ENUM('debit', 'credit') NOT NULL COMMENT 'प्रकार',
    amount DECIMAL(18, 2) NOT NULL COMMENT 'राशि',
    payment_method ENUM(
        'cash',
        'cheque',
        'online_transfer',
        'upi',
        'card',
        'demand_draft'
    ) NOT NULL COMMENT 'भुगतान विधि',
    transaction_reference VARCHAR(100) COMMENT 'लेनदेन संदर्भ',
    bank_name VARCHAR(255) COMMENT 'बैंक का नाम',
    cheque_date DATE COMMENT 'चेक तिथि',
    description TEXT COMMENT 'विवरण',
    receipt_url VARCHAR(500) COMMENT 'रसीद URL',
    created_by CHAR(36) COMMENT 'प्रविष्टि करने वाला',
    status ENUM(
        'pending',
        'completed',
        'cancelled'
    ) DEFAULT 'completed' COMMENT 'स्थिति',
    notes TEXT COMMENT 'टिप्पणी',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agreement_id) REFERENCES agreements (id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ===============================================
-- Insert Sample Data
-- ===============================================

-- Insert Default Roles
INSERT INTO
    q_roles (
        id,
        name,
        display_name,
        permissions,
        description,
        status
    )
VALUES (
        1,
        'super_admin',
        'सुपर एडमिन',
        '{"menus":["*"],"routes":["*"]}',
        'पूर्ण एक्सेस के साथ सुपर एडमिन',
        'active'
    ),
    (
        2,
        'admin',
        'एडमिन',
        '{"menus":["dashboard","properties","buyers","agreements","reports"],"routes":["*"]}',
        'सिस्टम एडमिनिस्ट्रेटर',
        'active'
    ),
    (
        3,
        'manager',
        'मैनेजर',
        '{"menus":["dashboard","properties","buyers","agreements"],"routes":["read","create","update"]}',
        'प्रॉपर्टी मैनेजर',
        'active'
    ),
    (
        4,
        'accountant',
        'लेखाकार',
        '{"menus":["dashboard","agreements","reports","ledger"],"routes":["read","create","update"]}',
        'खाता प्रबंधक',
        'active'
    ),
    (
        5,
        'user',
        'उपयोगकर्ता',
        '{"menus":["dashboard","properties"],"routes":["read"]}',
        'सामान्य उपयोगकर्ता',
        'active'
    );

-- Insert Entity Actions (Sample)
INSERT INTO
    q_entity_actions (
        id,
        BaseModel,
        Action,
        description
    )
VALUES (
        1,
        'properties',
        'create',
        'संपत्ति बनाएं'
    ),
    (
        2,
        'properties',
        'read',
        'संपत्ति देखें'
    ),
    (
        3,
        'properties',
        'update',
        'संपत्ति अपडेट करें'
    ),
    (
        4,
        'properties',
        'delete',
        'संपत्ति हटाएं'
    ),
    (
        5,
        'buyers',
        'create',
        'खरीदार बनाएं'
    ),
    (
        6,
        'buyers',
        'read',
        'खरीदार देखें'
    ),
    (
        7,
        'buyers',
        'update',
        'खरीदार अपडेट करें'
    ),
    (
        8,
        'buyers',
        'delete',
        'खरीदार हटाएं'
    ),
    (
        9,
        'agreements',
        'create',
        'अनुबंध बनाएं'
    ),
    (
        10,
        'agreements',
        'read',
        'अनुबंध देखें'
    ),
    (
        11,
        'agreements',
        'update',
        'अनुबंध अपडेट करें'
    ),
    (
        12,
        'agreements',
        'delete',
        'अनुबंध हटाएं'
    ),
    (
        13,
        'ledger',
        'create',
        'लेजर एंट्री बनाएं'
    ),
    (
        14,
        'ledger',
        'read',
        'लेजर देखें'
    ),
    (
        15,
        'ledger',
        'update',
        'लेजर अपडेट करें'
    ),
    (
        16,
        'users',
        'create',
        'उपयोगकर्ता बनाएं'
    ),
    (
        17,
        'users',
        'read',
        'उपयोगकर्ता देखें'
    ),
    (
        18,
        'users',
        'update',
        'उपयोगकर्ता अपडेट करें'
    ),
    (
        19,
        'users',
        'delete',
        'उपयोगकर्ता हटाएं'
    ),
    (
        20,
        'reports',
        'generate',
        'रिपोर्ट जेनरेट करें'
    );

-- Insert Default Permissions for Admin Role (Full Access)
INSERT INTO
    q_permissions (
        entity_action_id,
        role_id,
        status
    )
VALUES (1, 2, 1),
    (2, 2, 1),
    (3, 2, 1),
    (4, 2, 1), -- Properties
    (5, 2, 1),
    (6, 2, 1),
    (7, 2, 1),
    (8, 2, 1), -- Buyers
    (9, 2, 1),
    (10, 2, 1),
    (11, 2, 1),
    (12, 2, 1), -- Agreements
    (13, 2, 1),
    (14, 2, 1),
    (15, 2, 1), -- Ledger
    (16, 2, 1),
    (17, 2, 1),
    (18, 2, 1),
    (19, 2, 1), -- Users
    (20, 2, 1);
-- Reports

-- Insert Permissions for Manager Role (Limited Access)
INSERT INTO
    q_permissions (
        entity_action_id,
        role_id,
        status
    )
VALUES (1, 3, 1),
    (2, 3, 1),
    (3, 3, 1), -- Properties (No delete)
    (5, 3, 1),
    (6, 3, 1),
    (7, 3, 1), -- Buyers (No delete)
    (9, 3, 1),
    (10, 3, 1),
    (11, 3, 1);
-- Agreements (No delete)

-- Insert Permissions for Accountant Role
INSERT INTO
    q_permissions (
        entity_action_id,
        role_id,
        status
    )
VALUES (10, 4, 1), -- Agreements (Read only)
    (13, 4, 1),
    (14, 4, 1),
    (15, 4, 1), -- Ledger (Full access)
    (20, 4, 1);
-- Reports

-- Insert Permissions for User Role (Read Only)
INSERT INTO
    q_permissions (
        entity_action_id,
        role_id,
        status
    )
VALUES (2, 5, 1), -- Properties (Read only)
    (6, 5, 1);
-- Buyers (Read only)

-- Sample Property (हिंदी में)
INSERT INTO
    properties (
        id,
        property_code,
        property_name,
        property_type,
        city,
        tehsil,
        district,
        state,
        total_area,
        area_unit,
        total_plots,
        available_plots,
        status
    )
VALUES (
        UUID(),
        'PROP001',
        'श्री नगर कॉलोनी',
        'residential',
        'इंदौर',
        'इंदौर',
        'इंदौर',
        'मध्य प्रदेश',
        10000.00,
        'sq.meter',
        50,
        50,
        'active'
    );

-- Sample Buyer (हिंदी में)
INSERT INTO
    buyers (
        id,
        buyer_code,
        name,
        father_husband_name,
        mobile,
        city,
        status
    )
VALUES (
        UUID(),
        'BYR001',
        'राजेश कुमार शर्मा',
        'श्री रामप्रसाद शर्मा',
        '9876543210',
        'इंदौर',
        'active'
    );

COMMIT;

-- ===============================================
-- Display Success Messages
-- ===============================================
SELECT '✓ Database setup completed successfully!' AS Message;

SELECT '✓ Master database created: master_db' AS Info;

SELECT '✓ Sample client database created: client_demo_db' AS Info;

SELECT '✓ All tables created with UTF-8 support' AS Info;

SELECT '✓ Role and permission management system integrated' AS Info;

SELECT '✓ Default roles and permissions added' AS Info;

-- ===============================================
-- Usage Notes
-- ===============================================
/*
भूमिका प्रणाली का उपयोग:
1. उपयोगकर्ता तालिका में role_id जोड़ा गया है
2. q_roles में डिफ़ॉल्ट भूमिकाएं हैं
3. q_entity_actions में मॉडल और एक्शन हैं
4. q_permissions में भूमिका-आधारित अनुमतियां हैं

उपयोगकर्ता अनुमति जांचने के लिए:
SELECT qp.status 
FROM users u
JOIN q_permissions qp ON u.role_id = qp.role_id
JOIN q_entity_actions qea ON qp.entity_action_id = qea.id
WHERE u.id = 'user_id' 
AND qea.BaseModel = 'properties' 
AND qea.Action = 'create';
*/

-- ALTER TABLE properties ADD UNIQUE(property_code);
-- ALTER TABLE buyers ADD UNIQUE(mobile);
/* Master DB */
ALTER TABLE subscriptions MODIFY end_date DATE NULL;

/* Client DB */
-- ALTER TABLE plots
-- ADD CONSTRAINT fk_plots_map_images FOREIGN KEY (map_image_id) REFERENCES map_images (id) ON DELETE SET NULL;

-- ALTER TABLE ledger_entries
-- ADD CONSTRAINT fk_ledger_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL;

-- ALTER TABLE properties
-- ADD UNIQUE KEY uniq_property_code (property_code);

-- ALTER TABLE buyers ADD UNIQUE KEY uniq_buyer_mobile (mobile);

ALTER TABLE agreements
MODIFY paid_amount DECIMAL(18, 2) DEFAULT 0,
MODIFY balance_amount DECIMAL(18, 2) DEFAULT 0;

-- ALTER TABLE users
-- ADD created_by CHAR(36) NULL,
-- ADD updated_by CHAR(36) NULL;

-- ALTER TABLE properties
-- ADD created_by CHAR(36) NULL,
-- ADD updated_by CHAR(36) NULL;

-- ALTER TABLE buyers
-- ADD created_by CHAR(36) NULL,
-- ADD updated_by CHAR(36) NULL;

CREATE INDEX idx_users_role_id ON users (role_id);

CREATE INDEX idx_plots_property_id ON plots (property_id);

CREATE INDEX idx_agreements_plot_id ON agreements (plot_id);

CREATE INDEX idx_ledger_agreement_id ON ledger_entries (agreement_id);

-- ALTER TABLE users
-- ADD client_id CHAR(36) NULL COMMENT 'SaaS client reference',
-- ADD INDEX idx_users_client_id (client_id);

CREATE TABLE license (
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_key VARCHAR(100) NOT NULL,
    issued_to VARCHAR(255),
    expiry DATE NULL,
    features JSON,
    status ENUM('active', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE states (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name_hi VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
) CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE cities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    state_id BIGINT,
    name_hi VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (state_id) REFERENCES states (id)
);

CREATE TABLE tehsils (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_id BIGINT,
    name_hi VARCHAR(150),
    name_en VARCHAR(150),
    FOREIGN KEY (city_id) REFERENCES cities (id)
);

CREATE TABLE villages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tehsil_id BIGINT,
    name_hi VARCHAR(150),
    name_en VARCHAR(150),
    FOREIGN KEY (tehsil_id) REFERENCES tehsils (id)
);

CREATE TABLE IF NOT EXISTS buyers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    buyer_code VARCHAR(100) NOT NULL COMMENT 'खरीदार कोड',
    name_hi VARCHAR(255) NOT NULL COMMENT 'नाम (हिंदी)',
    name_en VARCHAR(255),
    father_husband_name_hi VARCHAR(255),
    father_husband_name_en VARCHAR(255),
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    email VARCHAR(100),
    aadhaar_number VARCHAR(20),
    pan_number VARCHAR(20),
    address_hi TEXT,
    address_en TEXT,
    permanent_address_hi TEXT,
    permanent_address_en TEXT,
    state_id BIGINT UNSIGNED,
    city_id BIGINT UNSIGNED,
    tehsil_id BIGINT UNSIGNED,
    village_id BIGINT UNSIGNED,
    pincode VARCHAR(10),
    date_of_birth DATE,
    occupation VARCHAR(100),
    photo_url VARCHAR(500),
    documents JSON,
    status ENUM(
        'active',
        'inactive',
        'blacklisted'
    ) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mobile (mobile),
    INDEX idx_city (city_id),
    UNIQUE KEY uq_buyer_code (buyer_code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE sellers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    seller_code VARCHAR(100) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    father_husband_name_hi VARCHAR(255),
    father_husband_name_en VARCHAR(255),
    mobile VARCHAR(20) NOT NULL,
    alternate_mobile VARCHAR(20),
    email VARCHAR(100),
    aadhaar_number VARCHAR(20),
    pan_number VARCHAR(20),
    address_hi TEXT,
    address_en TEXT,
    permanent_address_hi TEXT,
    permanent_address_en TEXT,
    state_id BIGINT UNSIGNED,
    city_id BIGINT UNSIGNED,
    tehsil_id BIGINT UNSIGNED,
    village_id BIGINT UNSIGNED,
    pincode VARCHAR(10),
    photo_url VARCHAR(500),
    documents JSON,
    status ENUM(
        'active',
        'inactive',
        'blacklisted'
    ) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- CREATE TABLE projects (
--     id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     name_hi VARCHAR(200) NOT NULL,
--     name_en VARCHAR(200),
--     code VARCHAR(50),
--     state_id BIGINT,
--     city_id BIGINT,
--     tehsil_id BIGINT,
--     village_id BIGINT,
--     address_hi TEXT,
--     address_en TEXT,
--     total_area_sqft DECIMAL(18, 2),
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at DATETIME,
--     updated_at DATETIME
-- );
ALTER TABLE properties
ADD COLUMN name_hi VARCHAR(200) NOT NULL AFTER id,
ADD COLUMN state_id BIGINT AFTER state,
ADD COLUMN city_id BIGINT AFTER city,
ADD COLUMN tehsil_id BIGINT AFTER tehsil,
ADD COLUMN village_id BIGINT AFTER tehsil_id,
ADD COLUMN address_hi TEXT AFTER address;

CREATE TABLE plans (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED,
    name_hi VARCHAR(200),
    name_en VARCHAR(200),
    plan_image_url TEXT,
    total_plots INT,
    created_at DATETIME,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);

CREATE TABLE plan_infrastructure (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plan_id BIGINT UNSIGNED,
    infra_type VARCHAR(100),
    geo_json JSON,
    FOREIGN KEY (plan_id) REFERENCES plans (id)
);


CREATE TABLE plots (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED NOT NULL,

    plot_number VARCHAR(50) NOT NULL,
    block VARCHAR(50),
    phase VARCHAR(50),

    area_sqft DECIMAL(18,2),
    length DECIMAL(10,2),
    width DECIMAL(10,2),

    facing_hi VARCHAR(100),
    facing_en VARCHAR(100),

    plot_type_hi VARCHAR(100),
    plot_type_en VARCHAR(100),

    rate DECIMAL(18,2),

    status ENUM('available','hold','booked','sold') DEFAULT 'available',

-- Legal / Land Info
khasra_number VARCHAR(100), registry_status VARCHAR(50),

-- Image Naksha Mapping (Main Feature)
map_x INT, map_y INT, map_width INT, map_height INT,

-- Future GIS Support


centroid_lat DECIMAL(10,7),
    centroid_lng DECIMAL(10,7),
    polygon_coordinates JSON,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_plan (plan_id),
    INDEX idx_project (project_id),
    INDEX idx_plot_number (plot_number),
    INDEX idx_status (status),

    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE plot_bookings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    plot_id BIGINT UNSIGNED,
    buyer_id BIGINT UNSIGNED,
    booking_amount DECIMAL(12, 2),
    booking_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (plot_id) REFERENCES plots (id),
    FOREIGN KEY (buyer_id) REFERENCES buyers (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE agreements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    agreement_no VARCHAR(100),
    agreement_date DATE,
    document_path VARCHAR(500),
    PRIMARY KEY (id),
    INDEX idx_booking_id (booking_id),
    CONSTRAINT fk_agreement_booking FOREIGN KEY (booking_id) REFERENCES plot_bookings (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE registries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED,
    registry_no VARCHAR(100),
    registry_date DATE,
    registry_doc VARCHAR(500),
    FOREIGN KEY (booking_id) REFERENCES plot_bookings (id)
);

ALTER TABLE `clients`
CHANGE `license_expiry_date` `license_expiry_date` DATETIME NULL DEFAULT NULL COMMENT 'लाइसेंस समाप्ति तिथि';

ALTER TABLE `super_user`
CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT;

ALTER TABLE `properties`
CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT;

ALTER TABLE `properties`
CHANGE `city` `city` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT 'शहर';

ALTER TABLE `plans`
CHANGE `project_id` `property_id` BIGINT UNSIGNED NULL DEFAULT NULL;

ALTER TABLE properties ADD COLUMN boundary GEOMETRY SRID 4326;

UPDATE properties
SET
    boundary = ST_GeomFromText(
        'POLYGON((78.0000 27.0000,
            78.0100 27.0000,
            78.0100 27.0100,
            78.0000 27.0100,
            78.0000 27.0000))',
        4326
    )
WHERE
    boundary IS NULL;

ALTER TABLE plans
ADD COLUMN plan_boundary_new POLYGON SRID 4326 NULL;

UPDATE plans
SET
    plan_boundary_new = ST_GeomFromText(
        ST_AsText(plan_boundary),
        4326
    );

ALTER TABLE plans
CHANGE plan_boundary_new plan_boundary POLYGON SRID 4326 NOT NULL;

ALTER TABLE plans
ADD SPATIAL INDEX idx_plan_boundary (plan_boundary);

ALTER TABLE plans DROP COLUMN total_plots;

ALTER TABLE plots ADD COLUMN boundary_new POLYGON SRID 4326 NULL;

UPDATE plots
SET
    boundary_new = ST_GeomFromText(ST_AsText(boundary), 4326);

ALTER TABLE plots DROP COLUMN boundary;

ALTER TABLE plots
CHANGE boundary_new boundary POLYGON SRID 4326 NOT NULL;

ALTER TABLE plots ADD SPATIAL INDEX idx_plot_boundary (boundary);

ALTER TABLE plots DROP INDEX idx_plot_centroid;

ALTER TABLE plots ADD COLUMN centroid_new POINT SRID 4326 NULL;

UPDATE plots
SET
    centroid_new = ST_GeomFromText(ST_AsText(centroid), 4326);

ALTER TABLE plots DROP COLUMN centroid;

ALTER TABLE plots
CHANGE centroid_new centroid POINT SRID 4326 NOT NULL;

ALTER TABLE plots ADD SPATIAL INDEX idx_plot_centroid (centroid);

ALTER TABLE plots
DROP COLUMN map_x,
DROP COLUMN map_y,
DROP COLUMN map_width,
DROP COLUMN map_height,
DROP COLUMN polygon_coordinates;

ALTER TABLE plan_infrastructure DROP INDEX idx_infra_geometry;

ALTER TABLE plan_infrastructure
ADD COLUMN geometry_new GEOMETRY SRID 4326 NULL;

UPDATE plan_infrastructure
SET
    geometry_new = ST_GeomFromText(ST_AsText(geometry), 4326);

ALTER TABLE plan_infrastructure DROP COLUMN geometry;

ALTER TABLE plan_infrastructure
CHANGE geometry_new geometry GEOMETRY SRID 4326 NOT NULL;

ALTER TABLE plan_infrastructure
ADD SPATIAL INDEX idx_infra_geometry (geometry);

ALTER TABLE plans MODIFY plan_boundary POLYGON SRID 4326 NOT NULL;

ALTER TABLE plots MODIFY boundary POLYGON SRID 4326 NOT NULL;

ALTER TABLE plots MODIFY centroid POINT SRID 4326 NOT NULL;

ALTER TABLE plan_infrastructure
MODIFY geometry GEOMETRY SRID 4326 NOT NULL;