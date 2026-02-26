import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Staff } from './Staff';
import { Subscription } from './Subscription';

@Table({
  tableName: 'clients',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Client extends Model {
  @PrimaryKey
  @Column({ type: DataType.CHAR(36) })
  id: string;

  @Column({ unique: true })
  client_code: string;

  @Column
  name: string;
  @Column
  company_name: string;

  @Column
  contact_person: string;

  @Column({ unique: true })
  email: string;

  @Column
  mobile: string;

  @Column(DataType.TEXT)
  address: string;

  @Column
  city: string;

  @Column
  state: string;

  @Column
  pincode: string;

  // SaaS Mode Database Credentials
  @Column
  database_name: string;

  @Column
  database_host: string;

  @Column({ defaultValue: 3306 })
  database_port: number;

  @Column
  database_username: string;

  @Column
  database_password: string;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  })
  status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  license_expiry_date: Date;

  @Column({ defaultValue: 0 })
  max_users: number;

  @Column({ defaultValue: 0 })
  max_properties: number;

  @Column(DataType.TEXT)
  notes: string;

  @Column({ type: DataType.TINYINT, defaultValue: 0 })
  allow_login: number;

  @Column({ type: DataType.ENUM('saas', 'standalone'), defaultValue: 'saas' })
  mode: string;

  // Standalone Mode Database Credentials
  @Column({ type: DataType.STRING, allowNull: true })
  standalone_db_name: string;

  @Column
  standalone_db_host: string;

  @Column({ defaultValue: 3306 })
  standalone_db_port: number;

  @Column
  standalone_db_username: string;

  @Column
  standalone_db_password: string;

  @Column({ type: DataType.DATE, allowNull: true })
  converted_at: Date;

  @HasMany(() => Staff)
  super_users: Staff[];

  @HasMany(() => Subscription)
  subscriptions: Subscription[];
}
