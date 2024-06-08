import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/useAuth.model";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {
  }

  async signUp(signUpDto: SignupDto): Promise<{ token: string }> {
    const {
      firstName,
      lastName,
      email,
      password,
      role
    } = signUpDto;
    if (await this.userModel.findOne({ email })) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with this email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    const token = this.jwtService.sign({
      id: user._id,
      role: user.role
    });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const {email, password} = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      id: user._id,
      role: user.role,
      firstName: user.firstName
    });
    return { token };
  }
}
