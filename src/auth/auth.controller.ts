import { Controller, Body, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { UserDto } from "src/dto/userDto";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  signup(@Body() userDto: UserDto) {
    return this.authService.signup(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signin(@Body() userDto: UserDto) {
    return this.authService.signin(userDto);
  }
}