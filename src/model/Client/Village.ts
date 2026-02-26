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

import { Tehsil } from './Tehsil';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'villages',
  timestamps: false,
})
export class Village extends Model {
  //   @PrimaryKey
  //   @AutoIncrement
  //   @Column(DataTypes.BIGINT)
  //   id: number;

  @ForeignKey(() => Tehsil)
  @Column(DataTypes.BIGINT)
  tehsil_id: number;

  @BelongsTo(() => Tehsil)
  tehsil: Tehsil;

  @Column(DataTypes.STRING(150))
  name_hi: string;

  @Column(DataTypes.STRING(150))
  name_en: string;
}
