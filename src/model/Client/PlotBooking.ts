import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Plot } from './Plot';
import { Buyer } from './Buyer';

@Table({
  tableName: 'plot_bookings',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: false,
})
export class PlotBooking extends Model {
  //   @PrimaryKey
  //   @AutoIncrement
  //   @Column(DataType.BIGINT.UNSIGNED)
  //   id: number;

  @ForeignKey(() => Plot)
  @Column(DataTypes.BIGINT.UNSIGNED)
  plot_id: number;

  @BelongsTo(() => Plot)
  plot: Plot;

  @ForeignKey(() => Buyer)
  @Column(DataTypes.BIGINT.UNSIGNED)
  buyer_id: number;

  @BelongsTo(() => Buyer)
  buyer: Buyer;

  @Column(DataTypes.DECIMAL(12, 2))
  booking_amount: number;

  @Column(DataTypes.STRING)
  booking_date: Date;

  @Column(DataTypes.STRING)
  status: string;
  @Column(DataTypes.GEOMETRY('POLYGON'))
  boundary: any;
}
