import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    const hashedPassword = await hash(data.password, +process.env.CRYPT_SALT);
    data.password = hashedPassword;

    return await this.usersService.create(data as Prisma.UserCreateInput);
  }

  async login(data: CreateUserDto) {
    const { login } = data;
    const user = await this.prisma.user.findFirst({
      where: {
        login,
      },
    });

    if (user) {
      const passwordsEquals = await compare(data.password, user.password);

      if (passwordsEquals) {
        const { id, login } = user;
        const tokens = await this.generateTokens(id, login);
        console.log(tokens);
        return tokens;
      }
    }

    throw new ForbiddenException(' Invalid login or password');
  }

  private async generateTokens(userId: string, login: string) {
    const payload = { userId, login };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }
}
