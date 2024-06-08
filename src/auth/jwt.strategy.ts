import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/userAuth.model";
import { Model } from "mongoose";
import * as process from "node:process";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    const user = await this.userModel.findById(id);
    if (!user){
      throw new UnauthorizedException('Unauthorized. Please log in.');
    }
    return user;
  }
}