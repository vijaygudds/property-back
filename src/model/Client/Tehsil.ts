import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { City } from './City';
import { Village } from './Village';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'tehsils',
  timestamps: false,
})
export class Tehsil extends Model {
  //   @PrimaryKey
  //   @AutoIncrement
  //   @Column(DataTypes.BIGINT)
  //   id: number;

  @ForeignKey(() => City)
  @Column(DataTypes.BIGINT)
  city_id: number;

  @BelongsTo(() => City)
  city: City;

  @Column(DataTypes.STRING(150))
  name_hi: string;

  @Column(DataTypes.STRING(150))
  name_en: string;

  // Relation
  @HasMany(() => Village)
  villages: Village[];
}
