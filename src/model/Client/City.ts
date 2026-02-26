import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { State } from './State';

@Table({
  tableName: 'cities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class City extends Model {
  @ForeignKey(() => State)
  @Column(DataTypes.BIGINT)
  state_id: number;

  @BelongsTo(() => State)
  stateData: State;

  @Column(DataTypes.STRING)
  name_hi: string;

  @Column(DataTypes.STRING)
  name_en: string;
}
