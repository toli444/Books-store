import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class PlaceOrderDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  items: string[];
}
