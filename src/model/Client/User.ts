import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import QRoles from 'src/qnatk/src/models/QRoles';
import { Client } from '../Master/Client';

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: false })
export class User extends Model<User> {
  @PrimaryKey
  @Column({ type: DataType.CHAR(36) })
  id: string;

  // @Column
  // name: string;
  @Column
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  mobile: string;

  @Column
  password: string;

  @Column(DataType.ENUM('admin', 'manager', 'user', 'accountant'))
  role: string;
  // @ForeignKey(() => Client)
  // @Column({ type: DataType.CHAR(36), allowNull: true })
  // client_id: string;

  // @BelongsTo(() => Client)
  // client: Client;

  @ForeignKey(() => QRoles)
  @Column({ type: DataType.INTEGER, allowNull: true })
  q_role_id: number;

  @BelongsTo(() => QRoles)
  qRole: QRoles;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'active' })
  status: string;

  @Column(DataType.TEXT)
  address: string;

  @Column
  city: string;

  @Column({ allowNull: true })
  pincode: string;

  @Column(DataType.JSON)
  permissions: any;

  @Column({ allowNull: true })
  profile_photo: string;

  @Column({ allowNull: true })
  last_login: Date;

  @Column({ allowNull: true })
  created_by: string;

  @Column({ allowNull: true })
  updated_by: string;
}
