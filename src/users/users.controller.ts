import { Body, Controller, Delete, Get, Inject, Param, Patch, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../auth/role.guard";
import { Roles } from "../auth/roles.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDocument } from "./schemas/user.model";

@Controller("users")
export class UsersController {
  constructor(
    @Inject("USER_SERVICE") private readonly userService: UsersService
  ) {}
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('')
  async getAllUsers(){
    return await this.userService.getAllUsers();
  }

  @Get('find/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @Patch('update/:id')
  async updateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return await this.userService.updateUser(id, userDto as UserDocument);
  }

  @Delete('remove/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.removeUser(id);
  }
}
