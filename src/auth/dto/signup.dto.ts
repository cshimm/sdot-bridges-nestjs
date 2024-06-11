import { IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "../schema/userAuth.model";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly role: Role;

  @IsNotEmpty()
  @IsArray()
  readonly favorites: string[];
}
