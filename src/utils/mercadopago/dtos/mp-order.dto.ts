import {
  IsArray,
  ValidateNested,
  IsString,
  IsEmail,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MpOrderItem {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  currency_id: string;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  quantity: number;
}

class Payer {
  @IsEmail()
  email: string;
}

class BackUrls {
  @IsString()
  success: string;

  @IsString()
  failure: string;

  @IsString()
  pending: string;
}

export class MpPreferenceData {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MpOrderItem)
  items: MpOrderItem[];

  @IsString()
  external_reference: string;

  @ValidateNested()
  @Type(() => Payer)
  payer: Payer;

  @ValidateNested()
  @Type(() => BackUrls)
  back_urls: BackUrls;

  @IsString()
  auto_return: string;

  @IsString()
  notification_url: string;
}
