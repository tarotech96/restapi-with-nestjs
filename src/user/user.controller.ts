import { UserDto } from './../dto/userDto';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

  constructor(private userService: UserService){}

  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post('/create')
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  }

  @Put(':id')
  editUser(
    @Param('id') id: number, 
    @Body() data: { firstName: string, lastName: string }
    ) {
    return this.userService.editUser(id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }


}
