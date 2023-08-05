import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DB } from 'src/storage/storage.service';
import { User } from './entities/user.entity';
import { validate } from 'uuid';
import { Prisma, User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private storage: DB, private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    if (!('login' in data) || !('password' in data)) {
      throw new BadRequestException('Body does not contain required fields');
    }

    if (typeof data.login !== 'string' || typeof data.password !== 'string') {
      throw new BadRequestException('Body does not contain required fields');
    }

    data.version = 1;
    const user = await this.prisma.user.create({ data });
    return this.convert(user);
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      return this.convert(user);
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;
    const { id } = where;

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== data.oldPassword) {
      throw new ForbiddenException('oldPassword is wrong');
    }

    const userUpdated = await this.prisma.user.update({
      data: {
        password: data.newPassword,
        version: user.version + 1,
      },
      where,
    });

    return this.convert(userUpdated);
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    try {
      await this.prisma.user.delete({
        where,
      });
      return;
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  private convert(data: UserModel): User {
    const { id, login, password, version, createdAt, updatedAt } = data;

    const user = new User({
      id,
      login,
      password,
      version,
      createdAt: createdAt.getTime(),
      updatedAt: updatedAt.getTime(),
    });

    return user;
  }
}
