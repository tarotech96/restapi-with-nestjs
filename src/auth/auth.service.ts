import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from "src/dto/userDto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {

  }

  async signup(userDto: UserDto) {
    try {
      const findUserByEmail = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      })
      // check user whether already existed
      if (findUserByEmail) {
        throw new HttpException('User has already exists', HttpStatus.BAD_GATEWAY)
      }
      // generate the password hash
      const hash = await argon.hash(userDto.password);
      // save user in the database
      const user = await this.prisma.user.create({
        data: {
          hash,
          email: userDto.email,
          firstName: userDto.firstName,
          lastName: userDto.lastName
        }
      })
      // delete hash property of the user
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      throw new HttpException(
        `Something was wrong... 
        ${error.message}
        `,
        HttpStatus.BAD_GATEWAY)
    }
  }

  async signin(userDto: UserDto) {
    try {
      // find user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: userDto.email
        }
      })
      // if user does not exist throw exception
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      // compare password
      const pwMatches = await argon.verify(user.hash, userDto.password);
      // if password incorrect throw exception
      if (!pwMatches) {
        throw new ForbiddenException('Credentials incorrect')
      }
      // delete hash property of the user 
      delete user.hash;
      // get access token
      const { access_token } = await this.signToken(user.id, user.email);
      return {
        user,
        access_token
      };
    } catch (error) {
      throw new HttpException('Something went wrong!!!', HttpStatus.BAD_GATEWAY)
    }
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    }
    const secretKey = this.config.get('JWT_SECRET_KEY');

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: "10m",
        secret: secretKey
      })
    }
  }

}
