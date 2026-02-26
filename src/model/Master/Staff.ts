import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  DataType,
  AllowNull,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Client } from './Client';
import { ValidationException } from 'src/qnatk/src/Exceptions/ValidationException';
import { Op } from 'sequelize';
import QRoles from 'src/qnatk/src/models/QRoles';
import { BIGINT } from 'sequelize';

@Table({ tableName: 'super_user', createdAt: 'created_at', updatedAt: false })
export class Staff extends Model {
  // @PrimaryKey
  // @Column({ type: DataType.CHAR(36) })
  // id: string;

  @Column
  name: string;
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true, // ensures the username is not empty
      async isUnique(value: string) {
        // Custom async validator for checking if the username is unique
        const condition = this.id
          ? { username: value, id: { [Op.ne]: this.id } }
          : { username: value };
        const user = await Staff.findOne({ where: condition });
        if (user) {
          throw new ValidationException({
            user_name: ['username already in use'],
          });
        }
        return true;
      },
      // You can add more custom validators here
    },
  })
  username: string;
  // @Column({ unique: true })
  // email: string;

  @Column({ unique: true })
  mobile: string;

  @Column
  password: string;

  @Column({
    type: DataTypes.ENUM('super_admin', 'admin', 'support'),
    defaultValue: 'super_admin',
  })
  role: string;

  @Column({
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  })
  status: string;
  @Column
  is_active: boolean;

  @ForeignKey(() => Client)
  @Column({ type: DataTypes.BIGINT, allowNull: true })
  client_id: number;

  @BelongsTo(() => Client)
  client: Client;

  // @Column(DataType.JSON)
  // permissions: any;
  // @ForeignKey(() => QRoles)
  @Column({
    type: DataTypes.INTEGER,
  })
  q_role_id: number;
  @BelongsTo(() => QRoles, 'q_role_id')
  qRole: QRoles;
  @Column({ type: DataType.DATE, allowNull: true })
  last_login: Date;
}
