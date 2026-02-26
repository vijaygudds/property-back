import {
  IsNumber,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MyDate } from '../helper/my-date';

class ClientDTO {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsString()
  address: string;

  // Code: 'UDR', id: 2, PerformClosings: true, SendSMS: true, published: true

  @IsString()
  client_code: string;

  @IsString()
  status: string;

  @IsString()
  standalone_db_name: string;

  @IsString()
  database_name: string;
}

export class UserDTO {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNumber()
  client_id: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ClientDTO)
  client: ClientDTO;

  @IsObject()
  workingDate: MyDate;

  // @IsString()
  // AccessLevel: string;

  @IsString()
  name: string;

  // @IsString()
  // father_name: string;

  // @IsString()
  // mother_name: string;

  @IsBoolean()
  is_active: boolean;

  // @IsString()
  // pan_no: string;

  @IsString()
  mobile: string;

  // @IsString()
  // DOB: string;

  @IsString()
  created_at: string;
}
