import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateShiftDto } from './create-shift.dto';

export class UpdateShiftDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  start?: Date;

  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  end?: Date;
}
