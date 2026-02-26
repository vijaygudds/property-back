import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Plot } from './Plot';
import { State } from './State';
import { City } from './City';
import { Tehsil } from './Tehsil';
import { Village } from './Village';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'properties',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Property extends Model {
  // ✅ Primary Key
  // @PrimaryKey
  // @Column(DataTypes.CHAR(36))
  // id: string;

  // ✅ Basic Info
  @Column(DataTypes.STRING)
  name_hi: string;

  @Column(DataTypes.STRING)
  property_code: string;

  @Column(DataTypes.STRING)
  property_name: string;

  // ✅ ENUM
  @Column(
    DataTypes.ENUM(
      'residential',
      'commercial',
      'agricultural',
      'industrial',
      'mixed',
    ),
  )
  property_type: string;

  // ✅ Address
  @Column(DataTypes.TEXT)
  address: string;

  @Column(DataTypes.TEXT)
  address_hi: string;

  // ✅ Location Names
  @Column(DataTypes.STRING)
  city: string;

  @Column(DataTypes.STRING)
  tehsil: string;

  @Column(DataTypes.STRING)
  district: string;

  @Column(DataTypes.STRING)
  state: string;

  @Column(DataTypes.STRING)
  pincode: string;

  // ✅ Foreign Keys
  @ForeignKey(() => State)
  @Column(DataTypes.BIGINT)
  state_id: number;

  @BelongsTo(() => State)
  stateData: State;

  @ForeignKey(() => City)
  @Column(DataTypes.BIGINT)
  city_id: number;

  @BelongsTo(() => City)
  cityData: City;

  @ForeignKey(() => Tehsil)
  @Column(DataTypes.BIGINT)
  tehsil_id: number;

  @BelongsTo(() => Tehsil)
  tehsilData: Tehsil;

  @ForeignKey(() => Village)
  @Column(DataTypes.BIGINT)
  village_id: number;

  @BelongsTo(() => Village)
  villageData: Village;

  // ✅ Map Data
  @Column(DataTypes.DECIMAL(10, 6))
  latitude: number;

  @Column(DataTypes.DECIMAL(10, 6))
  longitude: number;

  // ✅ Area
  @Column(DataTypes.DECIMAL(15, 2))
  total_area: number;

  @Column(DataTypes.STRING)
  area_unit: string;

  // ✅ Plot Stats
  @Default(0)
  @Column(DataTypes.INTEGER)
  total_plots: number;

  @Default(0)
  @Column(DataTypes.INTEGER)
  available_plots: number;

  @Default(0)
  @Column(DataTypes.INTEGER)
  sold_plots: number;

  @Default(0)
  @Column(DataTypes.INTEGER)
  booked_plots: number;

  // ✅ Status
  @Default('active')
  @Column(DataTypes.ENUM('active', 'inactive', 'completed'))
  status: string;

  // ✅ Extra
  @Column(DataTypes.TEXT)
  description: string;

  @Column(DataTypes.JSON)
  amenities: any;

  @Column(DataTypes.TEXT)
  notes: string;

  // ✅ Relations
  @HasMany(() => Plot)
  plots: Plot[];
}
