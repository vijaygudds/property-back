import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  HasMany,
  Index,
  Unique,
} from 'sequelize-typescript';
import { Agreement } from './Agreement';
import { DataTypes } from 'sequelize';

interface BuyerDocuments {
  [key: string]: any;
}

@Table({
  tableName: 'buyers',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Buyer extends Model {
  // @PrimaryKey
  // @AutoIncrement
  // @Column({
  //   type: DataType.BIGINT.UNSIGNED,
  //   allowNull: false,
  // })
  // id: number;

  @Unique
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'खरीदार कोड',
  })
  buyer_code: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'नाम (हिंदी)',
  })
  name_hi: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  name_en: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  father_husband_name_hi: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  father_husband_name_en: string;

  @Index('idx_mobile')
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  mobile: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  alternate_mobile: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  aadhaar_number: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  pan_number: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  address_hi: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  address_en: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  permanent_address_hi: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  permanent_address_en: string;

  @Column({
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
  })
  state_id: number;

  @Index('idx_city')
  @Column({
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
  })
  city_id: number;

  @Column({
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
  })
  tehsil_id: number;

  @Column({
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
  })
  village_id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  pincode: string;

  @Column({
    type: DataTypes.DATEONLY,
    allowNull: true,
  })
  date_of_birth: Date;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  occupation: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  photo_url: string;

  @Column({
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('documents');
      return rawValue ? (rawValue as BuyerDocuments) : null;
    },
  })
  documents: BuyerDocuments;

  @Default('active')
  @Column({
    type: DataTypes.ENUM('active', 'inactive', 'blacklisted'),
  })
  status: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  notes: string;

  @HasMany(() => Agreement)
  agreements: Agreement[];
}
