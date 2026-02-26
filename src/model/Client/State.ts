import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { City } from './City';

@Table({
  tableName: 'states',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class State extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.BIGINT)
  id: number;

  @Column(DataTypes.STRING)
  name_hi: string;

  @Column(DataTypes.STRING)
  name_en: string;

  @Column(DataTypes.STRING)
  code: string;

  @Default(true)
  @Column(DataTypes.BOOLEAN)
  is_active: boolean;

  @HasMany(() => City)
  cities: City[];
}
