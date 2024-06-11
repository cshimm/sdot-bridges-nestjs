import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../schemas/user.model";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly password: string;
  
  @IsOptional()
  @IsArray()
  readonly favorites: string[];

  @IsOptional()
  @IsEnum(Role)
  readonly role: string;
}