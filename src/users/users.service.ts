import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "./schemas/user.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>){}

  async getAllUsers(): Promise<any> {
    const users: UserDocument[] = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastname: user.lastName,
      email: user.email,
      favorites: user.favorites,
      role: user.role,
    }));
  }

  async getUserById(id: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error){
      throw new HttpException('User not found!', 404);
    }
    if (!user) {
      throw new HttpException('User not found!', 404);
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      favorites: user.favorites,
      role: user.role,
    } as UserDocument;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({ email: email }).exec();
    } catch (error) {
      throw new HttpException('User not found!', 404);
    }
    if (!user) {
      throw new HttpException('User not found!', 404);
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      favorites: user.favorites,
      role: user.role,
    } as UserDocument;
  }

  async updateUser(id: string, user: UserDocument) {
    if (user === null) {
      throw new BadRequestException(`Updated User not supplied`);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedUser) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      id: updatedUser.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: updatedUser.email,
      favorites: updatedUser.favorites,
      role: updatedUser.role,
    } as UserDocument;
  }

  async removeUser(id: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new Error('Error deleting user: ' + error);
    }
  }
}

