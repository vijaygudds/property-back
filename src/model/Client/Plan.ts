import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Property } from './Property';

@Table({
  tableName: 'plans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
})
export class Plan extends Model {
  //   @PrimaryKey
  //   @AutoIncrement
  //   @Column(DataType.BIGINT.UNSIGNED)
  //   id: number;

  @ForeignKey(() => Property)
  @Column(DataTypes.BIGINT.UNSIGNED)
  property_id: number;

  @Column(DataTypes.STRING)
  name_hi: string;

  @Column(DataTypes.STRING)
  name_en: string;

  @Column(DataTypes.TEXT)
  plan_image_url: string;

  // @Column(DataTypes.INTEGER)
  // total_plots: number;
  @Column(DataTypes.GEOMETRY('POLYGON'))
  plan_boundary: any;

  @BelongsTo(() => Property)
  property: Property;
}
