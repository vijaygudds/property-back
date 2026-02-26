import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Property } from './Property';
import { Plan } from './Plan';
import { Agreement } from './Agreement';
import { PlotBooking } from './PlotBooking';

@Table({
  tableName: 'plots',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Plot extends Model {
  @ForeignKey(() => Property)
  @Column(DataTypes.BIGINT.UNSIGNED)
  property_id: number;
  @BelongsTo(() => Property)
  property: Property;
  @ForeignKey(() => Plan)
  @Column(DataTypes.BIGINT.UNSIGNED)
  plan_id: number;
  @BelongsTo(() => Plan)
  plan: Plan;

  @Column(DataTypes.STRING)
  plot_number: string;

  @Column(DataTypes.STRING)
  block: string;

  @Column(DataTypes.STRING)
  phase: string;

  @Column(DataTypes.DECIMAL(18, 2))
  area_sqft: number;

  @Column(DataTypes.DECIMAL(10, 2))
  length: number;

  @Column(DataTypes.DECIMAL(10, 2))
  width: number;

  @Column(DataTypes.STRING)
  facing_hi: string;

  @Column(DataTypes.STRING)
  facing_en: string;

  @Column(DataTypes.STRING)
  plot_type_hi: string;

  @Column(DataTypes.STRING)
  plot_type_en: string;

  @Column(DataTypes.DECIMAL(18, 2))
  rate: number;

  @Column(DataTypes.ENUM('available', 'hold', 'booked', 'sold'))
  status: string;

  @Column(DataTypes.STRING)
  khasra_number: string;

  @Column(DataTypes.STRING)
  registry_status: string;

  // @Column(DataTypes.INTEGER)
  // map_x: number;

  // @Column(DataTypes.INTEGER)
  // map_y: number;

  // @Column(DataTypes.INTEGER)
  // map_width: number;

  // @Column(DataTypes.INTEGER)
  // map_height: number;
  @Column(DataTypes.DECIMAL(10, 7))
  centroid_lat: number;
  @Column(DataTypes.DECIMAL(10, 7))
  centroid_lng: number;

  // @Column(DataTypes.JSON)
  // polygon_coordinates: any;

  @Column(DataTypes.TEXT)
  notes: string;

  @Column(DataTypes.GEOMETRY('POLYGON'))
  boundary: any;

  @Column(DataTypes.GEOMETRY('POINT'))
  centroid: any;

  @HasMany(() => PlotBooking)
  plot_bookings: PlotBooking[];
  @HasMany(() => Agreement)
  agreements: Agreement[];
}
