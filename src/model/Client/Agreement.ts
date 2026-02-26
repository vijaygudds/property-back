import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Plot } from './Plot';
import { Buyer } from './Buyer';
import { LedgerEntry } from './LedgerEntry';

interface AgreementTerms {
  [key: string]: any;
}

@Table({
  tableName: 'agreements',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
})
export class Agreement extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'अनुबंध संख्या - Agreement number',
  })
  agreement_number: string;

  @ForeignKey(() => Plot)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'प्लॉट आईडी - Plot reference',
  })
  plot_id: string;

  @ForeignKey(() => Buyer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'खरीदार आईडी - Buyer reference',
  })
  buyer_id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'अनुबंध तिथि - Agreement date',
  })
  agreement_date: Date;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
    comment: 'कुल राशि - Total amount',
  })
  total_amount: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: true,
    comment: 'बुकिंग राशि - Booking amount',
  })
  booking_amount: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: true,
    comment: 'भुगतान राशि - Total paid amount',
  })
  paid_amount: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: true,
    comment: 'शेष राशि - Balance amount',
  })
  balance_amount: number;

  @Default('installment')
  @Column({
    type: DataType.ENUM('full_payment', 'installment', 'emi'),
    comment: 'भुगतान प्रकार - Payment type',
  })
  payment_type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'किस्तों की संख्या - Number of installments',
  })
  number_of_installments: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: true,
    comment: 'किस्त राशि - Installment amount',
  })
  installment_amount: number;

  @Default('active')
  @Column({
    type: DataType.ENUM('draft', 'active', 'completed', 'cancelled'),
    comment: 'स्थिति - Agreement status',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'पंजीकरण तिथि - Registration date',
  })
  registration_date: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    comment: 'पंजीकरण संख्या - Registration number',
  })
  registration_number: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'अनुबंध दस्तावेज URL - Agreement document URL',
  })
  agreement_document_url: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'नियम और शर्तें - Terms and conditions in JSON',
    get() {
      const rawValue = this.getDataValue('terms_and_conditions');
      return rawValue ? (rawValue as AgreementTerms) : null;
    },
  })
  terms_and_conditions: AgreementTerms;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'टिप्पणी - Notes',
  })
  notes: string;

  @BelongsTo(() => Plot)
  plot: Plot;

  @BelongsTo(() => Buyer)
  buyer: Buyer;

  @HasMany(() => LedgerEntry)
  ledger_entries: LedgerEntry[];
}
