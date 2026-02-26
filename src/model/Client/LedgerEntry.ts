import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Agreement } from './Agreement';

@Table({
  tableName: 'ledger_entries',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
})
export class LedgerEntry extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Agreement)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'अनुबंध आईडी - Agreement reference',
  })
  agreement_id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'रसीद संख्या - Receipt number',
  })
  receipt_number: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'लेनदेन तिथि - Transaction date',
  })
  transaction_date: Date;

  @Column({
    type: DataType.ENUM('debit', 'credit'),
    allowNull: false,
    comment: 'प्रकार - Entry type (debit or credit)',
  })
  entry_type: string;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
    comment: 'राशि - Amount',
  })
  amount: number;

  @Column({
    type: DataType.ENUM(
      'cash',
      'cheque',
      'online_transfer',
      'upi',
      'card',
      'demand_draft',
    ),
    allowNull: false,
    comment: 'भुगतान विधि - Payment method',
  })
  payment_method: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'लेनदेन संदर्भ - Transaction reference (UTR, Transaction ID)',
  })
  transaction_reference: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'बैंक का नाम - Bank name',
  })
  bank_name: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'चेक तिथि - Cheque date',
  })
  cheque_date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'विवरण - Description',
  })
  description: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'रसीद URL - Receipt URL',
  })
  receipt_url: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'प्रविष्टि करने वाला - Created by user ID',
  })
  created_by: string;

  @Default('completed')
  @Column({
    type: DataType.ENUM('pending', 'completed', 'cancelled'),
    comment: 'स्थिति - Entry status',
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'टिप्पणी - Notes',
  })
  notes: string;

  @BelongsTo(() => Agreement)
  agreement: Agreement;
}
