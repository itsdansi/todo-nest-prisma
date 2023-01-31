import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from './user.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import passport from 'passport';

interface FormatLogin extends Partial<User> {
  email: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //use by user module to change user password
  async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('INVALID_CREDENTIALS1', HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new HttpException('INVALID_CREDENTIALS1', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.new_password, 10) },
    });
  }

  //use by auth module to register user in database
  async create(userDto: CreateUserDto | any): Promise<any> {
    // check if the user exists in the db
    const userInDb = await this.prisma.user.findUnique({
      where: { email: userDto.email },
    });

    if (userInDb) {
      throw new HttpException('USER_ALREADY_EXISTS!', HttpStatus.CONFLICT);
    }
    const data = {
      ...userDto,
      password: await hash(userDto.password, 10),
    };
    return await this.prisma.user.create({ data });
  }

  //
  async validateUser(email: any): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  //use by auth module to login user
  async findByEmail({ email, password }: LoginUserDto): Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException('INVALID_CREDENTIALS!', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('INVALID_CREDENTIALS!', HttpStatus.UNAUTHORIZED);
    }

    const { password: p, ...rest } = user;
    return rest;
  }

  //use by auth module to get user in database
  async findByPayload({ email }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }
}
