import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Plan } from './Plan';

@Table({
  tableName: 'plan_infrastructure',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
})
export class PlanInfrastructure extends Model {
  @ForeignKey(() => Plan)
  @Column(DataTypes.BIGINT.UNSIGNED)
  plan_id: number;
  @BelongsTo(() => Plan)
  plan: Plan;

  // @Column(DataTypes.STRING)
  // infra_type: string;
  @Column(
    DataTypes.ENUM(
      'road',
      'drain',
      'sewer',
      'park',
      'water_line',
      'electric_line',
    ),
  )
  infra_type: string;

  @Column(DataTypes.GEOMETRY)
  geometry: any;
  @Column(DataTypes.JSON)
  geo_json: any;
}
