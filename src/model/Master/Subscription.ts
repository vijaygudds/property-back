import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Client } from './Client';

@Table({ tableName: 'subscriptions', timestamps: true })
export class Subscription extends Model {
  @PrimaryKey
  @Column({ type: DataType.CHAR(36) })
  id: string;

  @ForeignKey(() => Client)
  @Column({ type: DataType.CHAR(36) })
  client_id: string;

  @BelongsTo(() => Client)
  client: Client;

  @Column
  plan_name: string;

  @Column({
    type: DataType.ENUM('monthly', 'quarterly', 'yearly', 'lifetime'),
    defaultValue: 'monthly',
  })
  billing_cycle: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @Column({ type: DataType.DATE })
  start_date: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  end_date: Date;

  @Column({
    type: DataType.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active',
  })
  status: string;

  @Column({ defaultValue: 0 })
  max_users: number;

  @Column({ defaultValue: 0 })
  max_properties: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  auto_renewal: boolean;

  @Column(DataType.TEXT)
  notes: string;
}
