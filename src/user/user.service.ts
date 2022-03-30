import { UserDto } from 'src/dto/userDto';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }


  async createUser(user: UserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          hash: user.password,
        }
      })
      delete newUser.hash;
      return newUser;

    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async editUser(id: number, data: { firstName: string, lastName: string }) {
    try {
      console.log(id, data);
      const findUserById = await this.prisma.user.findUnique({
        where: {
          id,
        }
      })

      if (!findUserById) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // edit user 
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName
        }
      })

      // delete hash property of the user
      delete user.hash;

      return user;

    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async deleteUser(id: number) {
    try {
      const findUserById = await this.prisma.user.findUnique({
        where: {
          id,
        }
      })

      if (!findUserById) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.delete({
        where: {
          id,
        }
      })

    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.BAD_REQUEST
      )
    }
  }


}