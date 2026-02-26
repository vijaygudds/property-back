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
import { Property } from './Property';

@Table({
  tableName: 'map_images',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
})
export class MapImage extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'संपत्ति आईडी - Property reference',
  })
  property_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'शीर्षक - Map image title',
  })
  title: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    comment: 'छवि URL - Image URL',
  })
  image_url: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'थंबनेल URL - Thumbnail URL',
  })
  thumbnail_url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'चौड़ाई - Image width in pixels',
  })
  image_width: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'ऊंचाई - Image height in pixels',
  })
  image_height: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'फाइल प्रकार - File type (png, jpg, etc.)',
  })
  file_type: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'फाइल साइज - File size in bytes',
  })
  file_size: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    comment: 'डिफ़ॉल्ट नक्शा - Is default map',
  })
  is_default: boolean;

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    comment: 'क्रम - Display order',
  })
  display_order: number;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'inactive'),
    comment: 'स्थिति - Status',
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'विवरण - Description',
  })
  description: string;

  @BelongsTo(() => Property)
  property: Property;
}
